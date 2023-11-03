const PORT = process.env.PORT || 8888;
const IP = 'localhost';
//const IP = '10.156.0.2'; //pre Google Cloud VM

const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

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

app.use(express.static(path.join(__dirname, 'public')));

var game = new Game();
Logger.setIo(io);

//spaja socket.id klienta s menom, ktore si nastavi
var names = {};

io.on('connection', (socket) => {
	console.log('somebody connected');
	//niekto sa pripojil
	playerConnected(socket.id);
	game.update(io);

	//hrac si nastavi meno
	socket.on('set-name', (name) => {
		names[`${socket.id}`] = name; //priradi do pola "names" k socket.id meno, ake si vybral

		let index = game.players.findIndex((user) => user.id === socket.id);
		if (index != -1) {
			game.players[index].name = name;
			game.update(io);
		}
	});

	//kickovanie hracov
	socket.on('kick', (name, password_hash) => {
		if (password_hash != '48ad3b40215797a91101191f40f320ca') {
			console.log('kick request, zle heslo');
			return;
		}

		let index = game.players.findIndex((user) => user.name === name);
		if (index != -1) {
			console.log('kick request ' + name + '  index: ' + index);
			console.log('malo by ho to kicknut');
			socket.broadcast.to(game.players[index].id).emit('kick');
		} else console.log('Kick request, ale hrac nebol najedny');
	});

	//zachytenie suradnice kliknutia
	socket.on('clicked', (mouse, id) => {
		if (game.requestedPlayer == null && game.players[game.turn].id == id) {
			console.log('Click: ', mouse, id);
			socket.emit('clickAccept', mouse);
		}
		if (game.requestedPlayer != null && game.players[game.requestedPlayer].id == id) {
			if (game.playedCard == 'Hokynarstvo') {
				socket.emit('emporio_clickAccept', mouse);
			} else {
				console.log('Requested Click: ', mouse, id);
				socket.emit('partial_clickAccept', mouse);
			}
		}
		socket.emit('logClick', mouse);
	});

	socket.on('nextTurn', (id) => {
		if (game.moveStage == 0) {
			console.log('next request, ale moveStage == 0, takze nic sa nerobi');
			return;
		}
		var index_sender = game.players.findIndex((user) => user.id === socket.id);
		console.log('next request');
		if (game.nextTurn(index_sender)) {
			io.to(game.players[game.turn].id).emit('onTurnSound');
			io.emit('log', ` ---------- na tahu je: ${game.players[game.turn].name} ---------- `);
			game.update(io);
		} else io.to(id).emit('discardRequest');
	});

	socket.on('startGame', async () => {
		if (game.players.length <= 1) return; //crashuje to, ak pustime hru s iba 1 hracom
		game.started = true;
		game.dealCharacters();
		game.dealRoles();
		await game.shuffleDeck();
		while (!game.cards) {
			console.log('....');
		}
		game.dealCards();
		io.emit('log', ` ---------- na tahu je: ${game.players[game.turn].name} ---------- `);
		game.update(io);
	});

	socket.on('hokynarstvo', (card) => {
		game.dealAnyCard(game.requestedPlayer, card);
		io.emit(
			'log',
			` - ${game.players[game.requestedPlayer].name} si zobral kartu: ${
				game.players[game.requestedPlayer].cards[game.players[game.requestedPlayer].cards.length - 1].name
			}`
		);

		var player_index = game.requestedPlayer + 1 == game.players.length ? 0 : game.requestedPlayer + 1;

		while (!game.players[player_index].alive) {
			player_index++;
			if (player_index >= game.players.length) player_index = 0;
		}
		game.requestedPlayer = player_index;

		if (game.requestedPlayer == game.turn) {
			game.requestedPlayer = null;
			game.playedCard = null;
			io.to(game.players[game.turn].id).emit('turnResumeSound');
		}
		game.update(io);
	});

	socket.on('useCard', (card_name, card_index) => {
		console.log('useCard', card_name);
		var index_sender = game.players.findIndex((user) => user.id === socket.id);

		var deny_these_cards = ['Catbalou', 'Panika', 'Vazenie', 'Duel'];
		for (var i in deny_these_cards) if (deny_these_cards[i] == card_name) return;

		//ak je nastavene safeBeer na true a pride ina karta, v automaticky ju zakaze:
		if (game.safeBeer > -1 && card_name != 'Pivo') return;

		//ak je hrac na tahu a nic sa nedeje zatial
		if (game.requestedPlayer == null && game.turn == index_sender) {
			var bool = game.players[index_sender].cards[card_index].action(game, index_sender, card_index, io);
			if (bool) Logger.emit(card_name); //loguje len ak zahranie karty prebehlo uspesne
		}
		//ak to posiela hrac, od ktoreho je pozadovana akcia
		else if (game.requestedPlayer == index_sender) {
			if (card_name == game.requestedCard) {
				game.players[index_sender].cards[card_index].action(game, index_sender, card_index, io);
				Logger.emit(` - ${card_name} (${game.players[index_sender].name})`);
			} else if (game.players[index_sender].character.name == 'calamity_janet') {
				if (game.players[index_sender].character.calamityHandler(game, index_sender, card_index, io))
					Logger.emit(`(Calamity) - ${card_name} (${game.players[index_sender].name})`);
			} else if (game.safeBeer > -1 && card_name == 'Pivo')
				game.players[index_sender].cards[card_index].action(game, index_sender, card_index, io);
		}
		game.update(io);
	});

	socket.on('loseLife', (id) => {
		var player_index = game.players.findIndex((user) => user.id === id);

		if (game.players[player_index].character.name == 'bart_cassidy') {
			game.dealOneCard(player_index);
		}

		if (game.players[player_index].character.name == 'el_gringo' && game.safeBeer < 0) {
			if (game.turn != player_index) {
				game.players[player_index].character.reaction(game, player_index, game.turn);

				//ak zobral kartu suzy a nezostala jej ziadna
				if (
					game.players[game.turn].character.name == 'suzy_lafayette' &&
					game.players[game.turn].cards.length == 0
				)
					game.dealOneCard(game.turn);
			} else {
				game.players[player_index].character.reaction(game, player_index, game.duelistPlayer);

				//ak zobral kartu suzy a nezostala jej ziadna
				if (
					game.players[game.duelistPlayer].character.name == 'suzy_lafayette' &&
					game.players[game.duelistPlayer].cards.length == 0
				)
					game.dealOneCard(game.duelistPlayer);
			}
		}

		if (--game.players[player_index].HP <= 0) {
			if (game.safeBeerCheck(player_index)) {
				game.update(io);
				return;
			}
			game.death(player_index, io);
		} else io.emit('log', ' - ' + game.players[player_index].name + ' sa rozhodol zobrať si život.');

		if (game.requestedPlayer != null) {
			console.log('Kontrola posuvania hracov, kto ide dalsi..');
			if (game.playedCard == 'Gulomet' || game.playedCard == 'Indiani') {
				player_index = player_index + 1 == game.players.length ? 0 : player_index + 1;

				while (!game.players[player_index].alive) {
					player_index++;
					if (player_index >= game.players.length) player_index = 0;
				}
				game.requestedPlayer = player_index;

				if (game.requestedPlayer == game.turn) {
					game.requestedPlayer = null;
					game.playedCard = null;
					game.requestedCard = null;
					io.to(game.players[game.turn].id).emit('turnResumeSound');
				}

				game.barelLimitCheck(game.requestedPlayer);
			} else {
				game.requestedPlayer = null;
				game.playedCard = null;
				game.requestedCard = null;
				io.to(game.players[game.turn].id).emit('turnResumeSound');

				if (game.players[game.turn].character.name == 'slab_the_killer') {
					game.players[game.turn].character.vedleCount = 0;
				}
			}
		}

		game.update(io);
	});

	socket.on('discard', (id, card_i) => {
		if (game.safeBeer > -1) {
			console.log('Niekto sa snazi discardovat, ked ma dat safebeer');
			return;
		}
		var player_index = game.players.findIndex((user) => user.id === socket.id);
		if (game.players[player_index].cards.length > game.players[player_index].HP) {
			io.emit('log', `Zahodena karta: ${game.players[player_index].cards[card_i].name}`);

			if (game.players[player_index].character.name == 'sid_ketchum') {
				game.players[player_index].character.discartedCards++;
			} //game.turn sa vzdy rovna player_index?
			else if (
				game.turn == player_index &&
				game.players[player_index].character.name == 'jose_delgado' &&
				game.players[player_index].character.useLeft > 0
			) {
				if (game.players[player_index].cards[card_i].isBlue) {
					game.players[player_index].character.useLeft--;
					game.dealOneCard(player_index);
					io.emit(
						'log',
						game.players[player_index].name +
							' vyuzil schopnost (' +
							game.players[player_index].character.name +
							')'
					);
				}
			}

			game.discardCard(player_index, card_i);
			game.update(io);
		} else if (
			game.players[player_index].character.name == 'sid_ketchum' &&
			game.players[player_index].HP < game.players[player_index].maxHP
		) {
			Logger.emit(`Zahodena karta: ${game.players[player_index].cards[card_i].name}`);
			game.discardCard(player_index, card_i);
			game.players[player_index].character.discartedCards++;
			game.update(io);
		} else if (
			game.turn == player_index &&
			game.players[player_index].character.name == 'jose_delgado' &&
			game.players[player_index].character.useLeft > 0
		) {
			if (game.players[player_index].cards[card_i].isBlue) {
				game.players[player_index].character.useLeft--;
				game.dealOneCard(player_index);
				io.emit('log', `Zahodena karta: ${game.players[player_index].cards[card_i].name}`);
				io.emit(
					'log',
					game.players[player_index].name +
						' vyuzil schopnost (' +
						game.players[player_index].character.name +
						')'
				);
			}
		} else io.to(id).emit('discardDeny');
	});

	socket.on('dealOneCard', (player_i) => {
		if (game.safeBeer < 0) {
			//iba ak nie je aktualne safebeer...
			game.dealOneCard(player_i);
			game.update(io);
		}
	});

	socket.on('moveStage++', () => {
		if (game.safeBeer < 0) {
			//tiez iba ak nie je aktualne safebeer
			game.moveStage++;
			game.update(io);
		}
	});

	socket.on('RequestedCard', (card) => {
		game.requestedCard = card;
		game.update(io);
	});

	socket.on('PlayedCard', (card) => {
		game.playedCard = card;
		game.update(io);
	});

	//mechanika barelu a mozno viac
	socket.on('ownBlueClicked', (arg) => {
		if (game.players[game.requestedPlayer].blueCards[arg].name == 'Barel') {
			if (game.requestedCard == 'Vedle' && game.barelLimit > 0) {
				var last = game.cards.pop();
				io.emit('log', `- Barel potiahnuta karta: ${last.name}`);
				if (last.suit == 'heart' && game.playedCard == 'Gulomet') {
					var player_index = game.requestedPlayer;

					player_index = player_index + 1 == game.players.length ? 0 : player_index + 1;

					while (!game.players[player_index].alive) {
						player_index++;
						if (player_index >= game.players.length) player_index = 0;
					}
					game.requestedPlayer = player_index;

					if (game.requestedPlayer == game.turn) {
						game.requestedPlayer = null;
						game.playedCard = null;
						game.requestedCard = null;
						io.to(game.players[game.turn].id).emit('turnResumeSound');
					}

					game.barelLimitCheck(game.requestedPlayer);
				} else if (last.suit == 'heart') {
					if (game.players[game.turn].character.name == 'slab_the_killer') {
						game.players[game.turn].character.vedleCount++;
						if (game.players[game.turn].character.vedleCount == 2) {
							game.requestedPlayer = null;
							game.playedCard = null;
							game.requestedCard = null;
							game.players[game.turn].character.vedleCount = 0;
							io.to(game.players[game.turn].id).emit('turnResumeSound');
						}
						//return;
					} else {
						game.requestedPlayer = null;
						game.requestedCard = null;
						game.playedCard = null;
						io.to(game.players[game.turn].id).emit('turnResumeSound');
					}
				}
				if (
					game.requestedPlayer != null &&
					game.players[game.requestedPlayer].character.name == 'jourdonnais' &&
					last.suit == 'heart' &&
					game.barelLimit == 4
				)
					game.barelLimit -= 2;
				else game.barelLimit--;
				game.cards.unshift(last);
			}
		}
		game.update(io);
	});

	function prisonClick(player_i, prison_i) {
		if (game.moveStage > 0 || game.players[player_i].prison == false) return false;

		Logger.emit(`Vazenie potiahnuta karta: ${game.cards[0].name}`);
		game.players[player_i].prison = false;

		game.trashCard(game.players[player_i].blueCards[prison_i]);
		game.players[player_i].blueCards.splice(prison_i, 1);

		if (game.cards[0].suit != 'heart') {
			game.nextTurn(player_i, true);
			Logger.emit(` ---------- na tahu je: ${game.players[game.turn].name} ---------- `);
		}
		return true;
	}

	socket.on('prisonClick', (player, card) => {
		if (!prisonClick(player, card)) return;

		game.trashCard(game.cards[game.cards.length - 1]);
		game.cards.splice(game.cards.length - 1, 1);
		game.update(io);
	});

	socket.on('dynamiteClick', (player, card) => {
		let checkCard = game.cards[game.cards.length - 1];
		DynamitHandler.dynamitClick(game, player, card, checkCard, io);
		game.trashCard(checkCard);
		game.cards.splice(game.cards.length - 1, 1);

		game.update(io);
	});

	socket.on('interaction', (id, event, clickedBlue_index, card_index) => {
		console.log('interaction ' + event);
		var index_sender = game.players.findIndex((user) => user.id === socket.id);
		var index_target = game.players.findIndex((user) => user.id === id);
		let card = game.players[index_sender].cards[card_index];
        
        if(event == "Calamity"){
            card = game.players[index_sender].character.bang
        }   

		if (card.onRange && !game.isInRange(index_sender, index_target, card_index)) {
			return;
		}
		const result = card.action(game, index_sender, card_index, index_target, clickedBlue_index);
		if (result == false) return;

		Logger.logInteraction(event, game.players[index_sender].name, game.players[index_target].name);

		switch (event) {
			case 'Catbalou':
				Logger.emit(' - zahodena karta: ' + result);
				break;
			case 'Duel':
				socket.broadcast.to(id).emit(event, clickedBlue_index, index_sender);
				io.emit('Duel-announcement');
				break;
			case 'Panika':
				Logger.emitTo(socket, game.players[index_target].id, ' - zobrali ti kartu: ' + result);
				break;
			case 'Bang':
				socket.broadcast.to(id).emit('Bang');
				break;

			default:
				break;
		}

		game.update(io);
	});

	socket.on('characterAction', () => {
		var index_sender = game.players.findIndex((user) => user.id === socket.id);
		var result = game.players[index_sender].character.action(game, index_sender, io);
		if (result != null)
			io.emit(
				'log',
				game.players[index_sender].name + ' (' + game.players[index_sender].character.name + ') ... ' + result
			);
		game.update(io);
	});

	socket.on('kit_carlson_click', (card_i) => {
		var kit_index = game.players.findIndex((user) => user.id === socket.id);

		for (var i = 0; i < 3; i++) {
			var drawn_card = game.cards.pop();
			if (card_i == i) {
				var card_to_put_back = drawn_card;
			} else game.players[kit_index].cards.push(drawn_card);
		}
		game.cards.push(card_to_put_back);

		game.moveStage++;
		game.update(io);
	});

	socket.on('lucky_duke_click', (card_i) => {
		var player_i = game.players.findIndex((user) => user.id === socket.id);
		var prison_i = game.players[player_i].blueCards.findIndex((card) => card.name == 'Vazenie');
		var dynamit_i = game.players[player_i].blueCards.findIndex((card) => card.name == 'Dynamit');

		if (game.players[player_i].character.name != 'lucky_duke') return;

		var chosenCard = game.cards[game.cards.length - 1 - card_i];

		var event = game.players[player_i].character.event;

		if (event == 'prison') {
			prisonClick(player_i, prison_i);
		} else if (event == 'dynamit') {
			DynamitHandler.dynamitClick(game, player_i, dynamit_i, chosenCard, io);
		} else if (event == 'barel') {
			if (game.barelLimit > 0) {
				if (chosenCard.suit == 'heart' && game.playedCard == 'Gulomet') {
					var player_index = game.requestedPlayer;

					player_index = player_index + 1 == game.players.length ? 0 : player_index + 1;

					while (!game.players[player_index].alive) {
						player_index++;
						if (player_index >= game.players.length) player_index = 0;
					}
					game.requestedPlayer = player_index;

					if (game.requestedPlayer == game.turn) {
						game.requestedPlayer = null;
						game.playedCard = null;
						game.requestedCard = null;
						io.to(game.players[game.turn].id).emit('turnResumeSound');
					}

					game.barelLimitCheck(game.requestedPlayer);
				} else if (chosenCard.suit == 'heart') {
					if (game.players[game.turn].character.name == 'slab_the_killer') {
						game.players[game.turn].character.vedleCount++;
						if (game.players[game.turn].character.vedleCount == 2) {
							game.requestedPlayer = null;
							game.playedCard = null;
							game.requestedCard = null;
							game.players[game.turn].character.vedleCount = 0;
							io.to(game.players[game.turn].id).emit('turnResumeSound');
						}
					} else {
						game.requestedPlayer = null;
						game.requestedCard = null;
						game.playedCard = null;
						io.to(game.players[game.turn].id).emit('turnResumeSound');
					}
				}

				game.barelLimit--;
			}
		}
		game.trashCard(chosenCard);
		game.cards.splice(game.cards.length - 1 - card_i, 1);
		game.update(io);
	});

	socket.on('jesse_jones_choice', (index_jesse, id_target) => {
		var index_target = game.players.findIndex((user) => user.id === id_target);
		var rand_card_index = Math.floor(Math.random() * game.players[index_target].cards.length);
		game.players[index_jesse].cards.push(game.players[index_target].cards[rand_card_index]);
		game.players[index_target].cards.splice(rand_card_index, 1);
		game.dealOneCard(index_jesse);
		game.moveStage++;
		game.update(io);
	});

	//odpojenie hraca
	socket.on('disconnect', () => {
		console.log('somebody disconnected');
		playerDisconnect(socket.id);
		game.update(io);
	});

	socket.on('restart', (password_hash) => {
		//pri testovani zakomentovane
		if (game.started) {
			console.log('Zly restart request - hra stale prebieha');
			//return; //ak je hra v priebehu, tak sa nestane nic
		}
		//ak sa posle nespravne heslo
		if (password_hash != 'e1e30c808560586f927324b701345752') return;

		game = new Game();

		//loop through connected sockets and add them as players to the next game
		let connected_sockets = io.sockets.sockets;
		for (var socketId in connected_sockets) {
			playerConnected(socketId); //vytvori noveho hraca

			//nastavi mu meno podla toho, co je priradene k jeho socketId v poli "names"
			game.players[game.players.length - 1].name = names[socketId];
		}

		io.emit('restart');
		game.update(io);
	});
});

