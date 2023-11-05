const [
	Player,
	Vera_custer,
	Greg_digger,
	Sean_mallory,
	Bill_noface,
	Pixie_pete,
	Jose_delgado,
	Paul_regret,
	Rose_doolan,
	Bart_cassidy,
	Suzy_lafayette,
	Willy_the_kid,
	Vulture_sam,
	Slab_the_killer,
	Sid_ketchum,
	Pedro_ramirez,
	Lucky_duke,
	Kit_carlson,
	Jesse_jones,
	El_gringo,
	Calamity_janet,
	Jourdonnais,
	Black_jack,
	Felipe_prisonero,
] = require('./players.js');

const [Logger] = require('./logger.js');
const DynamitHandler = require('./dymamit_handler.js');
const Game = require('./game.js');

class ServerController {
	constructor(io) {
		this.game = new Game();
		this.names = {};
		this.io = io;
		Logger.setIo(io);
	}

	playerDisconnect(id) {
		var index = this.game.players.findIndex((user) => user.id === id);

		if (this.game.started && index != -1) {
			console.log(this.game.players[index].name + ' disconnected');
			Logger.emit(this.game.players[index].name + ' sa odpojil.');
			this.game.players[index].alive = false;
			this.game.players[index].HP = -1;
			this.game.deadPlayers++;
			if (this.game.players[index].dynamit) this.game.dynamit = false;
			if (this.game.turn == index) this.game.nextTurn(index, true);

			let result = this.game.gameOver();
			console.log('checking for game over... with result: ' + result.result);
			if (result.result) {
				this.io.emit('winner', result.winner);
				this.game.started = false;
				this.game.update(this.io);
			}

			//karty odpojeneho hraca sa zahodia do kopky
			while (this.game.players[index].cards.length > 0) {
				var card = this.game.players[index].cards.pop();
				this.game.cards.unshift(card);
				this.game.trashedCards++;
			}
			while (this.game.players[index].blueCards.length > 0) {
				var card = this.game.players[index].blueCards.pop();
				this.game.cards.unshift(card);
				this.game.trashedCards++;
			}
		} else if (index != -1) {
			//ak sa odpaja hrac, ked este nebola zacata hra
			this.game.players.splice(index, 1);
			console.log(id, 'disconnected');
		}
	}

	playerConnected(id) {
		if (!this.game.started) this.game.players.push(new Player(id, 1, null, null, null));
	}

	clicked(socket, mouse, id) {
		if (this.game.requestedPlayer == null && this.game.players[this.game.turn].id == id) {
			socket.emit('clickAccept', mouse);
		}
		if (this.game.requestedPlayer != null && this.game.players[this.game.requestedPlayer].id == id) {
			if (this.game.playedCard == 'Hokynarstvo') {
				socket.emit('emporio_clickAccept', mouse);
			} else {
				socket.emit('partial_clickAccept', mouse);
			}
		}
		socket.emit('logClick', mouse);
	}

	nextTurn(socket, id) {
		if (this.game.moveStage == 0) {
			return;
		}

		var sender_i = this.game.players.findIndex((user) => user.id === socket.id);

		if (this.game.nextTurn(sender_i)) {
			this.io.to(this.game.players[this.game.turn].id).emit('onTurnSound');
			Logger.emit(` ---------- na tahu je: ${this.game.players[this.game.turn].name} ---------- `);
			this.game.update(this.io);
		} else this.io.to(id).emit('discardRequest');
	}

	async startGame() {
		if (this.game.players.length <= 1) return; //crashuje to, ak pustime hru s iba 1 hracom
		this.game.started = true;
		this.game.dealCharacters();
		this.game.dealRoles();
		await this.game.shuffleDeck();
		while (!this.game.cards) {
			console.log('....');
		}
		this.game.dealCards();
		Logger.emit(` ---------- na tahu je: ${this.game.players[this.game.turn].name} ---------- `);
		this.game.update(this.io);
	}

