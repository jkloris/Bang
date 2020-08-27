class Scene {
    constructor() {
        this.tiles = [];
        this.buttons = [];
    }

    add_tile(tile) {
        this.tiles.push(tile);
    }
    
    init() {
        var EndTurn  = new Button(canvas.width - 100, canvas.height - 60, 80, 40, "Next", "rgb(255, 153, 0)");
        EndTurn.action = function() {
            socket.emit("nextTurn", socket.id);
        };
        this.buttons.push(EndTurn);

        
        var StartGame = new Button(canvas.width - 200, canvas.height - 60, 80, 40, "Start", "rgb(255, 153, 0)");
        StartGame.action = function(){
            socket.emit("startGame", null);
        }
        this.buttons.push(StartGame);

        var UseCard = new Button(canvas.width - 100, canvas.height - 120, 80, 40, "Use card", "rgb(255, 153, 0)");
        UseCard.action = function(){
            
            var player_i = game_client.players.findIndex(user => user.id === socket.id);
            var card_i = game_client.players[player_i].cards.findIndex(card => card.selected === true);
            
            // console.log(game_client.requestedCard );
            // console.log(card_i);
            // console.log(game_client.players[player_i].cards[card_i]);
            if(card_i != -1 && game_client.requestedCard == game_client.players[player_i].cards[card_i].name){
                socket.emit("useCard", game_client.players[player_i].cards[card_i].name, card_i);
            } else if( card_i != -1 && game_client.players[player_i].cards[card_i].offensive == false && game_client.requestedCard == null){
                socket.emit("useCard", game_client.players[player_i].cards[card_i].name, card_i);
            }
        }
        this.buttons.push(UseCard);

        var LoseLife = new Button(canvas.width - 200, canvas.height - 120, 80, 40, "Lose life", "rgb(255, 153, 0)");
        LoseLife.action = function(){
            socket.emit("loseLife",socket.id);
        }
        this.buttons.push(LoseLife);

        var Discard = new Button(canvas.width - 200, canvas.height - 180, 80, 40, "Discard", "rgb(255, 153, 0)");
        Discard.action = function() {
            var player_i = game_client.players.findIndex(user => user.id === socket.id);
            var card_i = game_client.players[player_i].cards.findIndex(card => card.selected === true);

            if(card_i != -1){
                socket.emit("discard", socket.id, card_i);
            }
            else alert("Nemas oznacenu ziadnu kartu.");
        }
        Discard.visible = false;
        this.buttons.push(Discard);
    }


    
    onclick = function(point) {
        if(game_client.moveStage == 0){
            game_scene.buttons[0].visible = false;
        }
        var player_i = game_client.players.findIndex(user => user.id === socket.id);

        if(game_client.players[player_i].prison == false){
            this.checkDeck(point);
        }
        this.checkTiles(point);
        this.checkButtons(point);
        
        if(game_client.moveStage == 1){
            this.checkCardSelect(point);
        }
        
    }

    checkTiles(point){
        for (var i in this.tiles) {            
            var current = this.tiles[i];
            if (point.x >= current.x && point.x <= current.x + tile_size.x && point.y >= current.y && point.y <= current.y + tile_size.y) {
                var arg = this.checkBlueCards(point, current, i);
                current.onclick(arg);
            }
            
        }
    }

    checkBlueCards(point, current, player){
        var x = current.x + 1;
        var ratio = tile_size.x / 4;
        var y = current.y;

        for(var i in game_client.players[player].blueCards){
            if(point.x >= x && point.x <= x + ratio / 1.7 && point.y >= y && point.y <= y + Sprites.bang.height / Sprites.bang.width * ratio){
                console.log(game_client.players[player].blueCards[i]);
                return i;
            }
            x+=ratio / 1.7;
        }
        return null;
    }

    checkButtons(point){
        for(var i in this.buttons){
            var current = this.buttons[i];
            if (current.visible && point.x >= current.x && point.x <= current.x + current.sizeX && point.y >= current.y && point.y <= current.y + current.sizeY) {
                current.onclick();
            }
        }
    }

    checkDeck(point){
        var ratio = canvas.width / 18;
        var current = {x : canvas.width / 2, y : canvas.height / 13};
        if (point.x >= current.x && point.x <= current.x + ratio && point.y >= current.y && point.y <= current.y + Sprites.bang.height / Sprites.bang.width * ratio) {
            if(game_client.moveStage == 0){
                var index = game_client.players.findIndex(user => user.id === socket.id);
                socket.emit("dealOneCard", index);
                socket.emit("dealOneCard", index);
                socket.emit("moveStage++");
            }
        }
    }

    checkCardSelect(point){ 
        var ratio = canvas.width / 18;
        var minY = canvas.height - Sprites.bang.height / Sprites.bang.width * ratio - 10;
        var maxY = minY  + Sprites.bang.height / Sprites.bang.width * ratio
    
        for(var i in game_client.players){
            var player = game_client.players[i];
            if(player.cards.length > 0 && point.y > minY && point.y < maxY){
    
                var x = 10
                for(var e in player.cards){
                    if(point.x > x  && point.x < x + ratio - 10){
                        for(var o in player.cards) player.cards[o].selected = false;
                        player.cards[e].selected = true;
                        drawGame();
                    }
                    x += ratio - 10;
                }
            }
        }
    }

    checkEmporio(point){
        var ratio = canvas.width / 18;
        var dl = game_client.players.length * ratio / 1.6 ;

        var turn = game_client.requestedPlayer;
        var count = 0;
        while(turn != game_client.turn || count == 0){
            turn++;
            if(turn >= game_client.players.length)
                turn = 0;
            if(game_client.players[turn].alive) count++;
        }

        for(var i = 0; i < count; i++){
                if(point.x >= (canvas.width / 2) + (( i + 1 ) * ratio) - dl  && point.x <= ratio + (canvas.width / 2) + (( i + 1 ) * ratio - dl) && point.y >= canvas.height / 3.7 && point.y <= canvas.height / 3.7 + Sprites.bang.height / Sprites.bang.width * ratio){
                    socket.emit("hokynarstvo", game_client.cards.length - ( i + 1 ));
                }         
        }
        
    }
}

