const sniffer = require('../../backend/sniffer');

async function execute() {
    return {
        sessionStarted: sniffer.getSessionStatus(),
        captureStarted: sniffer.getCaptureStatus()
    }
}

module.exports = {execute}