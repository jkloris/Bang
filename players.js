//const Game = require("./game");

class Player{
    constructor(id, maxHP, role, character){
        this.id = id;
        
        //docasne kvoli dev
        // this.HP = 1;
        this.HP = maxHP; //inak to je takto

        this.alive = true;
        this.maxHP = maxHP;
        this.role = role //TODO
        this.character = character; //TODO
        this.cards = []; //karty tohto hraca
        this.blueCards = [];
        this.name;
        this.scope = {gun : 0, mustang : 0, appaloosa : 0, paul_regret : 0, rose_doolan : 0};
        this.prison = false;
        this.dynamit = false;
        this.bangLimit = 1;
        this.bangLeft = 1;
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

    init(player){
        player.HP = this.HP;
        player.maxHP = this.HP;
        player.scope.paul_regret = 1;
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

    action(player, game){
        if(game.players[player].cards == 0){
            game.dealOneCard(player);
        }
    }
}

class Willy_the_kid extends Character{
    constructor(player){
        super(player);
        this.name = "willy_the_kid";
        this.HP = 4;
    }

    init(player){
        player.HP = this.HP;
        player.maxHP = this.HP;
        player.bangLimit = 100;
        player.bangLeft = 100;
    }
}

class Vulture_sam extends Character{
    constructor(player){
        super(player);
        this.name = "vulture_sam";
        this.HP = 4;
    }

    diff_action(player,dead_player_index, game){
        while (game.players[dead_player_index].cards.length > 0) {
            var card = game.players[dead_player_index].cards.pop();
            game.players[player].cards.unshift(card);
        }
        while (game.players[dead_player_index].blueCards.length > 0){
            var card = game.players[dead_player_index].blueCards.pop();
            game.players[player].cards.unshift(card);
        }
    }
}

class Slab_the_killer extends Character{
    constructor(player){
        super(player);
        this.name = "slab_the_killer";
        this.HP = 4;
        this.vedleCount = 0;
    }

}

class Sid_ketchum extends Character{
    constructor(player){
        super(player);
        this.name = "sid_ketchum";
        this.HP = 4;
        this.discartedCards = 0;
    }

    action(game, player, io){
        if(game.turn == player){
            if(game.players[player].character.discartedCards >= 2 && game.players[player].HP < game.players[player].maxHP ){
                game.players[player].HP++;
                game.players[player].character.discartedCards -= 2;

                io.emit("log", game.players[player].name + " (" + game.players[player].character.name +  ")");
            }
        }
    }
}

class Rose_doolan extends Character{
    constructor(player){
        super(player);
        this.name = "rose_doolan";
        this.HP = 4;
    }

    init(player){
        player.HP = this.HP;
        player.maxHP = this.HP;
        player.scope.rose_doolan = 1;
    }
}

class Pedro_ramirez extends Character{
    constructor(player){
        super(player);
        this.name = "pedro_ramirez";
        this.HP = 4;
    }

    action(game, player, io){

        if (game.turn == player && game.moveStage == 0 && !game.players[player].dynamit && !game.players[player].prison && game.trashedCards > 0){
            game.moveStage++;
            game.dealOneCard(player);
            game.dealAnyCard(player,0);
            game.trashedCards--;
            io.emit("log", game.players[player].name + " (" + game.players[player].character.name +  ")");
        }
    }
}
class Lucky_duke extends Character{
    constructor(player){
        super(player);
        this.name = "lucky_duke";
        this.HP = 4;
        this.event == null;
    }

    action(game, player, io){
        if (player == game.turn && game.moveStage == 0){
            if(game.players[player].dynamit){
                this.event = "dynamit";
                io.to(game.players[player].id).emit("lucky_duke", (player));
            } else if (game.players[player].prison){
                this.event = "prison";
                io.to(game.players[player].id).emit("lucky_duke", (player));
            }   
        } else if (player == game.requestedPlayer && game.requestedCard == "Vedle" && game.players[game.requestedPlayer].blueCards.length > 0 && game.barelLimit > 0){
            var barel = game.players[game.requestedPlayer].blueCards.findIndex(card => card.name == "Barel");
            if(barel >= 0){
                this.event = "barel";
                io.to(game.players[player].id).emit("lucky_duke", (player));
            }
        }
    }


}

class Kit_carlson extends Character{
    constructor(player){
        super(player);
        this.name = "kit_carlson";
        this.HP = 4;
    }

    action(game, index_sender, io) {
        if (game.turn == index_sender && game.moveStage == 0 && game.players[index_sender].prison == false && game.players[index_sender].dynamit == false) {
            //vyvola akciu, ktora u Kita zobrazi karty na vyber
            io.to(game.players[index_sender].id).emit("kit_carlson_card_draw");
            return null;
        }
    }
}

class Jesse_jones extends Character{
    constructor(player){
        super(player);
        this.name = "jesse_jones";
        this.HP = 4;
    }

    action(game, index_sender, io) {
        if (game.turn == index_sender && game.moveStage == 0 && game.players[index_sender].prison == false && game.players[index_sender].dynamit == false) {
            //vyvola akciu, ktora od hraca bude ocakavat, ze vyberie, od koho chce kartu
            io.to(game.players[index_sender].id).emit("jesse_jones_action");
            return null;
        }
    }
}

class El_gringo extends Character{
    constructor(player){
        super(player);
        this.name = "el_gringo";
        this.HP = 3;
    }

    reaction(game, target, sender){

        if (game.players[sender].cards.length > 0){
            var rand = Math.floor(Math.random(game.players[sender].cards.length - 1));
            game.players[target].cards.push(game.players[sender].cards[rand]);
            game.players[sender].cards.splice(rand, 1);
        }
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
        if (game.turn == index_sender && game.moveStage == 0 && game.players[index_sender].prison == false && game.players[index_sender].dynamit == false) {
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

    action(game, player, io){

        if (player == game.requestedPlayer) {
            if (game.requestedCard == "Vedle" && game.barelLimit > 0) {
                var last = game.cards.pop();
                if (last.suit == "heart" && game.playedCard == "Gulomet"){
                    var player_index = game.requestedPlayer;

                    player_index = (player_index + 1 == game.players.length)? 0 : player_index + 1;

                    while (!game.players[player_index].alive) {
                        player_index++;
                        if (player_index >= game.players.length) player_index = 0;
                    }
                    game.requestedPlayer = player_index;
                    
                    if(game.requestedPlayer == game.turn){
                        game.requestedPlayer = null;
                        game.playedCard = null;
                        game.requestedCard = null;
                    } 

                } else if(last.suit == "heart"){
                    if (game.players[game.turn].character.name == "slab_the_killer") {
                        game.players[game.turn].character.vedleCount++;
                        if (game.players[game.turn].character.vedleCount == 2) {
                            game.requestedPlayer = null;
                            game.playedCard = null;
                            game.requestedCard = null;
                            game.players[game.turn].character.vedleCount = 0;
                        }
                        //return;
                    } else {
                        game.requestedPlayer = null;
                        game.requestedCard = null;
                        game.playedCard = null;
                    }
                }
                
                if (game.requestedPlayer != null && game.players[game.requestedPlayer].character.name == "jourdonnais" && last.suit == "heart" && game.barelLimit == 4) game.barelLimit -= 2;
                else game.barelLimit--;
                game.cards.unshift(last);
                io.emit("log", "- " + game.players[player].character.name + " (barel) potiahnuta karta: " + last.name);
            }
        }
    }

}

class Felipe_prisonero extends Character{
    constructor(player){
        super(player);
        this.name = "felipe_prisonero";
        this.HP = 4;
    }
}

class Jose_delgado extends Character{
    constructor(player){
        super(player);
        this.name = "jose_delgado";
        this.HP = 4;
        this.useLeft = 2;
    }

}

class Pixie_pete extends Character{
    constructor(player){
        super(player);
        this.name = "pixie_pete";
        this.HP = 3;
    }

    // action(game, player, io){
    //     if(game.turn == player && game.moveStage == 0){
    //         dealOneCard(player);
    //         dealOneCard(player);
    //         dealOneCard(player);
    //         game.moveStage++;
    //     }
    // }

}
class Bill_noface extends Character{
    constructor(player){
        super(player);
        this.name = "bill_noface";
        this.HP = 4;
    }

}
class Sean_mallory extends Character{
    constructor(player){
        super(player);
        this.name = "sean_mallory";
        this.HP = 3;
    }

}
class Greg_digger extends Character{
    constructor(player){
        super(player);
        this.name = "greg_digger";
        this.HP = 4;
    }

    action(game, player, io, force){
        if(force == true){
            game.players[player].HP = game.players[player].HP + 2 > game.players[player].maxHP ? game.players[player].maxHP : game.players[player].HP + 2;
            io.emit("log", game.players[player].name + " pouzil schopnost (" + game.players[player].character.name +  ")"); 
        }
    }

}
class Vera_custer extends Character{
    constructor(player){
        super(player);
        this.realName = "vera_custer";
        this.HP = 3;
        this.reset();
    }

    reset(){
        this.name = "vera_custer";
        this.tempCharacter = null;
    }

    veraInit(game, i_vera, i_target, io){

        game.players[i_vera].character.tempCharacter = game.players[i_target].character;
        game.players[i_vera].character.name = game.players[i_target].character.name;

        if(this.name == "willy_the_kid") {
            game.players[i_vera].bangLimit = 100;
            game.players[i_vera].bangLeft = 100;
        }
        if(this.name == "paul_regret"){
            game.players[i_vera].scope.paul_regret = 1;
        }
        if(this.name == "rose_doolan"){
            game.players[i_vera].scope.rose_doolan = 1;
        }
        
    }

    action(game, player, io, force){ //force je pre grega
        if(this.tempCharacter != null)
            this.tempCharacter.action(game, player, io, force);
    }

}

module.exports = [Player, Vera_custer, Greg_digger, Sean_mallory, Bill_noface, Pixie_pete, Jose_delgado, Paul_regret, Rose_doolan, Bart_cassidy, Suzy_lafayette, Willy_the_kid, Vulture_sam, Slab_the_killer, Sid_ketchum, Pedro_ramirez, Lucky_duke, Kit_carlson, Jesse_jones, El_gringo, Calamity_janet, Jourdonnais, Black_jack, Felipe_prisonero];