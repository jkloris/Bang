//funkcie na vykreslovanie do canvasu

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = window.innerWidth * 0.99;
ctx.canvas.height = window.innerHeight * 0.9;

const tile_size = {x : canvas.width / 7, y : canvas.width / 9};


function clear() {
    ctx.save();
    ctx.fillStyle="rgb(250, 230, 198)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.restore();
}

function drawGame() {
    if (game_finished || zoomed || kit_carlson || lucky_duke) return;
    clear();


    //draw players
    for (i in game_scene.tiles) {
        if(game_scene.tiles[i].id == socket.id){
            var color = "green";
            //ak je client mrtvy, napise mu to
            if (!game_scene.tiles[i].alive) {
                ctx.save();
                ctx.fillStyle = "red";
                ctx.font = "60px Arial";
                ctx.fillText(`BYLS ZABIT`, 10, canvas.height - 70);
                ctx.restore();
            }
        }else{
            var color = "black";
        }
        game_scene.tiles[i].drawTile(color);
        
        //nakresli sheriffa
        if(game_client.players[i].role == "Sheriff"){
            var ratio_tile = tile_size.x / 4
            var x = game_scene.tiles[i].x + tile_size.x + ratio_tile;
            var y = game_scene.tiles[i].y + tile_size.y - Sprites.bang.height / Sprites.bang.width * ratio_tile + 1;
            ctx.save();
            ctx.drawImage(Sprites.sheriff, x, y, ratio_tile, Sprites.bang.height / Sprites.bang.width * ratio_tile); 
            ctx.restore();
        }
        
        if(i == game_client.turn){
            ctx.fillStyle = "red";
            ctx.fillRect(game_scene.tiles[i].x,game_scene.tiles[i].y,10,10);
            ctx.fillStyle = "black";
        }
    }


    //draw buttons
    //hrac co je na tahu
    if (game_client.turn != null && game_client.requestedPlayer == null && socket.id == game_client.players[game_client.turn].id ){
        for(var i in game_scene.buttons){
            game_scene.buttons[i].visible = true;
            //game_scene.buttons[i].draw();
        }         
        game_scene.buttons[3].visible = false;  //3 je index lose life     
        //game_scene.buttons[i].draw();
    }
    //hrac, co je na tahu, ale je v dueli
    else if (game_client.turn != null && game_client.requestedPlayer != null && socket.id == game_client.players[game_client.turn].id && game_client.players[game_client.requestedPlayer].id == socket.id && game_client.playedCard == "Duel") {
        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText(`DUELLO`, canvas.width / 2, canvas.height / 2 - 20);
        ctx.restore();
        for (var i in game_scene.buttons) {
            if(i==2 || i==3){ //use button je na indexe 2 a lose life na 3
                game_scene.buttons[i].visible = true;
            } else{
                game_scene.buttons[i].visible = false;
            }
        }
    }
    //hrac, co nie je na tahu, ale je od neho vyzadovana nejaka akcia
    else if(game_client.requestedPlayer != null && socket.id != game_client.players[game_client.turn].id && socket.id == game_client.players[game_client.requestedPlayer].id){
        if (game_client.playedCard == "Indiani") {
            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = "red";
            ctx.font = "40px Arial";
            ctx.fillText(`DIE INDIANEN, SPIEL EIN BANG BITTE!!!`, canvas.width / 2, canvas.height / 2 - 20);
            ctx.restore();
            if (play_audio) {
                audio.indiani.play();
                play_audio = false;
            }
        } else if (game_client.playedCard == "Gulomet") {
            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = "red";
            ctx.font = "40px Arial";
            ctx.fillText(`DAS MACHINENGEWEHR, SPIEL EINE AUSWEICHE BITTE!!!`, canvas.width / 2, canvas.height / 2 - 20);
            ctx.restore();
            if (play_audio) {
                audio.gulomet.play();
                play_audio = false;
            }
        } else if (game_client.playedCard == "Bang") {
            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = "red";
            ctx.font = "40px Arial";
            let shooter = game_client.players[game_client.turn].name;
            ctx.fillText(`${shooter} PLAYED BANG ON YOU!`, canvas.width / 2, canvas.height / 2 - 20);
            ctx.restore(); 
        } else if (game_client.playedCard == "Duel") {
            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = "red";
            ctx.font = "40px Arial";
            let shooter = game_client.players[game_client.turn].name;
            ctx.fillText(`DUELLO MIT ${shooter}`, canvas.width / 2, canvas.height / 2 - 20);
            ctx.restore(); 
        }
        for (var i in game_scene.buttons) {
            if(i==2 || i==3){ //use button je na indexe 2 a lose life na 3
                game_scene.buttons[i].visible = true;
            } else{
                game_scene.buttons[i].visible = false;
            }
            //game_scene.buttons[i].draw();
        }
    }
    //hrac, ktory je na tahu ALE prave je pozadovana akcia od INEHO HRACA
    else if (game_client.requestedPlayer != null && socket.id == game_client.players[game_client.turn].id && socket.id != game_client.players[game_client.requestedPlayer].id){
        for(var i in game_scene.buttons){    
            game_scene.buttons[i].visible = false;
            //game_scene.buttons[i].draw();
        }
    }
    else for (var i in game_scene.buttons) game_scene.buttons[i].visible = false;

    if (game_client.started) game_scene.buttons[1].visible = false; //ak je zacata hra, nezobrazuje sa Start button
    game_scene.buttons[5].visible = true; //log button je visible vzdy
    
    //teraz su nastavene visibility na buttonoch a iba ich vykreslime
    for (var i in game_scene.buttons) game_scene.buttons[i].draw();


    //draw hand (cards)
    let index = game_client.players.findIndex(user => user.id === socket.id);
    //index = index toho hraca, ktoremu zobrazujeme karty, co ma na ruke
    
    if (game_client.started) { //kontroluje, ci uz bola zacata hra
        var x = 10;
        var ratio = canvas.width / 18;
        var y = canvas.height - Sprites.bang.height / Sprites.bang.width * ratio - 10;

        for(i in game_client.players[index].cards){
            game_client.players[index].cards[i].draw(x,y,ratio);         

            x+=ratio - 10;
            //console.log(x,ratio);
        }

        //draw role
        var roleIMG;
        switch (game_client.players[index].role) {
            case "Sheriff":
                roleIMG = Sprites.sheriff;
                break;
            case "Vice":
                roleIMG = Sprites.vice;
                break;
            case "Bandita":
                roleIMG = Sprites.bandita;
                break;
            case "Odpadlik":
                roleIMG = Sprites.odpadlik;
                break;
        
            default:
                break;
        }
        ctx.drawImage(roleIMG, canvas.width - 220 - ratio, y, ratio, Sprites.bang.height / Sprites.bang.width * ratio);

        //draw deck
        var deck = new Back();
        var bang = new Bang();
        for(var i = 0; i < 15; i++){
            bang.draw(canvas.width / 2 + i, canvas.height / 13 - i, ratio); //duplikovana karta Bang vytvara krajsi tien ako zadna strana
        }
        deck.draw(canvas.width / 2 + i, canvas.height / 13 - i, ratio); 

        for(var i = 0; i < game_client.trashedCards && i < 10; i++){
            game_client.cards[0].draw(canvas.width / 2 - ratio - 10 + i, canvas.height / 13 - i, ratio);
        }
        
        //informacie o tom, co treba robit na zaciatku kola
        if (game_client.moveStage == 0 && index == game_client.turn && game_client.players[index].dynamit){
            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = "green";
            ctx.font = "30px Arial";
            ctx.fillText(`Achten Sie auf Dynamit!`, canvas.width / 2, canvas.height / 2 - 20)
            ctx.restore();
        } 
        else if (game_client.moveStage == 0 && index == game_client.turn && game_client.players[index].prison == true){
            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = "green";
            ctx.font = "30px Arial";
            ctx.fillText(`Du bist im Gefängnis!`, canvas.width / 2, canvas.height / 2 - 20)
            ctx.restore();
        } 
        else if (game_client.moveStage == 0 && index == game_client.turn) {
            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = "green";
            ctx.font = "30px Arial";
            ctx.fillText(`Bitte starte bei Karten nehmen!`, canvas.width / 2, canvas.height / 2 - 20)
            ctx.restore();
        }

        //draw emporio (hokynarstvi)
        if(game_client.playedCard == "Hokynarstvo"){
            var dl = game_client.players.length * ratio / 1.6 ;

            var turn = game_client.requestedPlayer;
            var count = 0;
            while(turn != game_client.turn || count == 0){
                turn++;
                if(turn >= game_client.players.length)
                    turn = 0;
                if(game_client.players[turn].alive) count++;
            }

            for(var i = 0; i < count; i++){
                    game_client.cards[game_client.cards.length - i - 1].draw(canvas.width / 2 + (i+1) * ratio - dl, canvas.height / 3.7, ratio);
            }
        }
    }
}

function kit_carlsonDraw() {
    var ratio = canvas.width / 18;

    for(var i = 0; i < 3; i++){
        game_client.cards[game_client.cards.length - i - 1].draw(canvas.width / 2 + (i + 1) * ratio - 3 * ratio, canvas.height / 2 - (Sprites.bang.height / Sprites.bang.width * ratio), ratio);
    }
}

function lucky_dukeDraw(){
    var ratio = canvas.width / 18;

    for(var i = 0; i < 2; i++){
        game_client.cards[game_client.cards.length - i - 1].draw(canvas.width / 2 + (i + 1) * ratio - 2 * ratio, canvas.height / 2 - (Sprites.bang.height / Sprites.bang.width * ratio), ratio);
    }
}

function drawWinner(winner) {
    clear();

    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "green";
    ctx.font = "60px Arial";
    ctx.fillText(`GAME OVER! ${winner} WON!`, canvas.width / 2, canvas.height / 2 - 20)
    ctx.restore();

}


// LOG (partially stolen from W3)
// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}