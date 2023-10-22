const [Logger] = require('./logger.js');
class DynamitHandler {
	static willDynamitExplode(card) {
		return card.suit == 'spades' && card.rank >= 2 && card.rank <= 9;
	}
	static moveDynamit(game, player_i, nextPlayer, dynamit_i) {
		game.players[nextPlayer].blueCards.push(game.players[player_i].blueCards[dynamit_i]);
		game.players[player_i].blueCards.splice(dynamit_i, 1);
		game.players[nextPlayer].dynamit = true;
	}

	static dynamitClick(game, player, card, checkCard, io) {
		if (game.moveStage == 0 && game.dynamit == true) {
			game.players[player].dynamit = false;

			Logger.emit(`Dynamit potiahnuta karta: ${checkCard.name}`);

			if (DynamitHandler.willDynamitExplode(checkCard)) {
				io.emit('dynamitSound');
				Logger.emit(` - Dynamit vybuchol...`);

				game.dynamit = false;
				game.trashCard(game.players[player].blueCards[card]);
				game.players[player].blueCards.splice(card, 1);

				game.players[player].loseHp(3);
				if (game.players[player].HP == 0) {
					if (safeBeerCheck(player, io)) {
						return;
					}
					game.nextTurn(player, true);
					Death(player);
					Logger.emit(` ---------- na tahu je: ${game.players[game.turn].name} ---------- `);

					// TODO do it differently
				} else if (game.players[player].character.name == 'bart_cassidy') {
					game.dealOneCard(player);
					game.dealOneCard(player);
					game.dealOneCard(player);
				}
			} else {
				var nextPlayer = game.getNextPlayer(player);

				DynamitHandler.moveDynamit(game, player, nextPlayer, card);
			}
		}
	}
}

module.exports = DynamitHandler;
