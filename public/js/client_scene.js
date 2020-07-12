class Scene {
    constructor() {
        this.tiles = [];
        this.buttons = [];
    }

    
    add_tile(tile) {
        this.tiles.push(tile);
        console.log( this.tiles);
    }
    
    init() {
        this.buttons.push( new Button(canvas.width - 100, canvas.height - 100, 80, 50, "button", "rgb(255, 153, 0)"));
    }
    onclick = function(point) {
        var i;
        for (i in this.tiles) {            
            var current = this.tiles[i];
            if (point.x >= current.x && point.x <= current.x + tile_size && point.y >= current.y && point.y <= current.y + tile_size) {
                current.onclick();
            }
        }
        for(i in this.buttons){
            var current = this.buttons[i];
            if (point.x >= current.x && point.x <= current.x + current.sizeX && point.y >= current.y && point.y <= current.y + current.sizeY) {
                current.onclick();
            }
        }
    }
}