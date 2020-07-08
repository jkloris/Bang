const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", socket =>{
    
})

const PORT = process.env.PORT || 8888;
const IP = 'localhost';
server.listen(PORT, IP, ()=>console.log("running on " + PORT));