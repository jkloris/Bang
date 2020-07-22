class Player{
    constructor(id, maxHP, character, ability){
        this.id = id;
        this.HP = maxHP;
        this.maxHP = maxHP;
        this.character = character; //TODO
        this.ability = ability; //TODO
        this.cards = []; //karty tohto hraca
        this.blueCards = [];
        this.name;
    }
}

module.exports = Player;