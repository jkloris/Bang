//funkcie na vykreslovanie do canvasu

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = window.innerWidth * 0.99;
ctx.canvas.height = window.innerHeight * 0.9;

const tile_size = {x : canvas.width / 7, y : canvas.width / 9};


function clear() {
    ctx.save();
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.restore();
}

function drawGame() {
    clear();

    //draw players
    for (i in game_scene.tiles) {
        if(game_scene.tiles[i].id == socket.id){
            var color = "green";
        }else{
            var color = "black";
        }
        game_scene.tiles[i].drawTile(color);
        
        if(i == game_client.turn){
            ctx.fillStyle = "red";
            ctx.fillRect(game_scene.tiles[i].x,game_scene.tiles[i].y,10,10);
            ctx.fillStyle = "black";
        }
    }


    //draw buttons
    if(game_client.turn != null && socket.id == game_client.players[game_client.turn].id ){
        for(var i in game_scene.buttons){
            game_scene.buttons[i].visible = true;
            game_scene.buttons[i].draw();
        }         
        game_scene.buttons[3].visible = false;  //3 je index lose life     
        game_scene.buttons[i].draw();
    } else if(game_client.requestedPlayer != null && socket.id != game_client.players[game_client.turn].id && socket.id == game_client.players[game_client.requestedPlayer].id){
        if (game_client.playedCard == "Indiani") {
            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = "red";
            ctx.font = "40px Arial";
            ctx.fillText(`DIE INDIANEN, SPIEL EIN BANG BITTE!!!`, canvas.width / 2, canvas.height / 2 - 20);
            ctx.restore();
        }
        for(var i in game_scene.buttons){
            if(i==2 || i==3){ //use button je na indexe 2 a lose life na 3
                game_scene.buttons[i].visible = true;
            }else{
                game_scene.buttons[i].visible = false;
            }
            game_scene.buttons[i].draw();
        }
    }
    if(game_client.requestedPlayer != null && socket.id == game_client.players[game_client.turn].id && socket.id != game_client.players[game_client.requestedPlayer].id){
        for(var i in game_scene.buttons){    
            game_scene.buttons[i].visible = false;
            game_scene.buttons[i].draw();
        }
    }


    //draw cards
    let index = game_client.players.findIndex(user => user.id === socket.id);
    //tento if v podstate kontroluje, ci uz bola zacata hra
    if (game_client.players[index].cards.length > 0) {
        var x = 10;
        var ratio = canvas.width / 15;
        var y = canvas.height - Sprites.bang.height / Sprites.bang.width * ratio - 10;

        for(i in game_client.players[index].cards){
        
            game_client.players[index].cards[i].draw(x,y,ratio);         

            x+=ratio - 10;
            //console.log(x,ratio);
        }
        //draw deck
        var deck = new Back();
        deck.draw(canvas.width / 2, canvas.height / 10, ratio);
        if(game_client.trashedCards > 0)
            game_client.cards[0].draw(canvas.width / 2 - ratio - 10, canvas.height / 10, ratio);
        
        if (game_client.moveStage == 0 && index == game_client.turn) {
            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = "green";
            ctx.font = "30px Arial";
            ctx.fillText(`Bitte starte bei Karten nehmen!`, canvas.width / 2, canvas.height / 2 - 20)
            ctx.restore();
        }
    }
}   
