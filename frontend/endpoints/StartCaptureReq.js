const sniffer = require('../../backend/sniffer');

async function execute() {
    sniffer.startPacketCapture();
    return 1;
}

module.exports = {execute}