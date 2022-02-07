class WSMessage {
    constructor(cmd, data) {
        this.cmd = cmd;
        this.data = data;
    }
    parse = () => JSON.stringify(this);
}
module.exports = {
    WSMessage: WSMessage
}