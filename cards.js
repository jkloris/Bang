const socketIO = require("socket.io");
const express = require("express");




class Card {
    constructor(){
        this.name = null;
        //this.available = true;
        this.selected = false; 
        this.onRange = false;
        this.suit = null;
        this.rank = null;
    }
}

class BlueCard extends Card{
    constructor(){
        super();
    }
    action (game, player, card){
        this.use(game, player, card);
    }

    use(game, player, card){
        game.players[player].blueCards.push(game.players[player].cards[card]);
        game.players[player].cards.splice(card, 1);

        if(game.players[player].character.name == "suzy_lafayette"){
            game.players[player].character.action(player, game);
        }
    }
}

class ActionCard extends Card{ //toto bolo fakt zbytocne
    constructor(){
        super();
    }
    postAction(){
        //vyhod kartu
    }
}

class Bang extends ActionCard{
    constructor(){
        super();
        this.name = "Bang";
        this.onRange = true;
    }
    action (game, player, card, io) {
        if (game.playedCard == "Indiani") {
            discardCard(game, player, card);

            player = (player + 1 == game.players.length)? 0 : player + 1;

            while (!game.players[player].alive) {
                player++;
                if (player >= game.players.length) player = 0;
            }
            game.requestedPlayer = player;


            if(game.requestedPlayer == game.turn){
                game.requestedPlayer = null;
                game.playedCard = null;
                game.requestedCard = null;
                io.to(game.players[game.turn].id).emit("turnResumeSound");

            } 
            return true;
        }
        else if (game.playedCard == "Duel") {
            discardCard(game, player, card);
            if (game.requestedPlayer == game.duelistPlayer) game.requestedPlayer = game.turn;
            else game.requestedPlayer = game.duelistPlayer;

            return true;
        }
        return false;
    }
   
}

class Vedle extends ActionCard{
    constructor(){
        super();
        this.name = "Vedle";
    }
    action(game, player, card, io){
        if (game.playedCard == "Gulomet") {
            discardCard(game, player, card);
            player = (player + 1 == game.players.length)? 0 : player + 1;

            while (!game.players[player].alive) {
                player++;
                if (player >= game.players.length) player = 0;
            }
            game.requestedPlayer = player;

            if(game.requestedPlayer == game.turn){
                game.requestedPlayer = null;
                game.playedCard = null;
                game.requestedCard = null;
                io.to(game.players[game.turn].id).emit("turnResumeSound");

                return true;
            } 

        }else if(game.requestedPlayer != null) {
            discardCard(game, player, card);

            if (game.players[game.turn].character.name == "slab_the_killer") {
                game.players[game.turn].character.vedleCount++;
                if (game.players[game.turn].character.vedleCount == 2) {
                    game.requestedPlayer = null;
                    game.playedCard = null;
                    game.requestedCard = null;
                    game.players[game.turn].character.vedleCount = 0;
                    io.to(game.players[game.turn].id).emit("turnResumeSound");
                    
                }
                return true;
            }

            game.requestedPlayer = null;
            game.playedCard = null;
            game.requestedCard = null;
            io.to(game.players[game.turn].id).emit("turnResumeSound");

            return true;
        }
        
        return false;
    }
    
}

class Dostavnik extends ActionCard{
    constructor(){
        super();
        this.name = "Dostavnik";
        this.suit = "spades";
        this.rank = "9";
    }
    
    action(game, player, card){
        if(game.requestedPlayer == null){
            game.dealOneCard(player);
            game.dealOneCard(player);
            discardCard(game, player, card);

            return true;
        }
        return false;
    }
}

class Wellsfargo extends ActionCard{
    constructor(){
        super();
        this.name = "Wellsfargo";
        this.suit = "heart";
        this.rank = "3";
    }
    
    action(game, player, card){
        if(game.requestedPlayer == null){
            game.dealOneCard(player);
            game.dealOneCard(player);
            game.dealOneCard(player);
            discardCard(game, player, card);

            return true;
        }
        return false;
    }
}

