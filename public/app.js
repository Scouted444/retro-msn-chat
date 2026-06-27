const socket = io();

let username = "";

/* LOGIN */
function login() {
  username = document.getElementById("usernameInput").value;

  if (!username) return;

  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("chatApp").classList.remove("hidden");

  document.getElementById("currentUser").innerText = username;
}

/* SEND MESSAGE */
function sendMessage() {
  const input = document.getElementById("msgInput");
  const text = input.value;

  if (!text) return;

  socket.emit("chat message", {
    user: username,
    text: text
  });

  input.value = "";
}

/* RECEIVE MESSAGE */
socket.on("chat message", (data) => {
  addMessage(data.user + ": " + data.text, data.user === username);
});

/* RENDER MESSAGE */
function addMessage(text, isMe) {
  const msg = document.createElement("div");
  msg.classList.add("message");

  if (isMe) msg.classList.add("me");

  msg.innerText = text;

  document.getElementById("messages").appendChild(msg);

  // auto scroll
  const box = document.getElementById("messages");
  box.scrollTop = box.scrollHeight;
}

/* ENTER KEY SUPPORT */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && document.activeElement.id === "msgInput") {
    sendMessage();
  }
});