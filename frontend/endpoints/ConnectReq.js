const sniffer = require('../../backend/sniffer');

async function execute() {
    return {
        sessionStarted: sniffer.getSessionStatus()
    }
}

module.exports = {execute}