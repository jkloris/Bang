class Player{
    constructor(id, maxHP, character, ability){
        this.id = id;
        
        //docasne kvoli dev
        // this.HP = 1;
        this.HP = maxHP; //inak to je takto

        this.alive = true;
        this.maxHP = maxHP;
        this.character = character; //TODO
        this.ability = ability; //TODO
        this.cards = []; //karty tohto hraca
        this.blueCards = [];
        this.name;
    }
}

module.exports = Player;