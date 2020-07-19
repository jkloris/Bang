class Card {
    constructor(){
        this.name = null;
        //this.available = true;
        this.selected = false; 
        //this.IMG = null;
    }
    acion(){

    }
    draw = function(x, y, ratio){
        ctx.save();
        ctx.drawImage(this.IMG, x, y, ratio, Sprites.bang.height / Sprites.bang.width * ratio); 
        if(this.selected){
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, ratio, Sprites.bang.height / Sprites.bang.width * ratio);
        }
        ctx.restore();
    }
}

class BlueCard extends Card{
    constructor(){
        super();
    }
    effect(){

    }
}

class ActionCard extends Card{
    constructor(){
        super();
    }
    postAction(){
        //vyhod kartu
    }
}

class Bang extends ActionCard{
    constructor(){
        super();
        this.name = "Bang";
    }
    action(){
        // alert("bang");
        // socket.emit("bang", );
    }
   
}

class Vedle extends ActionCard{
    constructor(){
        super();
        this.name = "Vedle";
    }
    action(game, player, card){
        if(game.requestedPlayer != null){
            console.log("Vedle");
            game.requestedPlayer = null;
            discardCard(game, player, card);
        }
        
    }
    
}

class Dostavnik extends ActionCard{
    constructor(){
        super();
        this.name = "Dostavnik";
    }
    
    action(game, player, card){
        if(game.requestedPlayer == null){
            game.dealOneCard(player);
            game.dealOneCard(player);
            discardCard(game, player, card);
        }
    }
}

class Wellsfargo extends ActionCard{
    constructor(){
        super();
        this.name = "Wellsfargo";
    }
    
    action(game, player, card){
        if(game.requestedPlayer == null){
            game.dealOneCard(player);
            game.dealOneCard(player);
            game.dealOneCard(player);
            discardCard(game, player, card);
        }
    }
}

class Pivo extends ActionCard{
    constructor(){
        super();
        this.name = "Pivo";
    }

    action(game, player, card){
        if(game.requestedPlayer == null && game.players[player].HP < game.players[player].maxHP ){
            game.players[player].HP++;
            discardCard(game, player, card);
        }
    }

}

function discardCard(game, player_i, card_i) {
    game.cards.unshift(game.players[player_i].cards[card_i]);    
    game.trashedCards++;
    game.players[player_i].cards.splice(card_i,1);
}
module.exports = [Bang, Vedle, Dostavnik, Wellsfargo, Pivo];