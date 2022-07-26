const http = require('http');
const fs = require('fs');
const path = require('path')
const log = new (require("../util/log"))('Frontend', 'cyanBright');
const packetsToSend = [];

let requestListener = async (req, res) => {
    let filePath = path.join(__dirname, "..", "frontend", "public", req.url.split("?")[0]);
    // try {
        res.writeHead(200);
        const file = await fs.promises.readFile(filePath);
        res.end(file);
    // }
    // catch (e) {
    //     res.writeHead(404, { "Content-Type": "text/html" });
    //     log.error("404 " + req.url);
    //     res.end('404 Not Found');
    // }
}

const clients = [];
let wss;

function webSocket() {
    var WebSocketServer = require('ws').Server,
        wss = new WebSocketServer({
            port: 40510
        })

    wss.on('connection', function(ws) {
        ws.on('message', function(message) {
            const msg = JSON.parse(message);
            // try {
                let endpoint = require(path.join('..','frontend','endpoints',`${msg.cmd}.js`));
                log.log(`[${msg.cmd}] ${msg.data}`);
                const handler = endpoint.execute(msg.cmd, msg.data).then(data => {
                    if (data === undefined) return;
                    ws.send(JSON.stringify({
                        cmd: msg.cmd.replace('Req', 'Rsp'),
                        data: data
                    }));
                });
            // } catch (e) {
            //     log.error(`${msg.cmd} event not handled`);
            //     ws.send(JSON.stringify({
            //         cmd: msg.cmd.replace('Req', 'Rsp')
            //     }));
            // }
        })
    })

    setInterval(() => {
        if (packetsToSend.length) {
            let msg = {
                cmd: 'PacketNotify',
                data: packetsToSend
            };
            msg = JSON.stringify(msg);
            wss.clients.forEach(ws => {
                ws.send(msg);
            })
            packetsToSend.length = 0;
        }
    }, 20);
}

function queuePacket(packet) {
    packetsToSend.push(packet);
}


module.exports = {
    execute() {
        http.createServer({}, requestListener).listen(1984, () => {
            log.start('Frontend running on http://localhost:1984/index.html')
        });
        //webSocket();
    },
    queuePacket
}