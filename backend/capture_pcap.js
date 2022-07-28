const Cap = require("cap").Cap;
const decoders = require("cap").decoders;
const PROTOCOL = decoders.PROTOCOL;
const config = require('../config')

function getCaptureParameters() {
    const devs = Cap.deviceList()
    const devices = devs.map(x => {
        const addr = x.addresses.find(a => a.addr.match(/^(\d+\.){3}\d+$/)) || {}
        return {
            name: x.description,
            addr: addr.addr
        }
    }).filter(x => x.addr)
    return {
        type: "pcap",
        devices: devices
    }
}

function startCapture(options, cb) {
    options.filter = options.filter || config.captureFilter || "udp port 22101 or udp port 22102";

    if (!options || !options.filter || !options.device) {
        throw new Error("option filter and device required");
    }
    const c = new Cap();
    const device = Cap.findDevice(options.device);
    if (!device) {
        throw new Error(`device ${options.device} not found`)
    }
    const filter = options.filter;
    const bufSize = 10 * 1024 * 1024;
    const buffer = Buffer.alloc(65535);

    const linkType = c.open(device, filter, bufSize, buffer);
    if (linkType !== "ETHERNET") {
        throw new Error("open capture device error")
    }

    c.setMinBytes && c.setMinBytes(0);

    c.on("packet", function (nbytes, trunc) {
        const eth = decoders.Ethernet(buffer);
        const ip = decoders.IPV4(buffer, eth.offset);
        const udp = decoders.UDP(buffer, ip.offset);
        if (eth.info.type !== PROTOCOL.ETHERNET.IPV4 || ip.info.protocol !== PROTOCOL.IP.UDP) {
            console.warn("packet type error")
            return
        }
        const packet = {
            crypt: Buffer.from(buffer.slice(udp.offset, udp.offset + udp.info.length)),
            ip: {
                address: ip.info.srcaddr,
                address_dst: ip.info.dstaddr,
                port: udp.info.srcport,
                port_dst: udp.info.dstport
            },
            time: new Date().valueOf()
        }
        cb && cb(packet)
    })

    return function () {
        c.close()
    }
}

module.exports = {
    getCaptureParameters,
    startCapture
}
