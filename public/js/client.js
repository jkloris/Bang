const socket = io();

//const name = prompt('Meno?');
const asdfg = Math.floor(Math.random() * 10);
const name = `Arne Birkenstock${asdfg}`;
socket.emit('set-name', name);


var game_client; //stav hry ulozeny na strane klienta

socket.on("message", (msg) => {
    console.log(msg);
})

socket.on("update", game => {
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
        //console.log(game_client.players);
        drawPlayer(parseInt(i));
    }
}

function drawPlayer(number) {
    //console.log(game_client.players[i].id);
    let size = canvas.width / 10;
    let x; let y;
    //var x = canvas.width / 14; var y = canvas.height / 10 + size * 1.5;
    
    //nastavenie pozicie vykreslenia hraca
    switch (number) {
        case 0: x = canvas.width / 14; y = canvas.height / 10; break;
        case 1: x = canvas.width / 14; y = canvas.height / 10 + size * 1.5; break;
        case 2: x = canvas.width / 4; y = canvas.height / 2; break;
        case 3: x = canvas.width / 2 - size / 2; y = canvas.height / 2; break;
        case 4: x = canvas.width - (canvas.width / 3); y = canvas.height / 2; break;
        case 5: x = canvas.width - (canvas.width / 14) - size; y = canvas.height / 10 + size * 1.5; break;
        case 6: x = canvas.width - (canvas.width / 14) - size; y = canvas.height / 10; break;
    }

    ctx.save();
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black;"
    ctx.strokeRect(x, y, size, size);
    ctx.font = "18px Calibri";
    ctx.strokeText(game_client.players[number].name, x, y);

    ctx.restore();

}