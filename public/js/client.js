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
    // console.log(game);
});

//bang
socket.on("Bang", (arg, index_shooter) =>{
    
    socket.emit("RequestedCard", "Vedle");
    console.log("test");
    //info o tom, ze na mna niekto striela
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    let shooter = game_client.players[index_shooter].name;
    ctx.fillText(`${shooter} PLAYED BANG ON YOU!`, canvas.width / 2, canvas.height / 2 - 20)
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

    var arg = game_scene.checkBlueCards(mouse, game_scene.tiles[game_client.requestedPlayer], game_client.requestedPlayer);
    if(arg != null) socket.emit("ownBlueClicked", arg);
})

socket.on("emporio_clickAccept", (mouse)=>{ //TODO
    game_scene.checkEmporio(mouse);
});

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
                case "Dostavnik":
                    game_client.players[i].cards.push(new Dostavnik());                    
                    break;
                case "Wellsfargo":
                    game_client.players[i].cards.push(new Wellsfargo());                    
                    break;
                case "Pivo":
                    game_client.players[i].cards.push(new Pivo());                    
                    break;
                case "Salon":
                    game_client.players[i].cards.push(new Salon());                    
                    break;
                case "Indiani":
                    game_client.players[i].cards.push(new Indiani());                    
                    break;
                case "Schofield":
                    game_client.players[i].cards.push(new Schofield());                    
                    break;
                case "Volcanic":
                    game_client.players[i].cards.push(new Volcanic());                    
                    break;
                case "Remington":
                    game_client.players[i].cards.push(new Remington());                    
                    break;
                case "Carabine":
                    game_client.players[i].cards.push(new Carabine());                    
                    break;
                case "Winchester":
                    game_client.players[i].cards.push(new Winchester());                    
                    break;
                case "Mustang":
                    game_client.players[i].cards.push(new Mustang());                    
                    break;
                case "Appaloosa":
                    game_client.players[i].cards.push(new Appaloosa());                    
                    break;
                case "Catbalou":
                    game_client.players[i].cards.push(new Catbalou());                    
                    break;
                case "Panika":
                    game_client.players[i].cards.push(new Panika());                    
                    break;
                case "Gulomet":
                    game_client.players[i].cards.push(new Gulomet());                    
                    break;
                case "Hokynarstvo":
                    game_client.players[i].cards.push(new Hokynarstvo());                    
                    break;
                case "Barel":
                    game_client.players[i].cards.push(new Barel());                    
                    break;
            
                default:
                    break;
            }
        }
        for (i in game_client.players) {
            game_client.players[i].blueCards.length = 0;

            for (card in game_server.players[i].blueCards) {
                switch (game_server.players[i].blueCards[card].name) {
                    case "Schofield":
                        game_client.players[i].blueCards.push(new Schofield());                    
                        break;
                    case "Volcanic":
                        game_client.players[i].blueCards.push(new Volcanic());                    
                        break;
                    case "Remington":
                        game_client.players[i].blueCards.push(new Remington());                    
                        break;
                    case "Carabine":
                        game_client.players[i].blueCards.push(new Carabine());                    
                        break;
                    case "Winchester":
                        game_client.players[i].blueCards.push(new Winchester());                    
                        break;
                    case "Mustang":
                        game_client.players[i].blueCards.push(new Mustang());                    
                        break;
                    case "Appaloosa":
                        game_client.players[i].blueCards.push(new Appaloosa());                    
                        break;    
                    case "Barel":
                        game_client.players[i].blueCards.push(new Barel());                    
                        break;    
                        
                    default:
                        break;
                }
            }
        }
    }
    //YES KONECNE TOTO VYZERA ZE FUNGUJE
    


    game_scene.tiles.length = 0;
    for (number in game_client.players) {
        let x; let y;
        
        //nastavenie pozicie vykreslenia hraca
        switch (parseInt(number)) {
            case 0: x = canvas.width / 18; y = canvas.height / 10; break;
            case 1: x = canvas.width / 18; y = canvas.height / 10 + tile_size.y * 1.5; break;
            case 2: x = canvas.width / 4.2; y = canvas.height / 2; break;
            case 3: x = canvas.width / 2 - tile_size.x / 2; y = canvas.height / 2 + 10; break;
            case 4: x = canvas.width - (canvas.width / 2.6); y = canvas.height / 2; break;
            case 5: x = canvas.width - (canvas.width / 18) - tile_size.x; y = canvas.height / 10 + tile_size.y * 1.5; break;
            case 6: x = canvas.width - (canvas.width / 18) - tile_size.x; y = canvas.height / 10; break;
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
            case "Dostavnik":
                game_client.cards.push(new Dostavnik());                    
                break;
            case "Wellsfargo":
                game_client.cards.push(new Wellsfargo());                    
                break;
            case "Pivo":
                game_client.cards.push(new Pivo());                    
                break;
            case "Salon":
                game_client.cards.push(new Salon());                    
                break;
            case "Indiani":
                game_client.cards.push(new Indiani());                    
                break;
            case "Schofield":
                game_client.cards.push(new Schofield());                    
                break;
            case "Volcanic":
                game_client.cards.push(new Volcanic());                    
                break;
            case "Remington":
                game_client.cards.push(new Remington());                    
                break;
            case "Carabine":
                game_client.cards.push(new Carabine());                    
                break;
            case "Winchester":
                game_client.cards.push(new Winchester());                    
                break;
            case "Mustang":
                game_client.cards.push(new Mustang());                    
                break;
            case "Appaloosa":
                game_client.cards.push(new Appaloosa());                    
                break;
            case "Catbalou":
                game_client.cards.push(new Catbalou());                    
                break;
            case "Panika":
                game_client.cards.push(new Panika());                    
                break;
            case "Gulomet":
                game_client.cards.push(new Gulomet());                    
                break;
            case "Hokynarstvo":
                game_client.cards.push(new Hokynarstvo());                    
                break;
            case "Barel":
                game_client.cards.push(new Barel());                    
                break;
            

            default:
                break;
        }
    }
}