	hokynarstvo(card) {
		this.game.dealAnyCard(this.game.requestedPlayer, card);
		Logger.emit(
			` - ${this.game.players[this.game.requestedPlayer].name} si zobral kartu: ${
				this.game.players[this.game.requestedPlayer].cards[
					this.game.players[this.game.requestedPlayer].cards.length - 1
				].name
			}`
		);

		let player_i = this.game.requestedPlayer + 1 == this.game.players.length ? 0 : this.game.requestedPlayer + 1;

		while (!this.game.players[player_i].alive) {
			player_i++;
			if (player_i >= this.game.players.length) player_i = 0;
		}
		this.game.requestedPlayer = player_i;

		if (this.game.requestedPlayer == this.game.turn) {
			this.game.requestedPlayer = null;
			this.game.playedCard = null;
			this.io.to(this.game.players[this.game.turn].id).emit('turnResumeSound');
		}
		this.game.update(this.io);
	}

	useCard(socket, card_name, card_index) {
		var sender_i = this.game.players.findIndex((user) => user.id === socket.id);

		var deny_these_cards = ['Catbalou', 'Panika', 'Vazenie', 'Duel'];
		for (var i in deny_these_cards) if (deny_these_cards[i] == card_name) return;

		//ak je nastavene safeBeer na true a pride ina karta, v automaticky ju zakaze:
		if (this.game.safeBeer > -1 && card_name != 'Pivo') return;

		//ak je hrac na tahu a nic sa nedeje zatial
		if (this.game.requestedPlayer == null && this.game.turn == sender_i) {
			var bool = this.game.players[sender_i].cards[card_index].action(this.game, sender_i, card_index, this.io);
			if (bool) Logger.emit(card_name); //loguje len ak zahranie karty prebehlo uspesne
		}
		//ak to posiela hrac, od ktoreho je pozadovana akcia
		else if (this.game.requestedPlayer == sender_i) {
			if (card_name == this.game.requestedCard) {
				this.game.players[sender_i].cards[card_index].action(this.game, sender_i, card_index, this.io);
				Logger.emit(` - ${card_name} (${this.game.players[sender_i].name})`);
			} else if (this.game.players[sender_i].character.name == 'calamity_janet') {
				if (this.game.players[sender_i].character.calamityHandler(this.game, sender_i, card_index, this.io))
					Logger.emit(`(Calamity) - ${card_name} (${this.game.players[sender_i].name})`);
			} else if (this.game.safeBeer > -1 && card_name == 'Pivo')
				this.game.players[sender_i].cards[card_index].action(this.game, sender_i, card_index, this.io);
		}
		this.game.update(this.io);
	}

	loseLife(id) {
		var player_i = this.game.players.findIndex((user) => user.id === id);

		//bart_cassidy_check todo
		if (this.game.players[player_i].character.name == 'bart_cassidy') {
			this.game.dealOneCard(player_i);
		}

		//el_gringo check TODO
		if (this.game.players[player_i].character.name == 'el_gringo' && this.game.safeBeer < 0) {
			if (this.game.turn != player_i) {
				this.game.players[player_i].character.reaction(this.game, player_i, this.game.turn);

				//ak zobral kartu suzy a nezostala jej ziadna
				if (
					this.game.players[this.game.turn].character.name == 'suzy_lafayette' &&
					this.game.players[this.game.turn].cards.length == 0
				)
					this.game.dealOneCard(this.game.turn);
			} else {
				this.game.players[player_i].character.reaction(this.game, player_i, this.game.duelistPlayer);

				//ak zobral kartu suzy a nezostala jej ziadna
				if (
					this.game.players[this.game.duelistPlayer].character.name == 'suzy_lafayette' &&
					this.game.players[this.game.duelistPlayer].cards.length == 0
				)
					this.game.dealOneCard(this.game.duelistPlayer);
			}
		}

		if (--this.game.players[player_i].HP <= 0) {
			if (this.game.safeBeerCheck(player_i)) {
				this.game.update(this.io);
				return;
			}
			this.game.death(player_i, this.io);
		} else Logger.emit(' - ' + this.game.players[player_i].name + ' sa rozhodol zobrať si život.');

		//Kontrola posuvania hracov, kto ide dalsi..'
		if (this.game.requestedPlayer != null) {
			if (this.game.playedCard == 'Gulomet' || this.game.playedCard == 'Indiani') {
				this.game.requestedPlayer = this.game.getNextPlayer(player_i);

				this.game.barelLimitCheck(this.game.requestedPlayer);
				this.game.update(this.io);
				if (this.game.requestedPlayer != this.game.turn) return;
			}

			this.game.requestedPlayer = null;
			this.game.playedCard = null;
			this.game.requestedCard = null;
			this.io.to(this.game.players[this.game.turn].id).emit('turnResumeSound');

			if (this.game.players[this.game.turn].character.name == 'slab_the_killer') {
				this.game.players[this.game.turn].character.vedleCount = 0;
			}
		}

		this.game.update(this.io);
	}

