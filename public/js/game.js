class Game{
    constructor(){
        this.players = [];
        this.cards = [];
        this.turn = 0;
    }

    round(){
        //draw 2 cards
        //play

        
        if(this.turn + 1 < this.players.length){
            this.turn++;
        }else{
            this.turn = 0;
        }
    }
}

module.exports = Game;