class Card {
    constructor(){
        this.name = null;
        //this.available = true;   
    }
    acion(){

    }
    draw(){

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
        alert("bang");
        // socket.emit("bang", );
    }
    draw = function(x, y, ratio){
        // ctx.drawImage(Sprites.bang, x, y, ratio, Sprites.bang.height / Sprites.bang.width * ratio);
        console.log('TODO',x,y,this);
        
    }
}

class Vedle extends ActionCard{
    constructor(){
        super();
        this.name = "Vedle";
    }
    action(){
        alert("vedle");
        // socket.emit("", );
    }
    draw = function(x, y, ratio){
        console.log(x,y,this);
        // ctx.save();
        // ctx.drawImage(Sprites.vedle, x, y, ratio, Sprites.bang.height / Sprites.bang.width * ratio);
        // ctx.restore();
    }
}
