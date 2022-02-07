const sniffer = require('../../backend/sniffer');

async function execute(cmd, data) {
    sniffer[data.ext](data.data);
    return 'Processing file ' + data.name;
}

module.exports = {execute}