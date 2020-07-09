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
    for (i in game_scene.tiles) {
        if(game_scene.tiles[i].id == socket.id){
            var color = "red";
        }else{
            var color = "black";
        }
        game_scene.tiles[i].drawTile(color);
    }
}
