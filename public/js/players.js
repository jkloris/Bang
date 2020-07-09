class Player{
    constructor(id, maxHP, character, ability){
        this.id = id;
        this.HP = maxHP;
        this.character = character; //TODO
        this.ability = ability; //TODO
        this.cards = []; //karty tohto hraca
        this.name;
    }
}

module.exports = Player;