const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("chat message", (data) => {
    io.emit("chat message", data); // broadcast to everyone
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

http.listen(3000, () => {
  console.log("MSN running on http://localhost:3000");
});