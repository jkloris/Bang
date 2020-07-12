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


    for(var i in game_scene.buttons){
        game_scene.buttons[i].draw();
    }
}
