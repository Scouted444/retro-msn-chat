const socket = io();

let username = "";
let currentChat = null;

// LOGIN
function login() {
  username = document.getElementById("usernameInput").value;
  if (!username) return;

  socket.emit("login", username);

  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("chatApp").classList.remove("hidden");

  document.getElementById("currentUser").innerText = username;
}

// FRIEND LIST
socket.on("users", (users) => {
  const box = document.querySelector(".friends");
  box.innerHTML = "<p class='section'>Friends</p>";

  users.forEach(u => {
    if (u === username) return;

    const div = document.createElement("div");
    div.className = "friend";
    div.innerText = "🟢 " + u;

    div.onclick = () => {
      currentChat = u;
      document.querySelector(".chat-header").innerText = "Chat with " + u;
      document.getElementById("messages").innerHTML = "";
    };

    box.appendChild(div);
  });
});

// SEND MESSAGE
function sendMessage() {
  const text = document.getElementById("msgInput").value;
  if (!text || !currentChat) return;

  socket.emit("private message", {
    to: currentChat,
    from: username,
    text
  });

  addMessage("You: " + text, true);
  document.getElementById("msgInput").value = "";
}

// RECEIVE MESSAGE
socket.on("private message", (data) => {
  addMessage(data.from + ": " + data.text, false);
});

// TYPING
document.getElementById("msgInput").addEventListener("input", () => {
  if (!currentChat) return;

  socket.emit("typing", {
    to: currentChat,
    from: username
  });
});

socket.on("typing", (data) => {
  const t = document.getElementById("typing");
  t.innerText = data.from + " is typing...";

  setTimeout(() => t.innerText = "", 1000);
});

// NUDGE
function nudge() {
  if (!currentChat) return;

  socket.emit("nudge", {
    to: currentChat,
    from: username
  });

  shake();
}

socket.on("nudge", () => {
  shake();
});

function shake() {
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 500);
}

// MESSAGE UI
function addMessage(text, me) {
  const msg = document.createElement("div");
  msg.className = "message" + (me ? " me" : "");
  msg.innerText = text;

  document.getElementById("messages").appendChild(msg);
}
