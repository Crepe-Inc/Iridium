const sniffer = require('../../backend/sniffer');

async function execute(cmd,data) {
    sniffer.startPacketCapture(data);
    return 1;
}

module.exports = {execute}
