class Logger {
	static io = null;
	static setIo(io) {
		this.io = io;
	}

	static emit(text) {
		this.io.emit('log', text);
	}

	static logInteraction(event, sender, target) {
		this.io.emit('log', event + ': (' + sender + ' >>> ' + target + ')');
	}

	static emitTo(socket, id, text) {
		socket.broadcast.to(id).emit('log', text);
	}
}

module.exports = [Logger];
