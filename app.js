const http = require("http");
var nodeLIRC = require('node-lirc');
nodeLIRC.init();

const server = http.createServer((req, res) => {
    let data = '';
    if (req.url !== "/stero" || req.method !== "POST") {
      res.writeHead(404, {"Content-Type": "text/plain"});
      return res.end("404");
    }
    req.on('data', chunk => {
        console.log(`Data chunk available: ${data}`)
        data += chunk;
      })
      req.on('end', () => {
        console.log(JSON.parse(data))
        res.end();
        handleResponse()
      })
})

function handleResponse(){
    nodeLIRC.send("Logitech_Z906", "VOLUME_DOWN");
}

server.listen(8081, () => console.log("Webhook Server Listening on 8081."))