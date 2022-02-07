const sniffer = require('../../backend/sniffer');

async function execute() {
    sniffer.startProxySession();
    return 1;
}

module.exports = {execute}