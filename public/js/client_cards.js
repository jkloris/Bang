class Card {
    constructor(){
        this.name = null;
        this.selected = false; 
        this.offensive = false; //karta, ktora sa aktivuje kliknutim na hraca. Vymysli lepsi nazov
        this.IMG = null;
        this.onRange = false;
        this.suit = null;
        this.rank = null;
        
    }
    acion(){

    }
    draw = function(x, y, ratio){
        let cardSuit;
        switch (this.suit) {
            case "heart": 
            cardSuit = Sprites.srdce;
            break;
            case "spades": 
            cardSuit = Sprites.pika;
            break;
            case "clubs": 
            cardSuit = Sprites.tref;
            break;
            case "diamonds": 
            cardSuit = Sprites.kara;
            break;
            default:
                break;
        }

        ctx.save();
        ctx.drawImage(this.IMG, x, y, ratio, Sprites.bang.height / Sprites.bang.width * ratio); 
        if (this.rank != null){

            var fontSize = ratio / 9 ;
            ctx.lineWidth = ratio / 40;
            ctx.strokeStyle = "white";
            ctx.fillStyle = "black";
            // ctx.lineJoin="round";
            // ctx.miterLimit=2;
            ctx.font = `bold ${fontSize}px Comic Sans MS`;
            ctx.strokeText(this.rank, x + ratio / 12 - 1, y + Sprites.bang.height / Sprites.bang.width * ratio - ratio / 5 + ratio / 10 - 1)
            ctx.fillText(this.rank, x + ratio / 12 - 1, y + Sprites.bang.height / Sprites.bang.width * ratio - ratio / 5 + ratio / 10 - 1)
        }
        if (cardSuit != null)    ctx.drawImage(cardSuit, x + ratio / 6, y + Sprites.bang.height / Sprites.bang.width * ratio - ratio / 5, ratio / 10, ratio / 10); 
        
        if (this.selected){
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, ratio, Sprites.bang.height / Sprites.bang.width * ratio);
        }
        ctx.restore();
    }
}

class Back extends Card{
    constructor(){
        super();
        this.name = "Back";
        this.IMG = Sprites.back;
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
        this.IMG = Sprites.bang;
        this.offensive = true;
        this.onRange = true;
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
        this.IMG = Sprites.vedle;
    }
    action(){
        // alert("vedle");
        // socket.emit("", );
    }
    
}

class Dostavnik extends ActionCard{
    constructor(){
        super();
        this.name = "Dostavnik";
        this.IMG = Sprites.dostavnik;
        this.suit = "spades";
        this.rank = "9";
    }

    // action(game, player, card){
    //     game.dealOneCard(player);
    //     game.dealOneCard(player);
    // }
}

class Wellsfargo extends ActionCard{
    constructor(){
        super();
        this.name = "Wellsfargo";
        this.IMG = Sprites.wellsfargo;
        this.suit = "heart";
        this.rank = "3";

    }
    
    // action(game, player, card){
    //     if(game.requestedPlayer == null){
    //         game.dealOneCard(player);
    //         game.dealOneCard(player);
    //         game.dealOneCard(player);
    //         discardCard(game, player, card);
    //     }
    // }
}

class Pivo extends ActionCard{
    constructor(){
        super();
        this.name = "Pivo";
        this.IMG = Sprites.pivo;
        this.suit = "heart";
    }

    // action(game, player, card){
    //     if(game.requestedPlayer == null && game.player[player].HP < game.player[player].maxHP ){
    //         game.player[player].HP++;
    //         discardCard(game, player, card);
    //     }
    // }

}

class Salon extends ActionCard{
    constructor(){
        super();
        this.name = "Salon";
        this.IMG = Sprites.salon;
        this.suit = "heart";
        this.rank = "5";

    }

    // action(game, player, card){
    //     if(game.requestedPlayer == null){
    //         for(var i in game.players){
                
    //             if( game.players[i].HP < game.players[i].maxHP ){
    //                 game.players[i].HP++;
    //             }
    //     }
    // }

}

class Indiani extends ActionCard{
    constructor(){
        super();
        this.name = "Indiani"
        this.IMG = Sprites.indiani;
        this.suit = "diamonds";
    }

    action(){
        
    }
}

class Gulomet extends ActionCard{
    constructor(){
        super();
        this.name = "Gulomet"
        this.IMG = Sprites.gulomet;
        this.suit = "heart";
        this.rank = "10";
    }
}

class Gun extends BlueCard{
    constructor(){
        super();
        this.gun = true;
    }

}

class Schofield extends Gun{
    constructor(){
        super();
        this.name = "Schofield";
        this.IMG = Sprites.schofield;
    }
}

class Remington extends Gun{
    constructor(){
        super();
        this.name = "Remington";
        this.IMG = Sprites.remington;
        this.suit = "clubs";
        this.rank = 'K';
    }

}

class Carabine extends Gun{
    constructor(){
        super();
        this.name = "Carabine";
        this.IMG = Sprites.carabine;
        this.suit = "clubs";
        this.rank = "A";
    }
}

class Winchester extends Gun{
    constructor(){
        super();
        this.name = "Winchester";
        this.IMG = Sprites.winchester;
        this.suit = "spades";
        this.rank = "8";
    }
}

class Volcanic extends Gun{
    constructor(){
        super();
        this.name = "Volcanic";
        this.IMG = Sprites.volcanic;
    }
}


class Mustang extends BlueCard{
    constructor(){
        super();
        this.name = "Mustang";
        this.IMG = Sprites.mustang;
        this.suit = "heart";
    }
}

class Appaloosa extends BlueCard{
    constructor(){
        super();
        this.name = "Appaloosa";
        this.IMG = Sprites.appaloosa;
        this.suit = "spades";
        this.rank = "A";
    }
}

class Catbalou extends ActionCard{
    constructor(){
        super();
        this.name = "Catbalou"
        this.IMG = Sprites.catbalou;
        this.offensive = true;
    }

    action(){
        
    }
}


class Panika extends ActionCard{
    constructor(){
        super();
        this.name = "Panika"
        this.IMG = Sprites.panika;
        this.offensive = true;
        this.onRange = true;
    }
}

class Hokynarstvo extends ActionCard{
    constructor(){
        super();
        this.name = "Hokynarstvo";
        this.IMG = Sprites.hokynarstvo;
    
    }

}

class Barel extends BlueCard{
    constructor(){
        super();
        this.name = "Barel";
        this.IMG = Sprites.barel;
    }
}

class Vazenie extends BlueCard{
    constructor(){
        super();
        this.name = "Vazenie";
        this.IMG = Sprites.vazenie;
        this.offensive = true;
    
    }

}

class Dynamit extends BlueCard{
    constructor(){
        super();
        this.name = "Dynamit";
        this.IMG = Sprites.dynamit;    
    }

}

class Duel extends ActionCard{
    constructor(){
        super();
        this.name = "Duel";
        this.IMG = Sprites.duel;
        this.offensive = true;
        this.onRange = false;
    }   
}