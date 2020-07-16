const [Bang, Vedle] = require("./cards.js");
const fs = require("fs");

class Game{
    constructor(){
        this.players = [];
        this.cards = [];
        this.turn = 0;
        this.requestedPlayer = null; //hrac od ktoreho sa caka reakcia
        this.requestedCard = null; //pozadovana karta (vedle pri bangovani)
        this.trashedCard = null;
    }

    //naplni deck nejakymi kartami
    shuffleDeck() {
        var i;
        // for(i = 0; i < 30; i++){
        //     var bang = new Bang();
        //     this.cards.push(bang);
        // }
        // for(i = 0; i < 40; i++){
        //     this.cards.push(new Vedle);
        // }
        for(i in this.players){
            this.players[i].cards = [];
        }



        //precita subor a vytvori USPORIADANE pole kariet
        fs.readFile('./deck.txt', 'utf8', (err, raw_data) => {
            if (err) throw err;
            //raw_data obsahuje komplet subor

            var card_from_file = "";
            for (i in raw_data) {
                if (raw_data[i] === "\n" || i >= raw_data.length - 1) {
                    //zapocitanie posledneho pismena
                    if (i >= raw_data.length - 1) card_from_file = card_from_file + raw_data[i];

                    switch (card_from_file) {
                        case "BANG": der_tester.push(new Bang()); break;
                        case "VEDLE": der_tester.push(new Vedle()); break;
                        default: break;
                    };

                    card_from_file = "";
                } else {
                    card_from_file = card_from_file + raw_data[i];
                }
            }
        });
    }


    dealCards(){
        for(var i in this.players){
            for(var e = 0; e < this.players[i].HP; e++){
                //jerglov kod ...zatial nechame a ked bude miesanie, tak ho odstranime 
                // var i_card = Math.floor(Math.random()*this.cards.length);

                // while(this.cards[i_card].available == false){
                //     var i_card = Math.floor(Math.random()*this.cards.length);
                // }
                
                // this.players[i].cards.push(this.cards[i_card]);
                // this.cards[i_card].available = false;
                
                //moj kod.... je zly lebo nehadze nahodne
                var drawn_card = this.cards.pop();
                this.players[i].cards.push(drawn_card);
            }            
        }
        
    }


    nextTurn(index_sender) {
        //kontrola, ci moze ukoncit kolo
        if (this.players[index_sender].cards.length > this.players[index_sender].HP) {
            return 0;
        }
        else {
            if(this.turn + 1 < this.players.length){
                this.turn++;
            } else{
                this.turn = 0;
            }
            return 1;
        }
    }
}

module.exports = Game;