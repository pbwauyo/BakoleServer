const http = require('http');
const port = 3000;
const requestListener = require("./requestListener");

const server = http.createServer(requestListener);
server.listen(port);