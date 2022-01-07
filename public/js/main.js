const chatform = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");

//get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
//console.log(username, room);
//message from server
const socket = io();

//jion chat
socket.emit("joinRoom", { username, room });
socket.on("message", (message) => {
  console.log(message);
  Messageoutput(message);
  //for scroll down at last message
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

chatform.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  // to clear the input section
  e.target.elements.msg.value = " ";
  e.target.elements.msg.focus();
});
//output message to dom
function Messageoutput(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<br><sub>${message.time}</sub></p>
    <p class="text">
    ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
