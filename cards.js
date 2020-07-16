class Card {
    constructor(){
        this.name = null;
        this.available = true;  
        this.selected = false; 
        this.IMG = null;
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
    action(game,player,card){
        if(game.requestedPlayer !=null){
            console.log("Vedle");
            game.requestedPlayer = null;
            for(var i in game.cards){
                if(game.cards[i].name == game.players[player].cards[card].name && game.cards[i].available == false){
                    game.cards[i].available = true;
                    break;
                }
            }
            game.players[player].cards.splice(card,1);
        }
        
    }
    
}


module.exports = [Bang, Vedle];