const socketIO = require("socket.io");
const express = require("express");




class Card {
    constructor(){
        this.name = null;
        //this.available = true;
        this.selected = false; 
        this.onRange = false;
        // this.IMG = null;
    }
    acion(){

    }
    draw = function(x, y, ratio){
        ctx.save();
        ctx.drawImage(this.IMG, x, y, ratio, Sprites.bang.height / Sprites.bang.width * ratio); 
        if(this.selected){
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, ratio, Sprites.bang.height / Sprites.bang.width * ratio);
        }
        ctx.restore();
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
    action (game, player, card) {
        if (game.playedCard == "Indiani") {
            player = (player + 1 == game.players.length)? 0 : player + 1;

            while (!game.players[player].alive) {
                player++;
                if (player >= game.players.length) player = 0;
            }
            game.requestedPlayer = player;

            discardCard(game, player, card);

            if(game.requestedPlayer == game.turn){
                game.requestedPlayer = null;
                game.playedCard = null;
                game.requestedCard = null;
            } 
        }
    }
   
}

class Vedle extends ActionCard{
    constructor(){
        super();
        this.name = "Vedle";
    }
    action(game, player, card){
        if (game.playedCard == "Gulomet") {
            player = (player + 1 == game.players.length)? 0 : player + 1;

            while (!game.players[player].alive) {
                player++;
                if (player >= game.players.length) player = 0;
            }
            game.requestedPlayer = player;
            discardCard(game, player, card);

            if(game.requestedPlayer == game.turn){
                game.requestedPlayer = null;
                game.playedCard = null;
                game.requestedCard = null;
            } 

        }else if(game.requestedPlayer != null){
            game.requestedPlayer = null;
            discardCard(game, player, card);
        }
        
    }
    
}

class Dostavnik extends ActionCard{
    constructor(){
        super();
        this.name = "Dostavnik";
    }
    
    action(game, player, card){
        if(game.requestedPlayer == null){
            game.dealOneCard(player);
            game.dealOneCard(player);
            discardCard(game, player, card);
        }
    }
}

class Wellsfargo extends ActionCard{
    constructor(){
        super();
        this.name = "Wellsfargo";
    }
    
    action(game, player, card){
        if(game.requestedPlayer == null){
            game.dealOneCard(player);
            game.dealOneCard(player);
            game.dealOneCard(player);
            discardCard(game, player, card);
        }
    }
}

class Pivo extends ActionCard{
    constructor(){
        super();
        this.name = "Pivo";
    }

    action(game, player, card){
        if(game.requestedPlayer == null && game.players[player].HP < game.players[player].maxHP ){
            game.players[player].HP++;
            discardCard(game, player, card);
        }
    }

}

class Salon extends ActionCard{
    constructor(){
        super();
        this.name = "Salon";
    }

    action(game, player, card){
        if (game.requestedPlayer == null) {
            for(var i in game.players) {
                
                if (game.players[i].alive && game.players[i].HP < game.players[i].maxHP) {
                    game.players[i].HP++;
                }
            }
            discardCard(game, player, card);
        }
    }
    
}

class Indiani extends ActionCard{
    constructor(){
        super();
        this.name = "Indiani"
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
        }
    }
}

class Gulomet extends ActionCard{
    constructor(){
        super();
        this.name = "Gulomet"
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
            console.log(game.players[i]);
            while (!game.players[i].alive) {
                i++;
                if (i >= game.players.length) i = 0;
            }

            game.requestedCard = "Vedle";
            game.requestedPlayer = i;
            game.playedCard = "Gulomet";

            discardCard(game, player, card);
        }
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
    }
}

class Remington extends Gun{
    constructor(){
        super();
        this.name = "Remington";
    }

    action(game, player, card){ 
        this.checkGuns(game, player);
        this.use(game, player, card);
        game.players[player].scope.gun = 2;
    }
}

class Carabine extends Gun{
    constructor(){
        super();
        this.name = "Carabine";
    }

    action(game, player, card){
        this.checkGuns(game, player);
        this.use(game, player, card);
        game.players[player].scope.gun = 3;
    }
}

class Winchester extends Gun{
    constructor(){
        super();
        this.name = "Winchester";
    }

    action(game, player, card){
        this.checkGuns(game, player);
        this.use(game, player, card);
        game.players[player].scope.gun = 4;
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
        //game.players[player].bangLimit = 100 TODO
    }
}

class Mustang extends BlueCard{
    constructor(){
        super();
        this.name = "Mustang";
    }
    
    action(game, player, card){
        if(this.checkMustang(game, player)){
            this.use(game, player, card); 
            game.players[player].scope.mustang = 1;
        }
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
    }
    
    action(game, player, card){
        if(this.checkAppaloosa(game, player)){
            this.use(game, player, card); 
            game.players[player].scope.appaloosa = 1;
        }
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

    action(game, sender, target, card, arg){
        discardCard(game, sender, card);
        if(arg != null){
            discardBlueCard(game, target, arg);
        }
        else{
            var rand = Math.floor(Math.random()*game.players[target].cards.length);
            discardCard(game, target, rand);
        }
    }
}

class Panika extends ActionCard{
    constructor(){
        super();
        this.name = "Panika"
        this.onRange = true;
    }

    action(game, sender, target, card, arg){
        discardCard(game, sender, card);
        if(arg != null){
            game.players[sender].cards.push(game.players[target].blueCards[arg]);
            discardBlueCard(game, target, arg);
        }
        else{
            var rand = Math.floor(Math.random()*game.players[target].cards.length);
            game.players[sender].cards.push(game.players[target].cards[rand]);
            discardCard(game, target, rand);
        }
    }
}

function discardCard(game, player_i, card_i) {
    game.cards.unshift(game.players[player_i].cards[card_i]);    
    game.trashedCards++;
    game.players[player_i].cards.splice(card_i,1);
}

function discardBlueCard(game, player_i, card_i) {
    game.cards.unshift(game.players[player_i].blueCards[card_i]);    
    game.trashedCards++;

    if (game.players[player_i].blueCards.gun == true) 
        game.players[player_i].scope.gun = 0;
    else if(game.players[player_i].blueCards[card_i].name == "Appaloosa"){
        game.players[player_i].scope.appaloosa = 0;
    }
    else if(game.players[player_i].blueCards[card_i].name == "Mustang"){
        game.players[player_i].scope.mustang = 0;
    }

    game.players[player_i].blueCards.splice(card_i,1);
}

module.exports = [Bang, Vedle, Dostavnik, Wellsfargo, Pivo, Salon, Indiani, Schofield, Remington, Carabine, Winchester, Volcanic, Appaloosa, Mustang, Catbalou, Panika, Gulomet];