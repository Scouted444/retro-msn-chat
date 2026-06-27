const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

const users = {}; // socket.id -> username

io.on("connection", (socket) => {

  // LOGIN
  socket.on("login", (username) => {
    users[socket.id] = username;

    io.emit("users", Object.values(users));
  });

  // PRIVATE MESSAGE
  socket.on("private message", ({ to, from, text }) => {
    for (let id in users) {
      if (users[id] === to) {
        io.to(id).emit("private message", { from, text });
      }
    }
  });

  // TYPING
  socket.on("typing", ({ to, from }) => {
    for (let id in users) {
      if (users[id] === to) {
        io.to(id).emit("typing", { from });
      }
    }
  });

  // NUDGE
  socket.on("nudge", ({ to, from }) => {
    for (let id in users) {
      if (users[id] === to) {
        io.to(id).emit("nudge", { from });
      }
    }
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", Object.values(users));
  });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log("Running on " + PORT));
