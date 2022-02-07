var ws = new WebSocket('ws://localhost:40510');

// event emmited when connected
ws.onopen = function () {
    console.log('[DEBUG] ws://localhost:40510 connected @ ' + new Date());

    // sending a send event to websocket server
    ws.send('{"cmd":"ws_connect","data":""}')
}

// event emmited when receiving message 
ws.onmessage = function (ev) {
    evtHandler(ev);
}

class WSMessage {
    constructor(cmd, data) {
        this.cmd = cmd;
        this.data = data;
    }
    send = () => ws.send(JSON.stringify(this));
}