server.listen(PORT, IP, () => console.log(`server running on ${IP}:${PORT}`));

function playerDisconnect(id) {
	var index = game.players.findIndex((user) => user.id === id);
	if (game.started && index != -1) {
		console.log(game.players[index].name + ' disconnected');
		io.emit('log', game.players[index].name + ' sa odpojil.');
		game.players[index].alive = false;
		game.players[index].HP = -1;
		game.deadPlayers++;
		if (game.players[index].dynamit) game.dynamit = false;
		if (game.turn == index) game.nextTurn(index, true);

		let result = game.gameOver();
		console.log('checking for game over... with result: ' + result.result);
		if (result.result) {
			io.emit('winner', result.winner);
			game.started = false;
			game.update(io);
		}

		//karty odpojeneho hraca sa zahodia do kopky
		while (game.players[index].cards.length > 0) {
			var card = game.players[index].cards.pop();
			game.cards.unshift(card);
			game.trashedCards++;
		}
		while (game.players[index].blueCards.length > 0) {
			var card = game.players[index].blueCards.pop();
			game.cards.unshift(card);
			game.trashedCards++;
		}
	} else if (index != -1) {
		//ak sa odpaja hrac, ked este nebola zacata hra
		game.players.splice(index, 1);
		console.log(id, 'disconnected');
	}
}

function playerConnected(id) {
	if (!game.started) game.players.push(new Player(id, 1, null, null, null));
}
