const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const [Player, Paul_regret, Rose_doolan, Bart_cassidy, Suzy_lafayette, Willy_the_kid, Vulture_sam, Slab_the_killer, Sid_ketchum, Pedro_ramirez, Lucky_duke, Kit_carlson, Jesse_jones, El_gringo, Calamity_janet, Jourdonnais, Black_jack, Felipe_prisonero] = require("./players.js");
const Game = require("./game.js");

app.use(express.static(path.join(__dirname, "public")));

var game = new Game();

//spaja socket.id klienta s menom, ktore si nastavi
var names = {};

io.on("connection", socket =>{
    //niekto sa pripojil
    // io.emit("message", game);
    playerConnected(socket.id); 
    gameUpdate();

    //hrac si nastavi meno
    socket.on('set-name', name => {
        names[`${socket.id}`] = name; //priradi do pola "names" k socket.id meno, ake si vybral

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
        socket.emit("logClick", mouse);
        
    })

    socket.on("nextTurn", (id)=>{
        var index_sender = game.players.findIndex(user => user.id === socket.id);
        console.log('next');
        if (game.nextTurn(index_sender)) gameUpdate();
        else io.to(id).emit("discardRequest");
    });
    
    socket.on("startGame", ()=>{
        if (game.players.length <= 1) return; //crashuje to, ak pustime hru s iba 1 hracom
        game.started = true;
        game.dealCharacters();
        game.dealRoles();
        game.shuffleDeck();
        game.dealCards();
        // io.emit("message", game);
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
        io.emit("log", card + ": (" + game.players[index_sender].name + ")");
        gameUpdate();
    });

    socket.on("loseLife",(id)=>{
        var player_index = game.players.findIndex(user => user.id === id);
        if(--game.players[player_index].HP == 0){
            Death(player_index);
            let result = game.gameOver();
            console.log("checking for game over... with result: " + result.result);
            if (result.result){ //ak nastal koniec hry
                io.emit("winner", result.winner);
                game.started = false;
                gameUpdate();
            } 
        }
        else io.emit("log", " - " + game.players[player_index].name + " sa rozhodol zobrať si život.");

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

    socket.on("prisonClick", (player, card)=>{
        if(game.moveStage == 0 && game.players[player].prison == true){
            game.players[player].prison = false;
                
            game.cards.unshift(game.players[player].blueCards[card]);    
            game.cards.unshift(game.cards[game.cards.length - 1]);
            game.players[player].blueCards.splice(card,1);
            game.cards.splice(game.cards.length - 1 , 1);
            game.trashedCards+2;

            if(game.cards[0].suit != "heart"){
                game.nextTurn(player, true);
            }
            gameUpdate(); 
        }
    });

    socket.on("dynamiteClick", (player, card)=>{
        if(game.moveStage == 0 && game.dynamit == true){
            game.players[player].dynamit = false;
            var checkCard = game.cards[game.cards.length - 1];

            if (checkCard.suit == "spades" && checkCard.rank >= 2 && checkCard.rank <= 9 ){
                game.dynamit = false;
                game.cards.unshift(game.players[player].blueCards[card]);
                game.players[player].blueCards.splice(card, 1);
                game.trashedCards+=2;
                
                game.players[player].HP = ( game.players[player].HP - 3 > 0) ? (game.players[player].HP - 3) : 0;
                if (game.players[player].HP == 0){
                    //game.players[player].alive = false; //nestaci - nezahodi karty do kopky (ci? - netestoval som)
                    Death(player); //aby sa jeho karty zahodili do kopky
                    game.nextTurn(player, true);

                    let result = game.gameOver();
                    console.log("checking for game over... with result: " + result.result);
                    if (result.result) {
                        io.emit("winner", result.winner);
                        game.started = false;
                        gameUpdate();
                    }
                } 

            }else{

                var nextPlayer = player;
                if (nextPlayer + 1 < game.players.length) {
                    nextPlayer++;
                } else {
                    nextPlayer = 0;
                }
                
                //preskoci hracov, ktori su mrtvi
                while(!game.players[nextPlayer].alive) {
                    nextPlayer++;
                    if (nextPlayer >= game.players.length) nextPlayer = 0;
                }
            
                game.players[nextPlayer].blueCards.push(game.players[player].blueCards[card]);
                game.players[player].blueCards.splice(card, 1);
                game.players[nextPlayer].dynamit = true;
                game.trashedCards++;
            }
            game.cards.unshift(checkCard);
            game.cards.splice(game.cards.length - 1, 1);

            gameUpdate();

        }
    });


    //basic layout pre buducu komunikaciu medzi clientami
    socket.on("interaction", (id,event, clickedBlue_index, card_index)=>{
        console.log('interaction ' + event)
        var index_sender = game.players.findIndex(user => user.id === socket.id);
        var index_target = game.players.findIndex(user => user.id === id);
        io.emit("log", event + ": (" + game.players[index_sender].name + " >>> " + game.players[index_target].name + ")");

        if(event == "Vazenie") {
            game.players[index_sender].cards[card_index].action(game, index_sender, index_target, card_index, clickedBlue_index);            
            gameUpdate();
        } else if(event == "Catbalou") {
            let trashed_card_name = game.players[index_sender].cards[card_index].action(game, index_sender, index_target, card_index, clickedBlue_index);
            io.emit("log", " - zahodena karta: " + trashed_card_name);
            gameUpdate();
        } else if (game.getDistance(index_sender, index_target, card_index) <= 1 || game.players[index_sender].cards[card_index].onRange == false ) {

            if(event == "Panika"){
                let stolen_card_name = game.players[index_sender].cards[card_index].action(game, index_sender, index_target, card_index, clickedBlue_index);
                socket.broadcast.to(game.players[index_target].id).emit("log", " - zobrali ti kartu: " + stolen_card_name);
                gameUpdate();
            } else if (event == "Bang" && game.players[index_sender].bangLeft > 0) {
                game.requestedPlayer = index_target;
                game.players[index_sender].bangLeft--;
                discardCard(index_sender, card_index);
                gameUpdate();
                
                for(i in game.players){
                    if(game.players[i].id == id){ //info pre targeta, ze co sa deje (ze nanho ide BANG alebo Duello)
                        socket.broadcast.to(id).emit(event, clickedBlue_index, index_sender);
                        socket.broadcast.to(id).emit("message", game.players[index_sender].name + ' used card ' + event + ' -> you');
                    }else if(game.players[i].id == socket.id){
                        socket.emit("message", "you used card " + event + ' -> ' + game.players[index_target].name);
                    }else{
                        socket.broadcast.to(game.players[i].id).emit("message", game.players[index_sender].name + " used card " + event + ' -> ' + game.players[index_target].name);
                    }
                }
            } else if (event == "Duel") {
                game.duelistPlayer = index_target;
                game.requestedPlayer = index_target;
                discardCard(index_sender, card_index);                
                gameUpdate();
                io.emit("Duel-announcement");
                
                for(i in game.players){
                    if(game.players[i].id == id){ //info pre targeta, ze co sa deje (ze nanho ide BANG alebo Duello)
                        socket.broadcast.to(id).emit(event, clickedBlue_index, index_sender);
                        socket.broadcast.to(id).emit("message", game.players[index_sender].name + ' used card ' + event + ' -> you');
                    }
                }
            }
        }
        
    })
    //odpojenie hraca
    socket.on("disconnect",()=>{
        playerDisconnect(socket.id);
        gameUpdate();
    });

    socket.on("restart", () => {
        if (game.started) {
            console.log("Zly restart request - hra stale prebieha");
            return; //ak je hra v priebehu, tak sa nestane nic
        }
        game = new Game();
        
        //loop through connected sockets and add them as players to the next game
        let connected_sockets = io.sockets.sockets;
        for (var socketId in connected_sockets) {
            playerConnected(socketId); //vytvori noveho hraca
            
            //nastavi mu meno podla toho, co je priradene k jeho socketId v poli "names"
            game.players[game.players.length - 1].name = names[socketId];
        }

        io.emit("restart");
        gameUpdate();
    });

})

const PORT = process.env.PORT || 8888;
const IP = 'localhost'; 
//const IP = '10.156.0.2'; //pre Google Cloud VM
server.listen(PORT, IP, ()=>console.log(`server running on ${IP}:${PORT}`));


//update hry
function gameUpdate(){
    io.emit("update", game);
    // io.emit("log", "Der updater"); //tymto sposobom sa posiela klientovi nejaky text, ktory sa u klienta zapise do logu
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
    game.players.push(new Player(id, 1, null, null, null));
    //io.emit("message", game);
}

function discardCard(player_i, card_i) {
    game.cards.unshift(game.players[player_i].cards[card_i]);    
    game.trashedCards++;
    game.players[player_i].cards.splice(card_i,1);
}

function Death(dead_player_index){ //TODO
    console.log(game.players[dead_player_index].name + ' died');
    io.emit("log", game.players[dead_player_index].name + " je mrtef.");
    game.players[dead_player_index].alive = false;
    game.deadPlayers++;

    //karty mrtveho hraca sa poslu do kopky
    while (game.players[dead_player_index].cards.length > 0) {
        var card = game.players[dead_player_index].cards.pop();
        game.cards.unshift(card);
        game.trashedCards++;
        //game.players[game.turn].cards.push(card);
    }
    while (game.players[dead_player_index].blueCards.length > 0){
        var card = game.players[dead_player_index].blueCards.pop();
        game.cards.unshift(card);
        game.trashedCards++;
    }
}


