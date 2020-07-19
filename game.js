const [Bang, Vedle, Dostavnik, Wellsfargo, Pivo, Salon] = require("./cards.js");
const fs = require("fs");

class Game{
    constructor(){
        this.players = [];
        this.cards = [];
        this.turn = 0;
        this.requestedPlayer = null; //hrac od ktoreho sa caka reakcia
        this.requestedCard = null; //pozadovana karta (vedle pri bangovani)
        this.trashedCards = 0;
        this.moveStage = 0; //urcuje povolene akcie hraca pocas tahu (0 - tahanie kariet/dynamit,.., 1 - priebeh tahu,.. mozno 2 na ukoncenie tahu)
    }

    //naplni deck nejakymi kartami
    shuffleDeck() {
        var i;
        this.cards = [];
        this.trashedCards = 0;

        for(i in this.players){
            this.players[i].cards = [];
        }

        const deasync = require('deasync');       

        var raw_data = null;
        //precita subor a vytvori USPORIADANE pole kariet
        fs.readFile('./deck.txt', 'utf8', (err, data) => {
            if (err) throw err;
            raw_data = data;
        });
        
        while (raw_data == null) deasync.runLoopOnce(); //wait na callback funkciu kym skonci
        
        //nacita karty do game.cards, cize do hlavneho balicka
        var card_from_file = "";
        for (i in raw_data) {
            if (raw_data[i] === "\n" || i >= raw_data.length - 1) {
                //zapocitanie posledneho pismena
                if (i >= raw_data.length - 1) card_from_file = card_from_file + raw_data[i];

                switch (card_from_file) {
                    case "BANG": this.cards.push(new Bang()); break;
                    case "VEDLE": this.cards.push(new Vedle()); break;
                    case "DOSTAVNIK": this.cards.push(new Dostavnik()); break;
                    case "WELLSFARGO": this.cards.push(new Wellsfargo()); break;
                    case "PIVO": this.cards.push(new Pivo()); break;
                    case "SALON": this.cards.push(new Salon()); break;
                    default: break;
                };

                card_from_file = "";
            } else {
                card_from_file = card_from_file + raw_data[i];
            }
        }
        
        //randomize game.cards
        shuffle(this.cards);
    }


    dealCards(){
        for(var i in this.players){
            for(var e = 0; e < this.players[i].HP; e++){                
                //moj kod.... je dobry dufam
                var drawn_card = this.cards.pop();
                this.players[i].cards.push(drawn_card);
            }            
        }
        
    }

    dealOneCard(player_i){
        var drawn_card = this.cards.pop();
        this.players[player_i].cards.push(drawn_card);
    }


    nextTurn(index_sender) {
        //kontrola, ci moze ukoncit kolo
        if (this.players[index_sender].cards.length > this.players[index_sender].HP) {
            return 0;
        }
        else {
            if (this.turn + 1 < this.players.length) {
                this.turn++;
            } else {
                this.turn = 0;
            }

            //preskoci hracov, ktori su mrtvi
            while(this.players[this.turn].HP == 0) {
                this.turn++;
                if (this.turn >= this.players.length) this.turn = 0;
            }

            this.moveStage = 0;
            return 1;
        }
    }
}

module.exports = Game;

//shamelessly stolen from the internet
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }