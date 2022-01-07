const express = require("express");
const path = require("path");
const http = require("http");
const soketio = require("socket.io");
const formatMessage = require("./utils/message");
const {
  userJoin,
  getCurrentuser,
  userLeave,
  getRoomUsers,
} = require("./utils/user");

const app = express();
const server = http.createServer(app);
const io = soketio(server);

const PORT = 3000 || process.env.PORT;
app.use(express.static(path.join(__dirname, "public")));

const botname = "SubChat";
//use soket to built realtime
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit("message", formatMessage(botname, "Welcome to Subchat"));
    //broardcast when a user connect
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(botname, `${user.username} has joined`));
  });
  //console.log("New Ws Connection...");
  //runs when disconnect

  //to print the msg on client
  socket.on("chatMessage", (msg) => {
    const user = getCurrentuser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botname, `${user.username} has left the chat...`)
      );
    }
  });
});

server.listen(PORT, () => {
  console.log(`listening to the server${PORT}`);
});
