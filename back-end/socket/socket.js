const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const users = {};

const getReceiverSocketID = (receiverID) => users[receiverID];

io.on("connection", (socket) => {
  const userID = socket.handshake.query.userID;

  if (userID) {
    users[userID] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("disconnect", () => {
    if (userID) {
      delete users[userID];
    }

    io.emit("getOnlineUsers", Object.keys(users));
  });
});

module.exports = { app, server, io, getReceiverSocketID };