class Pivo extends ActionCard{
    constructor(){
        super();
        this.name = "Pivo";
        this.suit = "heart";

    }

    action(game, player_index, card, io){
        var boo = false;
        if(game.players[player_index].HP < game.players[player_index].maxHP ){
            game.players[player_index].HP++;
            discardCard(game, player_index, card);

            io.to(game.players[player_index].id).emit("pivoSound");
            boo = true;
        }

        //ak to bolo zachranne pivo, 
        if (game.safeBeer) {
            game.safeBeer = false;
            if (game.requestedPlayer != null){
                console.log("Kontrola posuvania hracov, kto ide dalsi..");
                if (game.playedCard == "Gulomet" || game.playedCard == "Indiani") {
    
                    player_index = (player_index + 1 == game.players.length)? 0 : player_index + 1;
    
                    while (!game.players[player_index].alive) {
                        player_index++;
                        if (player_index >= game.players.length) player_index = 0;
                    }
                    game.requestedPlayer = player_index;
        
                    if(game.requestedPlayer == game.turn){
                        game.requestedPlayer = null;
                        game.playedCard = null;
                        game.requestedCard = null;
                    } 
                
                    game.barelLimitCheck(game.requestedPlayer);
        
                } else {
                    game.requestedPlayer = null;  
                    game.playedCard = null;
                    game.requestedCard = null;      
    
                    if (game.players[game.turn].character.name == "slab_the_killer"){ 
                        game.players[game.turn].character.vedleCount = 0;
                    }        
                }
            }
            return true;
        }
        return boo;
    }

}

class Salon extends ActionCard{
    constructor(){
        super();
        this.name = "Salon";
        this.suit = "heart";
        this.rank = 5;
        
    }

    action(game, player, card, io){
        if (game.requestedPlayer == null) {
            for(var i in game.players) {
                
                if (game.players[i].alive && game.players[i].HP < game.players[i].maxHP) {
                    game.players[i].HP++;
                }
            }
            io.emit("salonSound");
            discardCard(game, player, card);
            return true;
        }
        return false;
    }
    
}

class Indiani extends ActionCard{
    constructor(){
        super();
        this.name = "Indiani"
        this.suit = "diamonds";
    }
    
    action(game, player, card){
        if (game.requestedPlayer == null) {
            var i;
            if (player + 1 == game.players.length) {
                i = 0;
            } else {
                i = player + 1;
            }

            //preskoci hracov, ktori su mrtvi
            while (!game.players[i].alive) {
                i++;
                if (i >= game.players.length) i = 0;
            }

            game.requestedCard = "Bang";
            game.requestedPlayer = i;
            game.playedCard = "Indiani";

            discardCard(game, player, card);
            return true;
        }
        return false;
    }
}

class Gulomet extends ActionCard{
    constructor(){
        super();
        this.name = "Gulomet"
        this.suit = "heart";
        this.rank = "10";
    }
    
    action(game, player, card){
        if (game.requestedPlayer == null) {
            
            var i;
            if (player + 1 == game.players.length) {
                i = 0;
            } else {
                i = player + 1;
            }

            //preskoci hracov, ktori su mrtvi
            while (!game.players[i].alive) {
                i++;
                if (i >= game.players.length) i = 0;
            }

            game.requestedCard = "Vedle";
            game.requestedPlayer = i;
            game.playedCard = "Gulomet";
            
            game.barelLimitCheck(game.requestedPlayer);

            discardCard(game, player, card);
            return true;
        }
        return false;
    }
}



class Gun extends BlueCard{
    constructor(){
        super();
        this.gun = true;
    }

    checkGuns(game, player){
        for(var i in game.players[player].blueCards){
            if(game.players[player].blueCards[i].gun == true){
                discardBlueCard(game, player, i);
            }
        }
    }
}


