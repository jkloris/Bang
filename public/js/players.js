class Player{
    constructor(id,maxHP, postava, schopnost, poradie){
        this.id = id;
        this.maxHP = maxHP;
        this.postava = postava;
        this.schopnost = schopnost;
        this.karty = [];
        this.poradie = poradie;
    }
}

module.exports = Player;