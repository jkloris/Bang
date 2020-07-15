class Scene {
    constructor() {
        this.tiles = [];
        this.buttons = [];
    }

    
    add_tile(tile) {
        this.tiles.push(tile);
    }
    
    init() {
        var EndTurn  = new Button(canvas.width - 100, canvas.height - 100, 80, 50, "Next", "rgb(255, 153, 0)");
        EndTurn.action = function() {
            socket.emit("nextTurn",null);
        };
        this.buttons.push(EndTurn);

        
        var StartGame = new Button(canvas.width - 200, canvas.height - 100, 80, 50, "Start", "rgb(255, 153, 0)");
        StartGame.action = function(){
            socket.emit("startGame", null);
        }
        this.buttons.push(StartGame);

        var UseCard = new Button(canvas.width - 100, canvas.height - 200, 80, 50, "Use card", "rgb(255, 153, 0)");
        UseCard.action = function(){
            
            var player_i = game_client.players.findIndex(user => user.id === socket.id);
            var card_i = game_client.players[player_i].cards.findIndex(card => card.selected === true);

            if(card_i != -1 && game_client.requestedCard == game_client.players[player_i].cards[card_i].name){
                socket.emit("useCard", game_client.players[player_i].cards[card_i].name, card_i);
            }
        }
        this.buttons.push(UseCard);
    }
    onclick = function(point) {
        this.chechTiles(point);
        this.checkButtons(point);
        this.checkCardSelect(point);
        
    }

    chechTiles(point){
        for (var i in this.tiles) {            
            var current = this.tiles[i];
            if (point.x >= current.x && point.x <= current.x + tile_size && point.y >= current.y && point.y <= current.y + tile_size) {
                current.onclick();
            }
        }
    }

    checkButtons(point){
        for(var i in this.buttons){
            var current = this.buttons[i];
            if (current.visible && point.x >= current.x && point.x <= current.x + current.sizeX && point.y >= current.y && point.y <= current.y + current.sizeY) {
                current.onclick();
            }
        }
    }

    checkCardSelect(point){ 
        var ratio = canvas.width / 15;
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
}

