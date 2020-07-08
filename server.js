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

var game = new Game();

io.on("connection", socket =>{
    //niekto sa pripojil
    playerConnected(socket.id);
    gameUpdate();

    //hrac si nastavi meno
    socket.on('set-name', name => {
        let index = game.players.findIndex(user => user.id === socket.id);
        game.players[index].name = name;
        // console.log(game.players[index].name);
        // console.log(index);
        gameUpdate();
    });

    //zachytenie suradnice kliknutia
    socket.on("clicked", (mouse, id)=>{
        console.log("Click: ", mouse, id);
    })

    //odpojenie hraca
    socket.on("disconnect",()=>{
        playerDisconnect(socket.id);
        gameUpdate();
    })

})

const PORT = process.env.PORT || 8888;
const IP = 'localhost';
server.listen(PORT, IP, ()=>console.log("server running on " + PORT));


//update hry
function gameUpdate(){
      //zatial si len posielam info o hre
    io.emit("update", game);
}

function playerDisconnect(id){
    var index = game.players.findIndex(user => user.id === id);
        if(index != -1){

            game.players.splice(index,1);
            io.emit("message", id, 'disconnected');
            //console.log(id, 'disconnected');
        }     
}

function playerConnected(id){
    //io.emit("message", id+ "connected");
    //console.log(id, 'connected');
    game.players.push(new Player(id, 4, null, null, null));
}