const wd = require("windivert")
const decoders = wd.decoders;
const PROTOCOL = decoders.PROTOCOL;
const config = require('../config')

function getCaptureParameters() {
	return {
		type: "windivert"
	}
}

function startCapture(options, cb) {
	options.filter = options.filter || config.captureFilter
		|| "udp.DstPort == 22101 or udp.DstPort == 22102 or udp.SrcPort == 22101 or udp.SrcPort == 22102";

	if (!options || !options.filter) {
		throw new Error("option filter required");
	}
	const handle = wd.listen(options.filter, function (buffer, inbound) {
		const ip = decoders.IPV4(buffer, 0);
		const udp = decoders.UDP(buffer, ip.offset);
		if (ip.info.protocol !== PROTOCOL.IP.UDP) {
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
	});

	return function () {
		handle.close()
	}
}


module.exports = {
	getCaptureParameters,
	startCapture
}
