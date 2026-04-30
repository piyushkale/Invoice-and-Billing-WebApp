require("dotenv").config();
const express = require("express");
const connectDB = require("./utils/db-connection");
const indexRoute = require("./routes/index");
const { Server } = require("socket.io");
const http = require("http");
const socketAuth = require("./middleware/socketAuth");
const chatSocket = require("./sockets/chatSocket");

const path = require("path");
const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.use(socketAuth);
chatSocket(io);

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));




app.use("/api", indexRoute);

connectDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Server is running on PORT ${PORT}`);
});
