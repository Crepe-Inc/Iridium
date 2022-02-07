const sniffer = require('../../backend/sniffer');

async function execute() {
    sniffer.stopProxySession();
    return 1;
}

module.exports = {execute}