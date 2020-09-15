const socket = io();

const player_name = setName();
socket.emit('set-name', player_name);

var game_client; //stav hry ulozeny na strane klienta
var game_scene = new Scene;
game_scene.init();

var play_audio = true;
var game_finished = false;
var cardSelected = false;
var zoomed = false;

var kit_carlson = false; //neviem jak to spravit krajsie
var lucky_duke = false; 

socket.on("message", (msg) => {
    console.log(msg);
});

socket.on("update", game => {
    game_client = {}; //zmaze to co tam bolo doteraz
    game_client = $.extend(true, {}, game); //skopiruje tam novy stav pomocou jQuery.extend()
    copyDeck(game);    
    updatePlayers(game);
    drawGame();
});

//bang
socket.on("Bang", (arg, index_shooter) =>{
    //presunul som to na server aj kvoli barelu
    socket.emit("RequestedCard", "Vedle");
    socket.emit("PlayedCard", "Bang");
    let random_bang_sound = Math.round(Math.random());
    audio.bang[random_bang_sound].play();
});

socket.on("Duel", (arg, index_shooter) => {
    socket.emit("RequestedCard", "Bang");
    socket.emit("PlayedCard", "Duel");
});

socket.on("Duel-announcement", () => {
    audio.duel.play();
});


document.addEventListener("click", e => {
    //ak je zoomnute na nejaku kartu, tak aj LMB click to zrusi
    if (zoomed) { 
        zoomed = false;
        drawGame();
        return;
    }
    var rect = canvas.getBoundingClientRect();
    var mouse = {x: e.clientX-rect.left, y: e.clientY-rect.top};
    //console.log(mouse.x, mouse.y);
    socket.emit("clicked", mouse, socket.id );
});

document.addEventListener("contextmenu", e => {
    e.preventDefault();
    let rect = canvas.getBoundingClientRect();
    let mouse = {x: e.clientX-rect.left, y: e.clientY-rect.top};

    if (game_scene.buttons[2].visible && cardSelected) game_scene.buttons[2].onclick(); //ak je selectnuta karta, tak rightclick = useCard.onclick();
    else if (!zoomed) game_scene.rightClickCheck(mouse); //ak nie je zoomnute
    else { //ak je zoomnute, tak sa zoomnutie zrusi a vykresli sa normalne hra
        zoomed = false;
        drawGame();
    }
});

socket.on("clickAccept", (mouse)=>{
    game_scene.onclick(mouse);
})

socket.on("partial_clickAccept", (mouse)=>{
    game_scene.checkButtons(mouse);
    game_scene.checkCardSelect(mouse);
    game_scene.luckyDuke(mouse);

    var clickedBlue = game_scene.checkBlueCards(mouse, game_scene.tiles[game_client.requestedPlayer], game_client.requestedPlayer);
    if(clickedBlue != null) socket.emit("ownBlueClicked", clickedBlue);
})

socket.on("logClick", (point)=>{
    var current = game_scene.buttons[5];
    if (current.visible && point.x >= current.x && point.x <= current.x + current.sizeX && point.y >= current.y && point.y <= current.y + current.sizeY) {
        current.onclick();
    }

    game_scene.checkCharacters(point); //postavy kontroluje stale

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

socket.on("log", (content) => {
    var paragraph = document.getElementById("log_paragraph");
    paragraph.innerHTML += content + "<br>";
});

socket.on("winner", (winner) => {
    game_finished = true;
    drawWinner(winner);
});

socket.on("restart", () => {
    game_finished = false;
    var paragraph = document.getElementById("log_paragraph");
    paragraph.innerHTML = "";
});

socket.on("kit_carlson_card_draw", () => {
    kit_carlson = true;
    kit_carlsonDraw();
});

socket.on("lucky_duke", (player)=>{
    lucky_duke = true;
    lucky_dukeDraw();
})

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
                case "Vazenie":
                    game_client.players[i].cards.push(new Vazenie());                    
                    break;
                case "Dynamit":
                    game_client.players[i].cards.push(new Dynamit());
                    break;
                case "Duel":
                    game_client.players[i].cards.push(new Duel()); 
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
                    case "Vazenie":
                        game_client.players[i].blueCards.push(new Vazenie());                    
                        break;    
                    case "Dynamit":
                        game_client.players[i].blueCards.push(new Dynamit());                    
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
        
        var character = game_client.players[number].character == null ? null : game_client.players[number].character.name;
        var new_tile = new Tile(x, y, game_client.players[number].name, game_client.players[number].id, game_client.players[number].HP, game_client.players[number].cards.length, game_client.players[number].role, character );
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
            case "Vazenie":
                game_client.cards.push(new Vazenie());                    
                break;
            case "Dynamit":
                game_client.cards.push(new Dynamit());
                break;
            
            case "Duel":
                game_client.cards.push(new Duel());
                break;

            default:
                break;
        }
    }
}

//name setting
function setName() {
    //toto vytvori defaultne meno Arne BirkenstockXY
    const asdfg = Math.floor(Math.random() * 10);
    var name_default = `Arne Birkenstock${asdfg}`;

    //prompt nevyskoci, ak je tab v prehliadaci inaktivny (in background). Vtedy sa pouzije defaultne meno.
    var name = null;
    if (localStorage.getItem("bang-name") !== null) name = localStorage.getItem("bang-name"); //ak je v cache nejake meno, pouzije sa to;
    // console.log("Po localstorage " + name + " typ: " + typeof(name));
    if (name == null || name == "null") { //ak tam nebolo ziadne meno, bud promptne nove, alebo sa pouzije arne birkenstock
        // console.log("name === null vyslo ako true. name = " + name);
        name = prompt('Meno?') || name_default;
        // console.log("po prompte " + name);
        if (name === "undefined" || name === "null") name = name_default;
    }
    //ak sa pouzilo meno z promptu, tak sa zapise do cache (Arne Birkenstock nechceme do cache zapisovat)
    if (name !== name_default) {
        localStorage.setItem("bang-name", name);
    }
    return name;
}