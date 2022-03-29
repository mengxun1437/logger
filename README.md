# logger
```js
const logger = new Logger({
  interval: 1000,
  file: {
    path: "./test_log.txt",
  },
  ws: {
    url: "ws://localhost:10311/logger",
  },
});
```

`file` allow us to record log at locale

`ws` allow us to show log by websocket

*tip: the package is WIP*



*you can perform like this to preview*

`node ./test/server.js`

`open client.html`

![image-20220329214959576](http://img-mengxun.zerokirin.online/20220329214959.png)

![image-20220329215006377](http://img-mengxun.zerokirin.online/20220329215006.png)