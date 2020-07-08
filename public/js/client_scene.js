class Scene {
    constructor() {
        this.tiles = [];
    }

    add_tile = function(tile) {
        this.tiles.push(tile);
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