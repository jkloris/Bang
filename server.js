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

app.use(express.static(path.join(__dirname, 'public')));
const ServerController = require('./server_controller');

let serverCntrl = new ServerController(io);

io.on('connection', (socket) => {
	console.log('somebody connected');
	//niekto sa pripojil
	serverCntrl.playerConnected(socket.id);
	serverCntrl.game.update(io);

	//hrac si nastavi meno
	socket.on('set-name', (name) => {
		serverCntrl.names[`${socket.id}`] = name; //priradi do pola "names" k socket.id meno, ake si vybral

		let index = serverCntrl.game.players.findIndex((user) => user.id === socket.id);
		if (index != -1) {
			serverCntrl.game.players[index].name = name;
			serverCntrl.game.update(io);
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
		serverCntrl.clicked(socket, mouse, id);
	});

	socket.on('nextTurn', (id) => {
		serverCntrl.nextTurn(socket, id);
	});

	socket.on('startGame', async () => {
		serverCntrl.startGame();
	});

	socket.on('hokynarstvo', (card) => {
		serverCntrl.hokynarstvo(card);
	});

	socket.on('useCard', (card_name, card_index) => {
		serverCntrl.useCard(socket, card_name, card_index);
	});

	socket.on('loseLife', (id) => {
		serverCntrl.loseLife(id);
	});

	socket.on('discard', (id, card_i) => {
		serverCntrl.discard(socket, id, card_i);
	});

	socket.on('dealOneCard', (player_i) => {
		serverCntrl.dealOneCard(player_i);
	});

	socket.on('moveStage++', () => {
		serverCntrl.moveStage();
	});

	socket.on('RequestedCard', (card) => {
		serverCntrl.requestedCard(card);
	});

	socket.on('PlayedCard', (card) => {
		serverCntrl.playedCard(card);
	});

	//mechanika barelu, prison, dynamit?
	socket.on('ownBlueClicked', (player, card) => {
		serverCntrl.ownBlueClicked(player, card);
	});

	socket.on('interaction', (id, event, clickedBlue_index, card_index) => {
		serverCntrl.interaction(socket, id, event, clickedBlue_index, card_index);
	});

	socket.on('characterAction', () => {
		serverCntrl.characterAction(socket);
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

	socket.on('disconnect', () => {
		console.log('somebody disconnected');
		serverCntrl.playerDisconnect(socket.id);
		serverCntrl.game.update(io);
	});

	socket.on('restart', (password_hash) => {
		serverCntrl.restart(password_hash);
	});
});

server.listen(PORT, IP, () => console.log(`server running on ${IP}:${PORT}`));
