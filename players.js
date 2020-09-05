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

// class Character{
//     constructor(player){
//         this.IMG = null;
//         this.player = player;
//     }
// }

// class Paul_regret extends Character{
//     constructor(player){
//         super(player);
//         this.name = "Paul Regret"
//     }
// }


module.exports = Player;