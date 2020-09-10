const [Bang, Vedle, Dostavnik, Wellsfargo, Pivo, Salon, Indiani, Schofield, Remington, Carabine, Winchester, Volcanic, Appaloosa, Mustang, Catbalou, Panika, Gulomet, Hokynarstvo, Barel, Vazenie, Dynamit, Duel] = require("./cards.js");
const fs = require("fs");

class Game{
    constructor(){
        this.players = [];
        this.cards = [];
        this.turn = 0;
        this.requestedPlayer = null; //hrac od ktoreho sa caka reakcia
        this.requestedCard = null; //pozadovana karta (vedle pri bangovani)
        this.duelistPlayer = null;
        this.trashedCards = 0;
        this.moveStage = 0; //urcuje povolene akcie hraca pocas tahu (0 - tahanie kariet/dynamit,.., 1 - priebeh tahu,.. mozno 2 na ukoncenie tahu)
        this.playedCard = null;
        this.started = false;
        this.deadPlayers = 0;
        this.dynamit = false;
        this.characters = ["paul_regret", "bart_cassidy", "suzy_lafayette", "willy_the_kid" , "vulture_sam", "slab_the_killer", "sid_ketchum", "rose_doolan" , "pedro_ramirez", "lucky_duke", "kit_carlson", "jesse_jones", "el_gringo", "calamity_janet", "black_jack","jourdonnais", "felipe_prisonero"];
        // this.characters = ["kit_carlson", "jesse_jones", "el_gringo", "calamity_janet", "black_jack","felipe_prisonero" ,"jourdonnais" ];
    }

    dealCharacters(){
        for(var i in this.players){
            var rand_i = Math.floor(Math.random() * (this.characters.length));
            this.players[i].characters = this.characters[rand_i];
            this.characters.splice(rand_i, 1);
        }
    }


