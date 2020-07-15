class Tile {
    constructor(x, y, name, id, HP, cards) { //TODO - ostatne vlastnosti, ked ich budeme vediet zobrazit
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.HP = HP;
        this.cards = cards;
    }

    drawTile = function(color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.strokeRect(this.x, this.y, tile_size, tile_size);
        ctx.font = "18px Calibri";
        ctx.fillText(this.name, this.x, this.y);
        ctx.fillText(this.HP + 'HP', this.x + 0.2*tile_size, this.y + 0.2*tile_size);
        ctx.fillText(this.cards + ' Cards', this.x + 0.2*tile_size, this.y + 0.4*tile_size);
        ctx.restore();
    }

    onclick = function() {//event , arg
        var player_i = game_client.players.findIndex(user => user.id === socket.id);
        var card_i = game_client.players[player_i].cards.findIndex(card => card.selected === true);
       
        socket.emit("interaction", this.id, game_client.players[player_i].cards[card_i].name, null, card_i );
        // alert(this.name +"  (" + this.id + ") "+" interacts with " + socket_id);
    }
}

class Button {
    constructor(x, y, sizeX, sizeY, text, color){
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.visible = true;
    }

    draw = function() {
        ctx.save();

        if(this.visible)    
            ctx.fillStyle = this.color;
        else
            ctx.fillStyle = "rgb(209,209,209)";

        ctx.fillRect(this.x, this.y, this.sizeX, this.sizeY);
        ctx.fillStyle = "black";
        ctx.font = "18px Calibri";
        ctx.textAlign = "center";
        ctx.fillText(this.text, this.x + this.sizeX / 2, this.y+ this.sizeY / 2);
        ctx.restore();
    }

    onclick = function() {
        this.action();

    }

    action(){

    }


}