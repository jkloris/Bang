const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");
//const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const Player = require("./players.js");
const Game = require("./game.js");

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
        gameUpdate();
    });

    //zachytenie suradnice kliknutia
    socket.on("clicked", (mouse, id)=>{
        if(game.requestedPlayer == null && game.players[game.turn].id == id){
            console.log("Click: ", mouse, id);
            socket.emit("clickAccept",mouse);

        }
        if(game.requestedPlayer != null && game.players[game.requestedPlayer].id == id){
            console.log("Requested Click: ", mouse, id);
            socket.emit("partial_clickAccept",mouse);
        }
    })

    socket.on("nextTurn", (id)=>{
        var index_sender = game.players.findIndex(user => user.id === socket.id);
        console.log('next');
        if (game.nextTurn(index_sender)) gameUpdate();
        else io.to(id).emit("discardRequest");
    });
    
    socket.on("startGame", ()=>{
        game.shuffleDeck();
        game.dealCards();
        gameUpdate();
    });

    socket.on("useCard",(card,index)=>{
        console.log(card);
        var index_sender = game.players.findIndex(user => user.id === socket.id);
        game.players[index_sender].cards[index].action(game,index_sender,index);
        gameUpdate();
    });

    socket.on("loseLife",(id)=>{
        var index = game.players.findIndex(user => user.id === id);
        if(game.players[index].HP-- <= 0){
            Death(game.players[index]);
        }
        if(game.requestedPlayer != null){
            game.requestedPlayer = null;
        }
        gameUpdate();
    });

    socket.on("discard", (id, card_i) => {
        var player_index = game.players.findIndex(user => user.id === socket.id);
        discardCard(player_index, card_i);
        gameUpdate();
    });



    //basic layout pre buducu komunikaciu medzi clientami
    socket.on("interaction", (id,event,arg, card_index)=>{

        var index_sender = game.players.findIndex(user => user.id === socket.id);
        var index_target = game.players.findIndex(user => user.id === id);
        game.requestedPlayer = index_target;
        discardCard(index_sender, card_index);
        gameUpdate();

        for(i in game.players){
            if(game.players[i].id == id){
                socket.broadcast.to(id).emit(event, arg, index_sender);
                socket.broadcast.to(id).emit("message", game.players[index_sender].name + ' used card ' + event + ' -> you');
            }else if(game.players[i].id == socket.id){
                socket.emit("message", "you used card " + event + ' -> ' + game.players[index_target].name);
            }else{
                socket.broadcast.to(game.players[i].id).emit("message", game.players[index_sender].name + " used card " + event + ' -> ' + game.players[index_target].name);
            }
        }
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
            io.emit("message", id + ' disconnected');
            //console.log(id, 'disconnected');
        }     
}

function playerConnected(id){
    //io.emit("message", id+ "connected");
    //console.log(id, 'connected');
    game.players.push(new Player(id, 12, null, null, null));
    //io.emit("message", game);
}

function discardCard(player_i, card_i){
    game.cards.unshift(game.players[player_i].cards[card_i]);
    // for(var i in game.cards){
    //     if(game.cards[i].name == game.players[player_i].cards[card_i].name && game.cards[i].available == false){
    //         game.cards[i].available = true;
    //         game.trashedCard = game.cards[i];
    //         break;
    //     }
    // }
    game.players[player_i].cards.splice(card_i,1);
    //gameUpdate();
}

function Death(player){ //TODO
    console.log(player + " is dead")
}