//const Game = require("./game");

class Player{
    constructor(id, maxHP, role, character){
        this.id = id;
        
        //docasne kvoli dev
        //this.HP = 5;
        this.HP = maxHP; //inak to je takto

        this.alive = true;
        this.maxHP = maxHP;
        this.role = role //TODO
        this.character = character; //TODO
        this.cards = []; //karty tohto hraca
        this.blueCards = [];
        this.name;
        this.scope = {gun : 0, mustang : 0, appaloosa : 0};
        this.prison = false;
        this.dynamit = false;
    }
}

class Character{
    constructor(player){ //vlastnost player je asi zbytocna, ale nechce sa mi to odtranovat a ked ju odkomentujem tak sa to zacykli
        // this.player = player;
        this.name = null;
        this.HP = 4;
        
    }

    init(player){
        player.HP = this.HP;
        player.maxHP = this.HP;
    }

    action(game, index_sender) {
        console.log(this.name + " action request.");
    }
}

class Paul_regret extends Character{
    constructor(player){
        super(player);
        this.name = "paul_regret";
        this.HP = 3;
    }
}

class Bart_cassidy extends Character{
    constructor(player){
        super(player);
        this.name = "bart_cassidy";
        this.HP = 4;
    }
}

class Suzy_lafayette extends Character{
    constructor(player){
        super(player);
        this.name = "suzy_lafayette";
        this.HP = 4;
    }
}

class Willy_the_kid extends Character{
    constructor(player){
        super(player);
        this.name = "willy_the_kid";
        this.HP = 4;
    }
}

class Vulture_sam extends Character{
    constructor(player){
        super(player);
        this.name = "vulture_sam";
        this.HP = 4;
    }
}

class Slab_the_killer extends Character{
    constructor(player){
        super(player);
        this.name = "slab_the_killer";
        this.HP = 4;
    }
}

class Sid_ketchum extends Character{
    constructor(player){
        super(player);
        this.name = "sid_ketchum";
        this.HP = 4;
    }
}

class Rose_doolan extends Character{
    constructor(player){
        super(player);
        this.name = "rose_doolan";
        this.HP = 4;
    }
}

class Pedro_ramirez extends Character{
    constructor(player){
        super(player);
        this.name = "pedro_ramirez";
        this.HP = 4;
    }
}
class Lucky_duke extends Character{
    constructor(player){
        super(player);
        this.name = "lucky_duke";
        this.HP = 4;
    }
}

class Kit_carlson extends Character{
    constructor(player){
        super(player);
        this.name = "kit_carlson";
        this.HP = 4;
    }
}

class Jesse_jones extends Character{
    constructor(player){
        super(player);
        this.name = "jesse_jones";
        this.HP = 4;
    }
}

class El_gringo extends Character{
    constructor(player){
        super(player);
        this.name = "el_gringo";
        this.HP = 3;
    }
}

class Calamity_janet extends Character{
    constructor(player){
        super(player);
        this.name = "calamity_janet";
        this.HP = 4;
    }
}

class Black_jack extends Character{
    constructor(player){
        super(player);
        this.name = "black_jack";
        this.HP = 4;
    }

    action(game, index_sender) {
        if (game.turn == index_sender && game.moveStage == 0) {
            game.moveStage++;
            game.dealOneCard(index_sender);

            //druha karta
            var drawn_card = game.cards.pop();
            game.players[index_sender].cards.push(drawn_card);
            if (drawn_card.suit == "diamonds" || drawn_card.suit == "heart") {
                game.dealOneCard(index_sender);
            }
            return drawn_card.name; //vratim nazov druhej karty, lebo tu ukazuje v kazdom pripade
        }
    }
}

class Jourdonnais extends Character{
    constructor(player){
        super(player);
        this.name = "jourdonnais";
        this.HP = 4;
    }
}

class Felipe_prisonero extends Character{
    constructor(player){
        super(player);
        this.name = "felipe_prisonero";
        this.HP = 4;
    }
}

module.exports = [Player, Paul_regret, Rose_doolan, Bart_cassidy, Suzy_lafayette, Willy_the_kid, Vulture_sam, Slab_the_killer, Sid_ketchum, Pedro_ramirez, Lucky_duke, Kit_carlson, Jesse_jones, El_gringo, Calamity_janet, Jourdonnais, Black_jack, Felipe_prisonero];