	discard(socket, id, card_i) {
		if (this.game.safeBeer > -1) {
			return;
		}

		var player_i = this.game.players.findIndex((user) => user.id === socket.id);

		if (
			Sid_ketchum.checkAndAct(this.game, player_i) ||
			Jose_delgado.checkAndAct(this.game, player_i, card_i, this.io) ||
			this.game.players[player_i].cards.length > this.game.players[player_i].HP
		) {
			Logger.emit(`Zahodena karta: ${this.game.players[player_i].cards[card_i].name}`);

			this.game.discardCard(player_i, card_i);
			this.game.update(this.io);
		} else this.io.to(id).emit('discardDeny');
	}

	dealOneCard(player_i) {
		if (this.game.safeBeer < 0) {
			this.game.dealOneCard(player_i);
			this.game.update(this.io);
		}
	}

	moveStage() {
		if (this.game.safeBeer < 0) {
			this.game.moveStage++;
			this.game.update(this.io);
		}
	}

	requestedCard(card) {
		this.game.requestedCard = card;
		this.game.update(this.io);
	}

	playedCard(card) {
		this.game.playedCard = card;
		this.game.update(this.io);
	}

	interaction(socket, id, event, clickedBlue_i, card_index) {
		var index_sender = this.game.players.findIndex((user) => user.id === socket.id);
		var index_target = this.game.players.findIndex((user) => user.id === id);
		let card = this.game.players[index_sender].cards[card_index];

		if (event == 'Calamity') {
			card = this.game.players[index_sender].character.bang;
		}

		if (card.onRange && !this.game.isInRange(index_sender, index_target, card_index)) {
			return;
		}
		const result = card.action(this.game, index_sender, card_index, index_target, clickedBlue_i);
		if (result == false) return;

		Logger.logInteraction(event, this.game.players[index_sender].name, this.game.players[index_target].name);

		switch (event) {
			case 'Catbalou':
				Logger.emit(' - zahodena karta: ' + result);
				break;
			case 'Duel':
				socket.broadcast.to(id).emit(event, clickedBlue_i, index_sender);
				this.io.emit('Duel-announcement');
				break;
			case 'Panika':
				Logger.emitTo(socket, this.game.players[index_target].id, ' - zobrali ti kartu: ' + result);
				break;
			case 'Bang':
				socket.broadcast.to(id).emit('Bang');
				break;

			default:
				break;
		}

		this.game.update(this.io);
	}

	characterAction(socket) {
		var sender_i = this.game.players.findIndex((user) => user.id === socket.id);
		var result = this.game.players[sender_i].character.action(this.game, sender_i, this.io);
		if (result != null)
			Logger.emit(
				`${this.game.players[sender_i].name} (	${this.game.players[sender_i].character.name} ) ... ${result}`
			);
		this.game.update(this.io);
	}

	restart(password_hash) {
		if (this.game.started) {
			console.log('Zly restart request - hra stale prebieha');
			return; //ak je hra v priebehu, tak sa nestane nic
		}
		//ak sa posle nespravne heslo
		if (password_hash != 'e1e30c808560586f927324b701345752') return;

		this.game = new Game();

		//loop through connected sockets and add them as players to the next this.game
		let connected_sockets = this.io.sockets.sockets;
		for (var socketId in connected_sockets) {
			this.playerConnected(socketId); //vytvori noveho hraca

			//nastavi mu meno podla toho, co je priradene k jeho socketId v poli "names"
			this.game.players[this.game.players.length - 1].name = this.names[socketId];
		}

		this.io.emit('restart');
		this.game.update(this.io);
	}

	ownBlueClicked(player, card) {
		if (player == null || player == undefined) player = this.game.requestedPlayer;
		this.game.players[player].blueCards[card].click(this.game, this.io, player, card);
		this.game.update(this.io);
	}

	multiselectAbilityClick(socket, arg) {
		let player_i = this.game.players.findIndex((user) => user.id === socket.id);
		this.game.players[player_i].character.click(this.game, this.io, arg, player_i);
	}
}

module.exports = ServerController;
