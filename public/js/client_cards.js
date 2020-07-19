class Card {
    constructor(){
        this.name = null;
        // this.available = true;  
        this.selected = false; 
        this.offensive = false; //karta, ktora sa aktivuje kliknutim na hraca. Vymysli lepsi nazov
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

