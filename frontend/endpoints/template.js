const fs = require('fs');
const {log} = require('../util/log');
const {WSMessage} = require('../util/classes');

async function execute(id, data) {
    const dataObj = {
        status: "OK"
    }
    log("SERVER", `${id}_rsp`, JSON.stringify(dataObj));
    return new WSMessage(`${id}_rsp`, dataObj).parse(); // Echo back data given
}

module.exports = {execute: execute}