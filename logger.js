class Logger {
	static setIo(io) {
		this.io = io;
	}
	static emit(text) {
		this.io.emit(text);
	}

	static logInteraction(event, sender, target) {
		this.io.emit('log', event + ': (' + sender + ' >>> ' + target + ')');
	}
}

module.exports = [Logger];
