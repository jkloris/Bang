class Card {
    constructor(){
        this.name = null;
        // this.available = true;  
        this.selected = false; 
        this.offensive = false; //karta, ktora sa aktivuje kliknutim na hraca. Vymysli lepsi nazov
        this.IMG = null;
        this.onRange = false;
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
        this.IMG = Sprites.wellsfargo
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
    }

    // action(game, player, card){
    //     if(game.requestedPlayer == null){
    //         for(var i in game.players){
                
    //             if( game.players[i].HP < game.players[i].maxHP ){
    //                 game.players[i].HP++;
    //             }
    //         }
    //         discardCard(game, player, card);
    //     }
    // }

}

class Indiani extends ActionCard{
    constructor(){
        super();
        this.name = "Indiani"
        this.IMG = Sprites.indiani;
    }

    action(){
        
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
    }

}

class Carabine extends Gun{
    constructor(){
        super();
        this.name = "Carabine";
        this.IMG = Sprites.carabine;
    }
}

class Winchester extends Gun{
    constructor(){
        super();
        this.name = "Winchester";
        this.IMG = Sprites.winchester;
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
    }
}

class Appaloosa extends BlueCard{
    constructor(){
        super();
        this.name = "Appaloosa";
        this.IMG = Sprites.appaloosa;
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