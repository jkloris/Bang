const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const Player = require("./public/js/players.js");
const Game = require("./public/js/game.js");

app.use(express.static(path.join(__dirname, "public")));

var hra = new Game();

io.on("connection", socket =>{
    //niekto sa pripojil
    playerConnected(socket.id);
    gameUpdate();

    //zachytenie suradnice kliknutia
    socket.on("clicked", (mouse, id)=>{

    })

    //odpojenie hraca
    socket.on("disconnect",()=>{
        playerDisconnect(socket.id);
        gameUpdate();
    })

})

const PORT = process.env.PORT || 8888;
const IP = 'localhost';
server.listen(PORT, IP, ()=>console.log("running on " + PORT));


//update hry
function gameUpdate(){
      //zatial si len posielam info o hre
    io.emit("message", hra,);
}

function playerDisconnect(id){
    var index = hra.hraci.findIndex(user => user.id === id);
        if(index != -1){
            hra.hraci.splice(index,1);
            io.emit("message", id + "sa odpojil");
        }     
}

function playerConnected(id){
    io.emit("message", id+ "sa pripojil");
    hra.hraci.push(new Player(id, 4, null, null, null));
}