class Schofield extends Gun{
    constructor(){
        super();
        this.name = "Schofield";
    }

    action(game, player, card){ 
        this.checkGuns(game, player);
        this.use(game, player, card);
        game.players[player].scope.gun = 1;
        return true;
    }
}

class Remington extends Gun{
    constructor(){
        super();
        this.name = "Remington";
        this.suit = "clubs";
        this.rank = 'K'
    }

    action(game, player, card){ 
        this.checkGuns(game, player);
        this.use(game, player, card);
        game.players[player].scope.gun = 2;
        return true;
    }
}

class Carabine extends Gun{
    constructor(){
        super();
        this.name = "Carabine";
        this.suit = "clubs";
        this.rank = "A";
    }

    action(game, player, card){
        this.checkGuns(game, player);
        this.use(game, player, card);
        game.players[player].scope.gun = 3;
        return true;
    }
}

class Winchester extends Gun{
    constructor(){
        super();
        this.name = "Winchester";
        this.suit = "spades";
        this.rank = "8";
    }

    action(game, player, card){
        this.checkGuns(game, player);
        this.use(game, player, card);
        game.players[player].scope.gun = 4;
        return true;
    }
}

class Volcanic extends Gun{
    constructor(){
        super();
        this.name = "Volcanic";
    }
    
    action(game, player, card){
        this.checkGuns(game, player);
        this.use(game, player, card);
        game.players[player].scope.gun = 0;
        game.players[player].bangLimit = 100;
        game.players[player].bangLeft = 100;
        return true;
    }
}

class Mustang extends BlueCard{
    constructor(){
        super();
        this.name = "Mustang";
        this.suit = "heart";
    }
    
    action(game, player, card){
        if(this.checkMustang(game, player)){
            this.use(game, player, card); 
            game.players[player].scope.mustang = 1;
            return true;
        }
        return false;
    }
    
    checkMustang(game, player){
        for(var i in game.players[player].blueCards){
            if (game.players[player].blueCards[i].name == "Mustang"){
                return false;
            }
        }
        return true;
    }
}

class Appaloosa extends BlueCard{
    constructor(){
        super();
        this.name = "Appaloosa";
        this.suit = "spades";
        this.rank = "A";
    }
    
    action(game, player, card){
        if(this.checkAppaloosa(game, player)){
            this.use(game, player, card); 
            game.players[player].scope.appaloosa = 1;
            return true;
        }
        return false;
    }
    
    checkAppaloosa(game, player){
        for(var i in game.players[player].blueCards){
            if (game.players[player].blueCards[i].name == "Appaloosa")
                return false;
        }
        return true;
    }
}

class Catbalou extends ActionCard{
    constructor(){
        super();
        this.name = "Catbalou"
    }

    action(game, sender, target, card, clickedBlue_index){
        discardCard(game, sender, card);
        var trashed_card_name;
        if(clickedBlue_index != null){
            trashed_card_name = game.players[target].blueCards[clickedBlue_index].name;
            discardBlueCard(game, target, clickedBlue_index);
        }
        else{
            var rand = Math.floor(Math.random()*game.players[target].cards.length);
            trashed_card_name = game.players[target].cards[rand].name;
            discardCard(game, target, rand);
        }
        return trashed_card_name;
    }
}

class Panika extends ActionCard{
    constructor(){
        super();
        this.name = "Panika"
        this.onRange = true;
    }

    //card je ta panika, ktoru zahral niekto
    action(game, sender, target, card, clickedBlue_index) {
        discardCard(game, sender, card); //hodi paniku do kopky zahodenych
        var stolen_card_name;
        game.playedCard = "Panika";
        if(clickedBlue_index != null){
            stolen_card_name = game.players[target].blueCards[clickedBlue_index].name;
            game.players[sender].cards.push(game.players[target].blueCards[clickedBlue_index]);
            discardBlueCard(game, target, clickedBlue_index);
        }
        else{
            var rand = Math.floor(Math.random()*game.players[target].cards.length);
            stolen_card_name = game.players[target].cards[rand].name;
            game.players[sender].cards.push(game.players[target].cards[rand]);
            discardCard(game, target, rand);
        }
        game.playedCard = null;
        return stolen_card_name;
    }
}

