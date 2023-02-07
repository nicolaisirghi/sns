const express = require('express');
const app = express();
const { Server } = require("socket.io");
const createServer = (server)=> new Server(server)
  module.exports = createServer