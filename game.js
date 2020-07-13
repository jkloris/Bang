const [Bang, Vedle] = require("./cards.js");

class Game{
    constructor(){
        this.players = [];
        this.cards = [];
        this.turn = 0;
    }

    shuffleDeck(){
        var i;
        for(i = 0; i < 10; i++){
            var bang = new Bang();
            this.cards.push(bang);
        }
        for(i = 0; i < 30; i++){
            this.cards.push(new Vedle);
        }
        for(i in this.players){
            this.players[i].cards = [];
        }
    }


    dealCards(){
        for(var i in this.players){
            for(var e = 0; e < this.players[i].HP; e++){
                var i_card = Math.floor(Math.random()*this.cards.length);
                while(this.cards[i_card].available == false){
                    var i_card = Math.floor(Math.random()*this.cards.length);
                }
                this.players[i].cards.push(this.cards[i_card]);
                this.cards[i_card].available = false;
            }            
        }
        
    }


    nextTurn(){
        if(this.turn + 1 < this.players.length){
            this.turn++;
        }else{
            this.turn = 0;
        }
    }
}

module.exports = Game;