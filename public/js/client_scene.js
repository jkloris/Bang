class Scene {
    constructor() {
        this.tiles = [];
    }

    
    add_tile(tile) {
        this.tiles.push(tile);
        console.log( this.tiles);
    }
    
    init() {
        var new_tile = new Button(canvas.width - 100, canvas.height - 100, 50, 50, "button", "yellow");
        this.add_tile(new_tile);
        // console.log(this);
    }
    onclick = function(point) {
        var i;
        for (i in this.tiles) {            
            var current = this.tiles[i];
            if (point.x >= current.x && point.x <= current.x + tile_size && point.y >= current.y && point.y <= current.y + tile_size) {
                current.onclick();
            }
        }
    }
}