//funkcie na vykreslovanie do canvasu

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = window.innerWidth * 0.9;
ctx.canvas.height = window.innerHeight * 0.9;

const tile_size = canvas.width / 10;

function clear() {
    ctx.save();
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.restore();
}

function drawGame() {
    clear();
    // console.log(game_scene.tiles);
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
        for(var i in game_scene.buttons){    
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
        deck.draw(canvas.height / 2, canvas.width / 10, ratio);
        //toto potom
        // if(game_client.trashedCard)
        //game_client.trashedCard.draw(canvas.height / 2 + ratio + 5, canvas.width / 10, ratio);
    }
}   
