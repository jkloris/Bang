const socket = io();

//const name = prompt('Meno?');
const asdfg = Math.floor(Math.random() * 10);
const name = `Arne Birkenstock${asdfg}`;
socket.emit('set-name', name);

var game_client; //stav hry ulozeny na strane klienta
var game_scene = new Scene;
game_scene.init();

socket.on("message", (msg) => {
    console.log(msg);
});

socket.on("update", game => {
    game_client = game;
    updatePlayers();
    drawGame();
});

//bang
socket.on("bang", arg=>{
    //alert(socket.id + "bang");
    console.log("bang");
})


document.addEventListener("click", e => {
    var rect = canvas.getBoundingClientRect();
    var mouse = {x: e.clientX-rect.left, y: e.clientY-rect.top};
    //console.log(mouse.x, mouse.y);
    socket.emit("clicked", mouse, socket.id );
})
socket.on("clickAccept", (mouse)=>{
    game_scene.onclick(mouse);
})



function updatePlayers() {
    game_scene.tiles.length = 0;
    for (number in game_client.players) {
        let x; let y;
        
        //nastavenie pozicie vykreslenia hraca
        switch (parseInt(number)) {
            case 0: x = canvas.width / 14; y = canvas.height / 10; break;
            case 1: x = canvas.width / 14; y = canvas.height / 10 + tile_size * 1.5; break;
            case 2: x = canvas.width / 4; y = canvas.height / 2; break;
            case 3: x = canvas.width / 2 - tile_size / 2; y = canvas.height / 2; break;
            case 4: x = canvas.width - (canvas.width / 3); y = canvas.height / 2; break;
            case 5: x = canvas.width - (canvas.width / 14) - tile_size; y = canvas.height / 10 + tile_size * 1.5; break;
            case 6: x = canvas.width - (canvas.width / 14) - tile_size; y = canvas.height / 10; break;
        }

        x = Math.floor(x);
        y = Math.floor(y);

        var new_tile = new Tile(x, y, game_client.players[number].name, game_client.players[number].id, game_client.players[number].HP);
        game_scene.add_tile(new_tile);

    }
}