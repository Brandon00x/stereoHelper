const http = require("http");
var nodeLIRC = require('node-lirc');
nodeLIRC.init();

//create server to listen
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
        console.log("Volume Relative: " + JSON.parse(data).volRelative);
        console.log("Volume Absolute: " + JSON.parse(data).volAbsolute);
        res.end();
        determineVolType()
      })
  
  function determineVolType() {
    //math variables
    let volPercent = JSON.parse(data).volRelative
    let volAbsolute = JSON.parse(data).volAbsolute
    let counterRelative = Math.abs(volPercent/10)
    let counterAbsolute = Math.abs(volAbsolute/10)

    //use relative vol
    if (volPercent != 0 && volPercent != undefined){
      nodeLIRC.send("Logitech_Z906", "AUX");
      for (i = 0; i < counterRelative; i++){
        nodeLIRC.send("Logitech_Z906", "VOLUME_DOWN");
      }
      nodeLIRC.send("Logitech_Z906", "INPUT_3");
    }
    //use vol absolute
    else if (volAbsolute != 0 && volPercent != undefined){
      nodeLIRC.send("Logitech_Z906", "AUX");
      for (i = 0; i < 12; i++){
        nodeLIRC.send("Logitech_Z906", "VOLUME_DOWN");
      }
      //Google Assitant does not Support Volume Up Unless Configured With Device, I use a Pi. (using absolute volume and setting to 0 is a workaround.)
      for (i = 0; i < counterAbsolute; i++){
        nodeLIRC.send("Logitech_Z906", "VOLUME_UP");
      }
      nodeLIRC.send("Logitech_Z906", "INPUT_3");
    }
  }

  //To Be Used In Future
  function powerOff(){
    nodeLIRC.send("Logitech_Z906", "POWER");
  }
  function inputOptical(){
    nodeLIRC.send("Logitech_Z906", "INPUT_3");
  }
  function inputBluetooth(){
    nodeLIRC.send("Logitech_Z906", "INPUT_7");
  }     
})

server.listen(8081, () => console.log("Webhook Server Listening on 8081."))