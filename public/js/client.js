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
    game_client = {}; //zmaze to co tam bolo doteraz
    game_client = $.extend(true, {}, game); //skopiruje tam novy stav pomocou jQuery.extend()
    copyDeck(game);    
    updatePlayers(game);
    drawGame();
    console.log(game_client);
});

//bang
socket.on("Bang", (arg, index_shooter) =>{
    game_client.requestedCard = "Vedle";
    for(var i in game_scene.buttons){
        if(i==2 || i==3){ //use button je na indexe 2 a lose life na 3
            game_scene.buttons[i].visible = true;
        }else{
            game_scene.buttons[i].visible = false;
        }
        game_scene.buttons[i].draw();
    }

    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    let shooter = game_client.players[index_shooter].name;
    ctx.fillText(`${shooter} PLAYED BANG ON YOU!`, canvas.width / 2, canvas.height / 3)
    ctx.restore();

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

socket.on("partial_clickAccept", (mouse)=>{
    game_scene.checkButtons(mouse);
    game_scene.checkCardSelect(mouse);
})

socket.on("discardRequest", () => {
    alert("Nemozes ukoncit kolo. Musis zahodit nejake karty.");
});

socket.on("discardDeny", () => {
    alert("Nemozes vyhodit kartu.");
});

function updatePlayers(game_server) {
    
    //z game objektu, ktory pride zo servera spravi FUNKCNY objekt s kartami pre kazdeho hraca
    for (i in game_client.players) game_client.players[i].cards.length = 0;
    for (i in game_server.players) {
        for (card in game_server.players[i].cards) {
            switch (game_server.players[i].cards[card].name) {
                case "Bang":
                    game_client.players[i].cards.push(new Bang());                    
                    break;
                case "Vedle":
                    game_client.players[i].cards.push(new Vedle());                    
                    break;
            
                default:
                    break;
            }
        }
    }
    //YES KONECNE TOTO VYZERA ZE FUNGUJE
    


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

        var new_tile = new Tile(x, y, game_client.players[number].name, game_client.players[number].id, game_client.players[number].HP,game_client.players[number].cards.length);
        game_scene.add_tile(new_tile);

    }
}

function copyDeck(game_server){
    game_client.cards = [];
    for (card in game_server.cards) {
        switch (game_server.cards[card].name) {
            case "Bang":
                game_client.cards.push(new Bang());                    
                break;
            case "Vedle":
                game_client.cards.push(new Vedle());                    
                break;
        
            default:
                break;
        }
    }
}