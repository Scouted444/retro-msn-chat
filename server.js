const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

const users = {}; // socket.id -> username

io.on("connection", (socket) => {

  socket.on("login", (username) => {
    users[socket.id] = username;
    io.emit("users", Object.values(users));
  });

  socket.on("private message", ({ to, from, text }) => {
    for (let id in users) {
      if (users[id] === to) {
        io.to(id).emit("private message", { from, text });
      }
    }
  });

  socket.on("typing", ({ to, from }) => {
    for (let id in users) {
      if (users[id] === to) {
        io.to(id).emit("typing", { from });
      }
    }
  });

  socket.on("nudge", ({ to, from }) => {
    for (let id in users) {
      if (users[id] === to) {
        io.to(id).emit("nudge", { from });
      }
    }
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", Object.values(users));
  });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log("Running on " + PORT));
