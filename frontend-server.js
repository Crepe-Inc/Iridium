const http = require('http');
const fs = require('fs');
const path = require('path')
const log = new (require("./util/log"))('Frontend', 'cyanBright');

let requestListener = async (req, res) => {
    let filePath = path.join(__dirname, "frontend", "public", req.url.split("?")[0]);
    try {
        res.writeHead(200);
        const file = await fs.promises.readFile(filePath);
        res.end(file);
    }
    catch (e) {
        res.writeHead(404, { "Content-Type": "text/html" });
        log.error("404 " + req.url);
        res.end('404 Not Found');
    }
}



module.exports = {
    execute() {
        http.createServer({}, requestListener).listen(1984, () => {
            log.start('Frontend running on http://localhost:1984/index.html')
        });
        //webSocket();
    },
}