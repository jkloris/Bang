const socket = io();

var game_client;

socket.on("message", (msg) => {
    console.log(msg);
})

socket.on("update", game => {
    console.log(game);
    game_client = game;
    drawGame();
})

document.addEventListener("click", e => {
    var rect = canvas.getBoundingClientRect();
    var mouse = {x: e.clientX-rect.left, y: e.clientY-rect.top};
    socket.emit("clicked", mouse, socket.id );
})

function drawGame() {
    clear();
    for (i in game_client.players) {
        console.log(game_client.players);
        drawPlayer(i);
    }
}

function drawPlayer(player) {

}