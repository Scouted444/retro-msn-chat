const socket = io();

let username = "";
let currentChat = null;

function login() {
  username = document.getElementById("usernameInput").value;
  if (!username) return;

  socket.emit("login", username);

  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("chatApp").classList.remove("hidden");
  document.getElementById("currentUser").innerText = username;
}

// update friend list
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

socket.on("private message", (data) => {
  addMessage(data.from + ": " + data.text, false);
});

function addMessage(text, me) {
  const msg = document.createElement("div");
  msg.className = "message" + (me ? " me" : "");
  msg.innerText = text;

  document.getElementById("messages").appendChild(msg);
}
