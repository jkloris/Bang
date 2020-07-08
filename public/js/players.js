class Player{
    constructor(id, maxHP, character, ability){
        this.id = id;
        this.maxHP = maxHP;
        this.character = character; //TODO
        this.ability = ability; //TODO
        this.cards = []; //karty tohto hraca
    }
}

module.exports = Player;