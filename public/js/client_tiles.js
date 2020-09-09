class Tile {
    constructor(x, y, name, id, HP, cards, role, character) { //TODO - ostatne vlastnosti, ked ich budeme vediet zobrazit
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
        this.HP = HP;
        this.cards = cards;
        this.role = role;
        this.character = character;
        if (this.HP <= 0) this.alive = false;
        else this.alive = true;
    }

    drawTile = function(color) {
        var ratio = tile_size.x / 4;
        ctx.save();
        ctx.strokeStyle = color;
        ctx.strokeRect(this.x, this.y, tile_size.x, tile_size.y);
        ctx.font = "18px Calibri";
        ctx.fillText(this.name, this.x, this.y- 5);
        // ctx.fillText(this.HP + 'HP', this.x + 0.2*tile_size.x, this.y + 0.2*tile_size.y);
        // ctx.fillText(this.cards + ' Cards', this.x + 0.2*tile_size.x, this.y + 0.4*tile_size.y);

        //ak je mrtef
        if (!this.alive) {

            var roleIMG;
            switch (this.role) {
                case "Sheriff":
                    roleIMG = Sprites.sheriff;
                    break;
                case "Vice":
                    roleIMG = Sprites.vice;
                    break;
                case "Bandita":
                    roleIMG = Sprites.bandita;
                    break;
                case "Odpadlik":
                    roleIMG = Sprites.odpadlik;
                    break;
                
                default:
                    break;
            }
            ctx.beginPath();
            ctx.lineWidth = 7;
            ctx.strokeStyle = "black";
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + tile_size.x, this.y + tile_size.y);
            ctx.moveTo(this.x + tile_size.x, this.y);
            ctx.lineTo(this.x, this.y + tile_size.y);
            ctx.stroke();
            ctx.drawImage(roleIMG, this.x + tile_size.x / 2.5, this.y + tile_size.y / 2.5, ratio, Sprites.bang.height / Sprites.bang.width * ratio);
        }
        this.drawCards();
        this.drawLife();
        this.blueTest();
        ctx.restore();
    }

    drawCards(){
        var x = this.x + 1;
        var ratio = tile_size.x / 4
        var y = this.y + tile_size.y -  Sprites.bang.height / Sprites.bang.width * ratio - 1;
        for(var i = 0; i < this.cards; i++){
            ctx.save();
            ctx.drawImage(Sprites.back, x, y, ratio, Sprites.bang.height / Sprites.bang.width * ratio); 
            ctx.restore();
            if(this.cards < 6){
                x += ratio - 10;
            }else{
                x += Math.floor(tile_size.x / (this.cards + 2));
            }
        }
    }

    blueTest(){
        var player_i = game_client.players.findIndex(user => user.id === this.id);

        var x = this.x + 1;
        var ratio = tile_size.x / 4;
        var y = this.y  ;
        ctx.save();
        for(var i in game_client.players[player_i].blueCards){
            ctx.drawImage(game_client.players[player_i].blueCards[i].IMG, x, y, ratio, Sprites.bang.height / Sprites.bang.width * ratio);
            x+=ratio / 1.7;
        }
        ctx.restore();
    }
    
    drawLife(){
        var character = null;
        switch (this.character){
            case "paul_regret":
                character = Sprites.paul_regret;
                break;
            case "bart_cassidy":
                character = Sprites.bart_cassidy;
                break;
            case "suzy_lafayette":
                character = Sprites.suzy_lafayette;
                break;
            case "willy_the_kid":
                character = Sprites.willy_the_kid;
                break;
            case "vulture_sam":
                character = Sprites.vulture_sam;
                break;
            case "slab_the_killer":
                character = Sprites.slab_the_killer;
                break;
            case "sid_ketchum":
                character = Sprites.sid_ketchum;
                break;
            case "rose_doolan":
                character = Sprites.rose_doolan;       
                break;
            case "pedro_ramirez":
                character = Sprites.pedro_ramirez;
                break;
            case "lucky_duke":
                character = Sprites.lucky_duke;
                break;
            case "kit_carlson":
                var character = Sprites.kit_carlson;
                break;
            case "jesse_jones":
                character = Sprites.jesse_jones;
                break;
            case "jourdonnais":
                character = Sprites.jourdonnais;
                break;
            case "calamity_janet":
                character = Sprites.calamity_janet;
                break;
            case "black_jack":
                character = Sprites.black_jack;
                break;
            case "el_gringo":
                character = Sprites.el_gringo;
                break;

            default:
                break;
        }


        var x = this.x + tile_size.x - 2;
        var ratio = tile_size.x / 4
        var y = this.y + tile_size.y - Sprites.bang.height / Sprites.bang.width * ratio + 1;
         //TODO
        ctx.save();
        ctx.drawImage(Sprites.back_character, x, y, ratio, Sprites.bang.height / Sprites.bang.width * ratio); 
        if(character != null) ctx.drawImage(character, x, y - (this.HP * (tile_size.y-2) / 10) + 1, ratio, Sprites.bang.height / Sprites.bang.width * ratio); 
        ctx.restore();
    }

    onclick = function(clickedBlue_index) {
        if (this.alive) {

            var player_i = game_client.players.findIndex(user => user.id === socket.id);
            var card_i = game_client.players[player_i].cards.findIndex(card => card.selected === true);

            if(game_client.players[player_i].blueCards[clickedBlue_index] != undefined && game_client.players[player_i].blueCards[clickedBlue_index].name == "Dynamit"){
                socket.emit("dynamiteClick", player_i, clickedBlue_index);
            }

            if(game_client.players[player_i].blueCards[clickedBlue_index] != undefined && game_client.players[player_i].blueCards[clickedBlue_index].name == "Vazenie" && game_client.players[player_i].dynamit == false){
                socket.emit("prisonClick", player_i, clickedBlue_index);
            }

            if(game_client.players[player_i].cards[card_i] != undefined && game_client.players[player_i].cards[card_i].offensive == true && this.id != socket.id  ){ 
                socket.emit("interaction", this.id, game_client.players[player_i].cards[card_i].name, clickedBlue_index, card_i );
            }
        } else alert('Ten je us mrtef kamosko');
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