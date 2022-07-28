const sniffer = require('../../backend/sniffer');

async function execute() {
    sniffer.stopPacketCapture();
    return 1;
}

module.exports = {execute}
