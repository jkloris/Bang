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
            
            if(card_i != -1 && game_client.requestedCard == game_client.players[player_i].cards[card_i].name){
                socket.emit("useCard", game_client.players[player_i].cards[card_i].name, card_i);
            } else if( card_i != -1 && game_client.players[player_i].cards[card_i].offensive == false && game_client.requestedCard == null){
                socket.emit("useCard", game_client.players[player_i].cards[card_i].name, card_i);
            }

            //po useCard nastavi tieto veci na defaultne resp. opacne hodnoty
            cardSelected = false;
            game_client.players[player_i].cards[card_i].selected = false;
            play_audio = true;
            drawGame();
        }
        this.buttons.push(UseCard);

        var LoseLife = new Button(canvas.width - 200, canvas.height - 120, 80, 40, "Lose life", "rgb(255, 153, 0)");
        LoseLife.action = function(){
            socket.emit("loseLife",socket.id);
            play_audio = true;
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

        //opens log (history of actions)
        var OpenLog  = new Button(canvas.width - 100, canvas.height - 180, 80, 40, "Log", "rgb(255, 153, 0)");
        OpenLog.action = function() {
            modal.style.display = "block";
            let scroll_bar = document.getElementById("scrollable-modal");
            scroll_bar.scrollTop = scroll_bar.scrollHeight;
        };
        this.buttons.push(OpenLog);
    }


    //point je objekt so suradnicami kliku mysou
    onclick = function(point) {
        if(game_client.moveStage == 0){
            game_scene.buttons[0].visible = false;
        }
        var player_i = game_client.players.findIndex(user => user.id === socket.id);

        if(game_client.players[player_i].prison == false && game_client.players[player_i].dynamit == false){
            this.checkDeck(point);
        }
        this.checkTiles(point);
        this.checkButtons(point);
        
        if(game_client.moveStage == 1){
            this.checkCardSelect(point);
        }
        
    }

    checkCharacters(point){
        var player_i = game_client.players.findIndex(user => user.id === socket.id);
            
        var current = this.tiles[player_i];
        var localRatio = tile_size.x / 4;
        var x = current.x  + tile_size.x - 2;
        var y = current.y + tile_size.y - Sprites.bang.height / Sprites.bang.width * localRatio + 1;
        
        if (point.x >= x && point.x <= x + localRatio && point.y >= y - (current.HP * (tile_size.y - 2) / 10) + 1 && point.y <= y - (current.HP * (tile_size.y - 2) / 10) + 1 + Sprites.bang.height / Sprites.bang.width * localRatio) {
            console.log(game_client.players[player_i].character); //TODO
        }
    }

    checkTiles(point){
        for (var i in this.tiles) {            
            var current = this.tiles[i];
            if (point.x >= current.x && point.x <= current.x + tile_size.x && point.y >= current.y && point.y <= current.y + tile_size.y) {
                var clickedBlue_index = this.checkBlueCards(point, current, i);
                current.onclick(clickedBlue_index);
            }
            
        }
    }

    //vrati index modrej karty, na ktoru sa kliklo
    checkBlueCards(point, current, player){
        var x = current.x + 1;
        var ratio = tile_size.x / 4;
        var y = current.y;

        for(var i in game_client.players[player].blueCards){
            if(point.x >= x && point.x <= x + ratio / 1.7 && point.y >= y && point.y <= y + Sprites.bang.height / Sprites.bang.width * ratio){
                return i;
            }
            
            //pre poslednu kartu sa skontroluje cela sirka
            if(i == game_client.players[player].blueCards.length - 1) {
                if(point.x >= x && point.x <= x + ratio && point.y >= y && point.y <= y + Sprites.bang.height / Sprites.bang.width * ratio){
                    return i;
                }
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
                        cardSelected = true;
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

    rightClickCheck(point) {
        //skontroluje, ci neklikame na kartu charakteru (ako je calamity a pod.)
        for (var i in game_client.players) {
            
            var current = this.tiles[i];
            var localRatio = tile_size.x / 4;
            var x = current.x  + tile_size.x - 2;
            var y = current.y + tile_size.y - Sprites.bang.height / Sprites.bang.width * localRatio + 1;
            
            if (point.x >= x && point.x <= x + localRatio && point.y >= y - (current.HP * (tile_size.y - 2) / 10) + 1 && point.y <= y - (current.HP * (tile_size.y - 2) / 10) + 1 + Sprites.bang.height / Sprites.bang.width * localRatio) {

                var character_img = null;
                switch (game_client.players[i].character.name){
                    case "paul_regret":
                        character_img = Sprites.paul_regret;
                        break;
                    case "bart_cassidy":
                        character_img = Sprites.bart_cassidy;
                        break;
                    case "suzy_lafayette":
                        character_img = Sprites.suzy_lafayette;
                        break;
                    case "willy_the_kid":
                        character_img = Sprites.willy_the_kid;
                        break;
                    case "vulture_sam":
                        character_img = Sprites.vulture_sam;
                        break;
                    case "slab_the_killer":
                        character_img = Sprites.slab_the_killer;
                        break;
                    case "sid_ketchum":
                        character_img = Sprites.sid_ketchum;
                        break;
                    case "rose_doolan":
                        character_img = Sprites.rose_doolan;       
                        break;
                    case "pedro_ramirez":
                        character_img = Sprites.pedro_ramirez;
                        break;
                    case "lucky_duke":
                        character_img = Sprites.lucky_duke;
                        break;
                    case "kit_carlson":
                        character_img = Sprites.kit_carlson;
                        break;
                    case "jesse_jones":
                        character_img = Sprites.jesse_jones;
                        break;
                    case "jourdonnais":
                        character_img = Sprites.jourdonnais;
                        break;
                    case "calamity_janet":
                        character_img = Sprites.calamity_janet;
                        break;
                    case "black_jack":
                        character_img = Sprites.black_jack;
                        break;
                    case "el_gringo":
                        character_img = Sprites.el_gringo;
                        break;
                    case "felipe_prisonero":
                        character_img = Sprites.felipe_prisonero;
                        break;

                    default:
                        break;
                }

                //ak klikame na charakter, teraz je nastaveny v character_img
                if (character_img != null) {
                    clear();
                    zoomed = true;

                    ctx.save();
                    ctx.drawImage(character_img, canvas.width / 2 - character_img.width / 2, canvas.height / 2 - character_img.height / 2, character_img.width, character_img.height);
                    ctx.restore();

                    return;
                }
            }
        }

        //skontroluje, ci neklikame na modre karty
        for (var i in this.tiles) {
            var current = this.tiles[i];
            var rightClickedBlue = this.checkBlueCards(point, current, i);
            if (rightClickedBlue != null) {
                var card_img = game_client.players[i].blueCards[rightClickedBlue].IMG;
                zoomed = true;

                clear();
                ctx.save();
                ctx.drawImage(card_img, canvas.width / 2 - card_img.width / 2, canvas.height / 2 - card_img.height / 2, card_img.width, card_img.height);
                ctx.restore();
                
                return;
            }
        }
    }
}

