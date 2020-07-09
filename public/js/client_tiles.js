class Tile {
    constructor(x, y, name, id, lives) { //TODO - ostatne vlastnosti, ked ich budeme vediet zobrazit
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.lives = null;
    }

    drawTile = function(color) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.strokeRect(this.x, this.y, tile_size, tile_size);
        ctx.font = "18px Calibri";
        ctx.strokeText(this.name, this.x, this.y);
        ctx.restore();
    }

    onclick = function() {
        alert(this.name, this.id);
    }
}