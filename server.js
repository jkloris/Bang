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

	socket.on('multiselectAbilityClick', (arg) => {
		serverCntrl.multiselectAbilityClick(socket, arg);
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
