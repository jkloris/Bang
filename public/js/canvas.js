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
        }                                           //tuna upravit osetrenia
    } else if(game_client.requestedPlayer != null && socket.id != game_client.players[game_client.turn].id && socket.id == game_client.players[game_client.requestedPlayer].id){
        for(var i in game_scene.buttons){
            if(i==2){ //use button je na indexe 2
                game_scene.buttons[i].visible = true;
                game_scene.buttons[i].draw();
            }else{

                game_scene.buttons[i].visible = false;
                game_scene.buttons[i].draw();
            }
        }
    }

    //draw cards
    let index = game_client.players.findIndex(user => user.id === socket.id);
    var x = 10;
    var ratio = canvas.width / 15;
    var y = canvas.height - Sprites.bang.height / Sprites.bang.width * ratio - 10;

    for(i in game_client.players[index].cards){
    
        game_client.players[index].cards[i].draw(x,y,ratio);         

        x+=ratio - 10;
        //console.log(x,ratio);
    }

}
