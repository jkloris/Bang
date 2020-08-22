const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

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
            if(game.playedCard == "Hokynarstvo" ){
                socket.emit("emporio_clickAccept",mouse);

            }else{

                console.log("Requested Click: ", mouse, id);
                socket.emit("partial_clickAccept",mouse);
            }
        }
        
    })

    socket.on("nextTurn", (id)=>{
        var index_sender = game.players.findIndex(user => user.id === socket.id);
        console.log('next');
        if (game.nextTurn(index_sender)) gameUpdate();
        else io.to(id).emit("discardRequest");
    });
    
    socket.on("startGame", ()=>{
        game.started = true;
        game.shuffleDeck();
        game.dealCards();
        gameUpdate();
    });

    socket.on("hokynarstvo", (card)=>{
        game.dealAnyCard(game.requestedPlayer, card);
        
        var player_index = (game.requestedPlayer + 1 == game.players.length)? 0 : game.requestedPlayer + 1;
 
        while (!game.players[player_index].alive) {
            player_index++;
            if (player_index >= game.players.length) player_index = 0;
        }
        game.requestedPlayer = player_index;

        if(game.requestedPlayer == game.turn){
            game.requestedPlayer = null;
            game.playedCard = null;
        } 
        gameUpdate();
    });

    socket.on("useCard", (card,index)=>{
        console.log(card);
        var index_sender = game.players.findIndex(user => user.id === socket.id);
        game.players[index_sender].cards[index].action(game,index_sender,index);
        gameUpdate();
    });

    socket.on("loseLife",(id)=>{
        var player_index = game.players.findIndex(user => user.id === id);
        if(--game.players[player_index].HP == 0){
            Death(player_index);
        }
        if (game.requestedPlayer != null){
            if (game.playedCard == "Gulomet" || game.playedCard == "Indiani") {

                player_index = (player_index + 1 == game.players.length)? 0 : player_index + 1;

                while (!game.players[player_index].alive) {
                    player_index++;
                    if (player_index >= game.players.length) player_index = 0;
                }
                game.requestedPlayer = player_index;
    
                if(game.requestedPlayer == game.turn){
                    game.requestedPlayer = null;
                    game.playedCard = null;
                    game.requestedCard = null;
                } 
    
            } else {
                game.requestedPlayer = null;  
                
                game.playedCard = null;
                game.requestedCard = null;              
            }
        }
        gameUpdate();
    });

    socket.on("discard", (id, card_i) => {
        var player_index = game.players.findIndex(user => user.id === socket.id);
        if (game.players[player_index].cards.length > game.players[player_index].HP) {
            discardCard(player_index, card_i);
            gameUpdate();
        }
        else io.to(id).emit("discardDeny");
    });

    socket.on("dealOneCard", (player_i)=>{
        game.dealOneCard(player_i);
        gameUpdate();
    })

    socket.on("moveStage++", ()=>{
        game.moveStage++;
        gameUpdate();
    })

    socket.on("RequestedCard", card=>{
        game.requestedCard = card;
        gameUpdate();
    })
    
    socket.on("PlayedCard", card=>{
        game.playedCard = card;
        gameUpdate();
    })
    
    //mechanika barelu a mozno viac
    socket.on("ownBlueClicked", (arg)=>{
        if (game.players[game.requestedPlayer].blueCards[arg].name == "Barel"){

            if (game.requestedCard == "Vedle") {
                var last = game.cards.pop();
                if (last.suit == "heart" && game.playedCard == "Gulomet"){
                    var player_index = game.requestedPlayer;

                    player_index = (player_index + 1 == game.players.length)? 0 : player_index + 1;

                    while (!game.players[player_index].alive) {
                        player_index++;
                        if (player_index >= game.players.length) player_index = 0;
                    }
                    game.requestedPlayer = player_index;
                    
                    if(game.requestedPlayer == game.turn){
                        game.requestedPlayer = null;
                        game.playedCard = null;
                        game.requestedCard = null;
                    } 

                } else if(last.suit == "heart"){
                    game.requestedPlayer = null;
                    game.requestedCard = null;
                    game.playedCard = null;
                }
                
                game.cards.unshift(last);
            }
        }
        gameUpdate();
    });


    //basic layout pre buducu komunikaciu medzi clientami
    socket.on("interaction", (id,event, arg, card_index)=>{

        var index_sender = game.players.findIndex(user => user.id === socket.id);
        var index_target = game.players.findIndex(user => user.id === id);

        if(event == "Catbalou"){
            game.players[index_sender].cards[card_index].action(game, index_sender, index_target, card_index, arg);
            // socket.broadcast.to(id).emit(event, arg, index_sender);
            gameUpdate();

        } else if (game.getDistance(index_sender, index_target, card_index) <= 1 || game.players[index_sender].cards[card_index].onRange == false ) {

            if(event == "Panika"){
                game.players[index_sender].cards[card_index].action(game, index_sender, index_target, card_index, arg);
                // socket.broadcast.to(id).emit(event, arg, index_sender);
                gameUpdate();
    
            }else{

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
const IP = 'localhost'; //192.168.1.18
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
    game.players.push(new Player(id, 5, null, null, null));
    //io.emit("message", game);
}

function discardCard(player_i, card_i) {
    game.cards.unshift(game.players[player_i].cards[card_i]);    
    game.trashedCards++;
    game.players[player_i].cards.splice(card_i,1);
}

function Death(dead_player_index){ //TODO
    console.log(game.players[dead_player_index] + 'is dead');
    game.players[dead_player_index].alive = false;
    game.deadPlayers++;

    //karty mrtveho hraca sa poslu hracovi, ktory je momentalne na tahu
    while (game.players[dead_player_index].cards.length > 0) {
        var card = game.players[dead_player_index].cards.pop();
        game.players[game.turn].cards.push(card);
    }
}