class Hokynarstvo extends ActionCard{
    constructor(){
        super();
        this.name = "Hokynarstvo";
    
    }

    action(game, player, card){
        game.playedCard = "Hokynarstvo";
        game.requestedPlayer = player;

        discardCard(game, player, card);
        return true;
    }
}


class Barel extends BlueCard{
    constructor(){
        super();
        this.name = "Barel";
    }

    action(game, player, card){
        if(this.checkBarel(game, player)){
            this.use(game, player, card); 
            return true;
        }
        return false;
    }

    checkBarel(game, player){
        for(var i in game.players[player].blueCards){
            if (game.players[player].blueCards[i].name == "Barel"){
                return false;
            }
        }
        return true;
    }
}

class Vazenie extends BlueCard{
    constructor(){
        super();
        this.name = "Vazenie";
        
    }
    
    action(game, sender, target, card){
        game.playedCard = "Vazenie";
        if(game.players[target].prison == false && game.players[target].role != "Sheriff"){
            var prison = game.players[sender].cards[card];
            game.players[target].blueCards.push(prison);
            game.players[target].prison = true;
            
            discardCard(game, sender, card);
        }
        game.playedCard = null;
    }
}

class Dynamit extends BlueCard{
    constructor(){
        super();
        this.name = "Dynamit";
        
    }
    
    action(game, player, card){
        if(!game.dynamit){
            game.dynamit = true;
            game.players[player].dynamit = true;
            this.use(game, player, card); 
            return true;
        }
        return false;
    }
}

class Duel extends ActionCard{
    constructor(){
        super();
        this.name = "Duel";
        this.onRange = false;
    }
    action (game, player, card) {
        
    }
   
}

function discardCard(game, player_i, card_i) {
    if (game.playedCard != "Panika" && game.playedCard != "Vazenie") {
        game.cards.unshift(game.players[player_i].cards[card_i]);    
        game.trashedCards++;
    }
    game.players[player_i].cards.splice(card_i,1);

    if(game.players[player_i].character.name == "suzy_lafayette"){
        game.players[player_i].character.action(player_i, game);
    }
}

function discardBlueCard(game, player_i, card_i) {
    if (game.playedCard != "Panika") {
        game.cards.unshift(game.players[player_i].blueCards[card_i]);    
        game.trashedCards++;
    }

    if (game.players[player_i].blueCards.gun == true) 
        game.players[player_i].scope.gun = 0;
    else if(game.players[player_i].blueCards[card_i].name == "Appaloosa"){
        game.players[player_i].scope.appaloosa = 0;
    }
    else if(game.players[player_i].blueCards[card_i].name == "Mustang"){
        game.players[player_i].scope.mustang = 0;
    } else if(game.players[player_i].blueCards[card_i].name == "Vazenie"){
        game.players[player_i].prison = false;
    } else if (game.players[player_i].blueCards[card_i].name == "Dynamit"){
        game.dynamit = false;
        game.players.forEach((player)=>{
            player.dynamit = false;
        })
    } else if (game.players[player_i].blueCards[card_i].name == "Volcanic"){
        game.players[player_i].bangLimit = 1;
        game.players[player_i].bangLeft = 1;
    }

    game.players[player_i].blueCards.splice(card_i,1);
}

module.exports = [Bang, Vedle, Dostavnik, Wellsfargo, Pivo, Salon, Indiani, Schofield, Remington, Carabine, Winchester, Volcanic, Appaloosa, Mustang, Catbalou, Panika, Gulomet, Hokynarstvo, Barel, Vazenie, Dynamit, Duel];