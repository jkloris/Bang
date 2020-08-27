class Player{
    constructor(id, maxHP, character, ability){
        this.id = id;
        
        //docasne kvoli dev
        this.HP = 3;
        // this.HP = maxHP; //inak to je takto

        this.alive = true;
        this.maxHP = maxHP;
        this.character = character; //TODO
        this.ability = ability; //TODO
        this.cards = []; //karty tohto hraca
        this.blueCards = [];
        this.name;
        this.scope = {gun : 0, mustang : 0, appaloosa : 0};
        this.prison = false;
    }
}

module.exports = Player;