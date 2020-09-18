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
var jesse_jones = false;

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
    // let random_bang_sound = Math.round(Math.random());
    audio.bang.play();
});

socket.on("Duel", (arg, index_shooter) => {
    socket.emit("RequestedCard", "Bang");
    socket.emit("PlayedCard", "Duel");
});

socket.on("Duel-announcement", () => {
    audio.duel.play();
});

socket.on("dynamitSound", ()=>{
    audio.dynamit.play();
})
socket.on("pivoSound", ()=>{
    audio.pivo.play();
})
socket.on("onTurnSound", ()=>{
    audio.reload.play();
})
socket.on("salonSound", ()=>{
    audio.salon.play();
})
socket.on("turnResumeSound", ()=>{
    audio.pod.play();
})

document.addEventListener("click", e => {
    //ak je zoomnute na nejaku kartu, tak aj LMB click to zrusi
    if (zoomed) { 
        zoomed = false;
        drawGame();
        return;
    }
    if (game_finished) {
        restartRequest();
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
});

socket.on("jesse_jones_action", ()=>{
    jesse_jones = true;
    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "green";
    ctx.font = "30px Arial";
    ctx.fillText(`Vyber si, od ktoreho hraca si chces zobrat kartu`, canvas.width / 2, canvas.height / 2 + 30)
    ctx.restore();
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

//MD5 hash function (from the internet ofc)
var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

function restartRequest() {
    var password = MD5(prompt("Zadaj heslo pre restart..."));
    socket.emit("restart", password);
}