    dealRoles(){
        //nahodne poradie hracov bez ohladu na poradie prihlasenia sa
        shuffle(this.players);
        switch (this.players.length) {
            case 2:
                [new Sheriff(this.players[0]), new Bandita(this.players[1])]
                break;
            case 3:
                [new Sheriff(this.players[0]), new Bandita(this.players[1]), new Odpadlik(this.players[2])];
                break;
            case 4:
                [new Sheriff(this.players[0]), new Bandita(this.players[1]), new Odpadlik(this.players[2]), new Bandita(this.players[3])];
                break;
            case 5:
                [new Sheriff(this.players[0]), new Bandita(this.players[1]), new Odpadlik(this.players[2]), new Bandita(this.players[3]), new Vice(this.players[4])];
                break;
            case 6:
                [new Sheriff(this.players[0]), new Bandita(this.players[1]), new Odpadlik(this.players[2]), new Bandita(this.players[3]), new Bandita(this.players[4]), new Vice(this.players[5])];
                break;
            case 7:
                [new Sheriff(this.players[0]), new Bandita(this.players[1]), new Odpadlik(this.players[2]), new Bandita(this.players[3]), new Bandita(this.players[4]), new Vice(this.players[5]), new Vice(this.players[6])];
                break;
        
            default:
                break;
        }
        //nahodne poradie postav
        shuffle(this.players);
        //prehodenie sheriffa na prve miesto
        var sheriff_i = this.players.findIndex(player => (player.role == "Sheriff"));
        var temp = this.players[0];
        this.players[0] = this.players[sheriff_i];
        this.players[sheriff_i] = temp;

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
                    case "INDIANI": this.cards.push(new Indiani()); break;
                    case "SCHOFIELD": this.cards.push(new Schofield()); break;
                    case "VOLCANIC": this.cards.push(new Volcanic()); break;
                    case "REMINGTON": this.cards.push(new Remington()); break;
                    case "CARABINE": this.cards.push(new Carabine()); break;
                    case "WINCHESTER": this.cards.push(new Winchester()); break;
                    case "MUSTANG": this.cards.push(new Mustang()); break;
                    case "APPALOOSA": this.cards.push(new Appaloosa()); break;
                    case "CATBALOU": this.cards.push(new Catbalou()); break;
                    case "PANIKA": this.cards.push(new Panika()); break;
                    case "GULOMET": this.cards.push(new Gulomet()); break;
                    case "HOKYNARSTVO": this.cards.push(new Hokynarstvo()); break;
                    case "BAREL": this.cards.push(new Barel()); break;
                    case "VAZENIE": this.cards.push(new Vazenie()); break;
                    case "DYNAMIT": this.cards.push(new Dynamit()); break;
                    case "DUEL": this.cards.push(new Duel()); break;
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
    
    dealAnyCard(player, card){
        if(this.players[player].alive){
            this.players[player].cards.push(this.cards[card]);
            this.cards.splice(card, 1);
        }
    }

    getDistance(sender_i, target_i, card){

        var turn = sender_i;
        var distance = 0;
        while(turn != target_i){
            turn++;
            if(turn >= this.players.length)
                turn = 0;
            if(this.players[turn].alive) distance++;
        }

        var turn = sender_i;
        var distance2 = 0;
        while(turn != target_i){
            turn--;
            if(turn < 0)
                turn = this.players.length - 1;
            if(this.players[turn].alive) distance2++;
        }
        if(distance2 < distance) distance = distance2;
        
        if (this.players[sender_i].cards[card].name == "Bang") {
            distance = distance - this.players[sender_i].scope.gun - this.players[sender_i].scope.appaloosa + this.players[target_i].scope.mustang;
        } else if (this.players[sender_i].cards[card].name == "Panika") {
            distance = distance - this.players[sender_i].scope.appaloosa + this.players[target_i].scope.mustang;
        }

        return distance;
    }


    nextTurn(index_sender, force) {
        //kontrola, ci moze ukoncit kolo
        if (this.players[index_sender].cards.length > this.players[index_sender].HP && force != true) {
            return 0;
        }
        else {

            if (this.turn + 1 < this.players.length) {
                this.turn++;
            } else {
                this.turn = 0;
            }

            //preskoci hracov, ktori su mrtvi
            while(!this.players[this.turn].alive) {
                this.turn++;
                if (this.turn >= this.players.length) this.turn = 0;
            }


            this.moveStage = 0;
            return 1;
        }
    }

    //checks for game over
    gameOver() {
        var sheriff_i = this.players.findIndex(player => (player.role == "Sheriff"));
        var odpadlik_i = this.players.findIndex(player => (player.role == "Odpadlik")); //vrati -1, ak nenajde odpadlika

        //kontrola vyhry odpadlika:
        let odpadlik_win = true;
        if (odpadlik_i != -1) { //ak je odpadlik v hre
            for (var i in this.players) {
                if (i == odpadlik_i) continue;
                if (this.players[i].alive) {odpadlik_win = false; break;}
            }
            if (odpadlik_win) return {result: true, winner: "der Odpadlik"};
        }

        //kontrola vyhry banditov:
        //ak nevyhral odpadlik a je mrtvy serif, znamena to, ze vyhrali banditi
        if (!this.players[sheriff_i].alive) return {result: true, winner: "banditas"};


        //kontrola vyhry serifa
        let sheriff_win = true;
        for (var i in this.players) {
            if (this.players[i].role == "Bandita" && this.players[i].alive) sheriff_win = false;
        }
        //ak aj su mrtvi banditi a este zije odpadlik, tak serif stale nevyhral:
        if (odpadlik_i != -1 && this.players[odpadlik_i].alive) sheriff_win = false;
        if (sheriff_win) return {result: true, winner: "Die Polizeiten"};
        
        
        //ak zatial nie je vitaz:
        return {result: false, winner: null};
    }
}



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


class Role{
    constructor(player){
        this.player = player;
        this.player.role = null;
    }
}
class Sheriff extends Role{
    constructor(player){
        super(player);
        this.player.role = "Sheriff";
        this.player.maxHP++;
        this.player.HP = this.player.maxHP;
    }
    
}
class Vice extends Role{
    constructor(player){
        super(player);
        this.player.role = "Vice";
    }
}
class Odpadlik extends Role{
    constructor(player){
        super(player);
        this.player.role = "Odpadlik";
    }
}
class Bandita extends Role{
    constructor(player){
        super(player);
        this.player.role = "Bandita";
    }

}


module.exports = Game;