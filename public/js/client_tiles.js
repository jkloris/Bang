class Tile {
    constructor(x, y, name, id, HP) { //TODO - ostatne vlastnosti, ked ich budeme vediet zobrazit
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.HP = HP;
    }

    drawTile = function(color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.strokeRect(this.x, this.y, tile_size, tile_size);
        ctx.font = "18px Calibri";
        ctx.fillText(this.name, this.x, this.y);
        ctx.fillText(this.HP + 'HP', this.x + 0.2*tile_size, this.y + 0.2*tile_size);
        ctx.restore();
    }

    onclick = function() {
        socket.emit("interaction", this.id);
        // alert(this.name +"  (" + this.id + ") "+" interacts with " + socket_id);
    }
}