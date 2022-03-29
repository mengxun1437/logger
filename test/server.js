const { Logger } = require("../src/logger");
const WebSocket = require("ws");
const pds = (num) => num.toString().padStart(2, "0");

// start ws server
const clients = [];
const wsServer = new WebSocket.Server({ port: 10311 });
if (wsServer) {
  console.log(`ws server connect successfully~`);
  wsServer.on("connection", (client, req) => {
    clients.push({
      url: req.url,
      client,
    });
    client.send("server recieved your message~");
    client.on("message", (data) => {
      clients.forEach((cli) => {
        if (cli.url === req.url) {
          cli.client.send(`${data}`);
        }
      });
    });
  });
}

wsServer.on("error", (error) => {
  console.log(`ws server error:${error}`);
});

const logger = new Logger({
  interval: 1000,
  file: {
    path: "./test_log.txt",
  },
  ws: {
    url: "ws://localhost:10311/logger",
  },
});

for (let i = 0; i < 10000; i++) {
  setTimeout(() => {
    const date = new Date();
    for (let j = 0; j < Math.floor(Math.random() * 10); j++) {
      const sendData = `[${date.toLocaleDateString()} ${pds(
        date.getHours()
      )}:${pds(date.getMinutes())}:${pds(date.getSeconds())}] ${i} - ${j}`;
      logger.log(sendData);
    }
    console.log("\n");
  }, i * 1000);
}

process.on("SIGINT", () => {
  try {
    process.exit(1);
  } catch {}
});

process.on("exit", () => {
  try {
    logger.overClear();
  } catch {}
});
