const fs = require("fs");
const WebSocket = require("ws");

class Logger {
  constructor(options = {}) {
    this.loggerList = [];

    const interval = options.interval ?? 5000;
    const file = options.file;
    const ws = options.ws;

    if (ws && ws.url) {
      this.wssConn = new WebSocket(ws.url);
      if (this.wssConn) {
        this.wssConn.binaryType = options.ws.binaryType || "arraybuffer";
      }
      console.log(
        `websocket client start ${this.wssConn ? "successfully" : "failed"}~`
      );
    }

    if ((file && file.path) || this.wssConn) {
      this.intervalId = setInterval(() => {
        this.tmpIndex = this.loggerList.length;
        if (file && file.path) {
          fs.appendFileSync(file.path, this.loggerList.join("\n"));
        }
        if (this.wssConn) {
          try {
            this.loggerList.forEach((log) => {
              this.wssConn.send(log, (err) => {
                err && console.log(`send message error: ${err}`);
              });
            });
            console.log(`send message successfully~`);
          } catch (e) {
            console.log(`send message error: ${e}`);
          }
        }
        this.loggerList.splice(0, this.tmpIndex);
        this.tmpIndex = 0;
      }, interval);
    }
  }

  log(str) {
    this.loggerList.push(str);
    console.log(str);
  }

  overClear() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log(`clear interval ${this.intervalId}`);
    }
    if (this.wssConn) {
      this.wssConn.close();
      console.log(`wss cleared!`);
    }
  }
}

module.exports = {
  Logger,
};
