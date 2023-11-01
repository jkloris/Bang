const [
	Bang,
	Vedle,
	Dostavnik,
	Wellsfargo,
	Pivo,
	Salon,
	Indiani,
	Schofield,
	Remington,
	Carabine,
	Winchester,
	Volcanic,
	Appaloosa,
	Mustang,
	Catbalou,
	Panika,
	Gulomet,
	Hokynarstvo,
	Barel,
	Vazenie,
	Dynamit,
	Duel,
] = require('./cards.js');
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
const fs = require('fs');

class Game {
	constructor() {
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
		this.barelLimit = 0;
		this.safeBeer = -1; //player index
	}

	dealCharacters() {
		// bez greg_digger, vera nejaka
		let characters = [
			'paul_regret',
			'sean_mallory',
			'bill_noface',
			'pixie_pete',
			'jose_delgado',
			'bart_cassidy',
			'suzy_lafayette',
			'willy_the_kid',
			'vulture_sam',
			'slab_the_killer',
			'sid_ketchum',
			'rose_doolan',
			'pedro_ramirez',
			'lucky_duke',
			'kit_carlson',
			'jesse_jones',
			'el_gringo',
			'calamity_janet',
			'black_jack',
			'jourdonnais',
			'felipe_prisonero',
		];
		for (var i in this.players) {
			var rand_i = Math.floor(Math.random() * characters.length);

			switch (characters[rand_i]) {
				case 'paul_regret':
					this.players[i].character = new Paul_regret(this.players[i]);
					break;
				case 'bart_cassidy':
					this.players[i].character = new Bart_cassidy(this.players[i]);
					break;
				case 'suzy_lafayette':
					this.players[i].character = new Suzy_lafayette(this.players[i]);
					break;
				case 'willy_the_kid':
					this.players[i].character = new Willy_the_kid(this.players[i]);
					break;
				case 'vulture_sam':
					this.players[i].character = new Vulture_sam(this.players[i]);
					break;
				case 'slab_the_killer':
					this.players[i].character = new Slab_the_killer(this.players[i]);
					break;
				case 'sid_ketchum':
					this.players[i].character = new Sid_ketchum(this.players[i]);
					break;
				case 'rose_doolan':
					this.players[i].character = new Rose_doolan(this.players[i]);
					break;
				case 'pedro_ramirez':
					this.players[i].character = new Pedro_ramirez(this.players[i]);
					break;
				case 'lucky_duke':
					this.players[i].character = new Lucky_duke(this.players[i]);
					break;
				case 'kit_carlson':
					this.players[i].character = new Kit_carlson(this.players[i]);
					break;
				case 'jesse_jones':
					this.players[i].character = new Jesse_jones(this.players[i]);
					break;
				case 'jourdonnais':
					this.players[i].character = new Jourdonnais(this.players[i]);
					break;
				case 'calamity_janet':
					this.players[i].character = new Calamity_janet(this.players[i]);
					break;
				case 'black_jack':
					this.players[i].character = new Black_jack(this.players[i]);
					break;
				case 'el_gringo':
					this.players[i].character = new El_gringo(this.players[i]);
					break;
				case 'felipe_prisonero':
					this.players[i].character = new Felipe_prisonero(this.players[i]);
					break;
				case 'jose_delgado':
					this.players[i].character = new Jose_delgado(this.players[i]);
					break;
				case 'pixie_pete':
					this.players[i].character = new Pixie_pete(this.players[i]);
					break;
				case 'bill_noface':
					this.players[i].character = new Bill_noface(this.players[i]);
					break;
				case 'sean_mallory':
					this.players[i].character = new Sean_mallory(this.players[i]);
					break;
				case 'greg_digger':
					this.players[i].character = new Greg_digger(this.players[i]);
					break;
				case 'vera_custer':
					this.players[i].character = new Vera_custer(this.players[i]);
					break;

				default:
					break;
			}

			// nastavi na index 0 postavu, ktoru chceme napevno nastavit
			if (i == 1 || i == 0) {
				this.players[i].character = new Sean_mallory(this.players[i]);
				this.players[i].character.init(this.players[i]);
			}

			this.players[i].character.init(this.players[i]);

			characters.splice(rand_i, 1);
		}
	}

	dealRoles() {
		//nahodne poradie hracov bez ohladu na poradie prihlasenia sa
		shuffle(this.players);
		switch (this.players.length) {
			case 2:
				[new Sheriff(this.players[0]), new Bandita(this.players[1])];
				break;
			case 3:
				[new Sheriff(this.players[0]), new Bandita(this.players[1]), new Odpadlik(this.players[2])];
				break;
			case 4:
				[
					new Sheriff(this.players[0]),
					new Bandita(this.players[1]),
					new Odpadlik(this.players[2]),
					new Bandita(this.players[3]),
				];
				break;
			case 5:
				[
					new Sheriff(this.players[0]),
					new Bandita(this.players[1]),
					new Odpadlik(this.players[2]),
					new Bandita(this.players[3]),
					new Vice(this.players[4]),
				];
				break;
			case 6:
				[
					new Sheriff(this.players[0]),
					new Bandita(this.players[1]),
					new Odpadlik(this.players[2]),
					new Bandita(this.players[3]),
					new Bandita(this.players[4]),
					new Vice(this.players[5]),
				];
				break;
			case 7:
				[
					new Sheriff(this.players[0]),
					new Bandita(this.players[1]),
					new Odpadlik(this.players[2]),
					new Bandita(this.players[3]),
					new Bandita(this.players[4]),
					new Vice(this.players[5]),
					new Vice(this.players[6]),
				];
				break;

			default:
				break;
		}
		//nahodne poradie postav
		shuffle(this.players);
		//prehodenie sheriffa na prve miesto
		var sheriff_i = this.players.findIndex((player) => player.role == 'Sheriff');
		var temp = this.players[0];
		this.players[0] = this.players[sheriff_i];
		this.players[sheriff_i] = temp;
	}

	async readFileAsync() {
		const fs = require('fs').promises;
		try {
			const raw_data = await fs.readFile('./deck.txt', 'utf8');
			return raw_data;
		} catch (err) {
			console.error('Error reading file:', err);
		}
	}

	//naplni deck nejakymi kartami
	async shuffleDeck() {
		var i;
		this.cards = [];
		this.trashedCards = 0;

		for (i in this.players) {
			this.players[i].cards = [];
		}

		// });

		await this.readFileAsync()
			.then((raw_data) => {
				var line_from_file = '';
				var card = '';
				for (i in raw_data) {
					if (raw_data[i] === '\n' || i >= raw_data.length - 1) {
						//zapocitanie posledneho pismena
						if (i >= raw_data.length - 1) line_from_file = line_from_file + raw_data[i];

						//line_from_file ma v sebe cely riadok zo suboru

						//do var card dame nazov karty
						var char_index = 0;
						while (line_from_file[char_index] != ',') {
							card = card + line_from_file[char_index];
							char_index++;
						}
						char_index++;

						//nastavenie suit (znaku) karty
						var suit;
						switch (line_from_file[char_index]) {
							case 'S':
								suit = 'spades';
								break;
							case 'C':
								suit = 'clubs';
								break;
							case 'H':
								suit = 'heart';
								break;
							case 'D':
								suit = 'diamonds';
								break;
						}

						char_index++;
						char_index++; //posun cez dalsiu ciarku

						var rank = '';
						while (line_from_file[char_index] != '.') {
							rank = rank + line_from_file[char_index];
							char_index++;
						}
						rank = parseInt(rank);

						switch (card) {
							case 'BANG':
								this.cards.push(new Bang());
								break;
							case 'VEDLE':
								this.cards.push(new Vedle());
								break;
							case 'DOSTAVNIK':
								this.cards.push(new Dostavnik());
								break;
							case 'WELLSFARGO':
								this.cards.push(new Wellsfargo());
								break;
							case 'PIVO':
								this.cards.push(new Pivo());
								break;
							case 'SALON':
								this.cards.push(new Salon());
								break;
							case 'INDIANI':
								this.cards.push(new Indiani());
								break;
							case 'SCHOFIELD':
								this.cards.push(new Schofield());
								break;
							case 'VOLCANIC':
								this.cards.push(new Volcanic());
								break;
							case 'REMINGTON':
								this.cards.push(new Remington());
								break;
							case 'CARABINE':
								this.cards.push(new Carabine());
								break;
							case 'WINCHESTER':
								this.cards.push(new Winchester());
								break;
							case 'MUSTANG':
								this.cards.push(new Mustang());
								break;
							case 'APPALOOSA':
								this.cards.push(new Appaloosa());
								break;
							case 'CATBALOU':
								this.cards.push(new Catbalou());
								break;
							case 'PANIKA':
								this.cards.push(new Panika());
								break;
							case 'GULOMET':
								this.cards.push(new Gulomet());
								break;
							case 'HOKYNARSTVO':
								this.cards.push(new Hokynarstvo());
								break;
							case 'BAREL':
								this.cards.push(new Barel());
								break;
							case 'VAZENIE':
								this.cards.push(new Vazenie());
								break;
							case 'DYNAMIT':
								this.cards.push(new Dynamit());
								break;
							case 'DUEL':
								this.cards.push(new Duel());
								break;
							default:
								break;
						}

						//teraz je do decku pushnuta nova karta, tak jej iba zmenime suit a cislo:
						var last_card_index = this.cards.length - 1;
						this.cards[last_card_index].suit = suit;
						this.cards[last_card_index].rank = rank;

						card = '';
						line_from_file = '';
					} else {
						line_from_file = line_from_file + raw_data[i];
					}
				}

				//randomize game.cards
				shuffle(this.cards);
			})
			.catch((err) => {
				console.error('An error occurred:', err);
			});

		//nacita karty do game.cards, cize do hlavneho balicka
	}

	dealCards() {
		for (var i in this.players) {
			for (var e = 0; e < this.players[i].HP; e++) {
				//moj kod.... je dobry dufam
				var drawn_card = this.cards.pop();
				this.players[i].cards.push(drawn_card);
			}
		}
	}

	dealOneCard(player_i) {
		var drawn_card = this.cards.pop();
		this.players[player_i].cards.push(drawn_card);
	}

	dealAnyCard(player, card) {
		if (this.players[player].alive) {
			this.players[player].cards.push(this.cards[card]);
			this.cards.splice(card, 1);
		}
	}

	getDistance(sender_i, target_i, card) {
		var turn = sender_i;
		var distance = 0;
		while (turn != target_i) {
			turn++;
			if (turn >= this.players.length) turn = 0;
			if (this.players[turn].alive) distance++;
		}

		var turn = sender_i;
		var distance2 = 0;
		while (turn != target_i) {
			turn--;
			if (turn < 0) turn = this.players.length - 1;
			if (this.players[turn].alive) distance2++;
		}
		if (distance2 < distance) distance = distance2;

		if (this.players[sender_i].cards[card].name == 'Bang') {
			distance =
				distance -
				this.players[sender_i].scope.gun -
				this.players[sender_i].scope.appaloosa +
				this.players[target_i].scope.mustang +
				this.players[target_i].scope.paul_regret -
				this.players[sender_i].scope.rose_doolan;
		} else if (this.players[sender_i].cards[card].name == 'Panika') {
			distance =
				distance -
				this.players[sender_i].scope.appaloosa +
				this.players[target_i].scope.mustang +
				this.players[target_i].scope.paul_regret -
				this.players[sender_i].scope.rose_doolan;
		}

		return distance;
	}

	nextTurn(index_sender, force) {
		//kontrola, ci moze ukoncit kolo
		if (
			this.players[index_sender].character.name != 'sean_mallory' &&
			this.players[index_sender].cards.length > this.players[index_sender].HP &&
			force != true
		) {
			return 0;
		} else {
			this.players[index_sender].bangLeft = this.players[index_sender].bangLimit;

			if (this.turn + 1 < this.players.length) {
				this.turn++;
			} else {
				this.turn = 0;
			}

			//preskoci hracov, ktori su mrtvi
			while (!this.players[this.turn].alive) {
				this.turn++;
				if (this.turn >= this.players.length) this.turn = 0;
			}

			if (this.players[this.turn].character.name == 'sid_ketchum') {
				this.players[this.turn].character.discartedCards = 0;
			}
			if (this.players[this.turn].character.name == 'jose_delgado') {
				this.players[this.turn].character.useLeft = 2;
				console.log(this.players[this.turn].character.useLeft);
			}
			this.moveStage = 0;
			return 1;
		}
	}

	barelLimitCheck(target) {
		this.barelLimit = 0;
		if (target != null) {
			if (this.players[target].character.name == 'jourdonnais') {
				this.barelLimit++;
				//ak striela slab the killer, tak je 2nasobny limit na zaklade schopnosti
				if (this.playedCard == 'Bang' && this.players[this.turn].character.name == 'slab_the_killer')
					this.barelLimit++;
			}
			var i = this.players[target].blueCards.findIndex((card) => card.name == 'Barel');
			if (i >= 0) {
				this.barelLimit++;
				if (this.playedCard == 'Bang' && this.players[this.turn].character.name == 'slab_the_killer')
					this.barelLimit++;
			}
		}
	}

	//checks for game over
	gameOver() {
		var sheriff_i = this.players.findIndex((player) => player.role == 'Sheriff');
		var odpadlik_i = this.players.findIndex((player) => player.role == 'Odpadlik'); //vrati -1, ak nenajde odpadlika

		//kontrola vyhry odpadlika:
		let odpadlik_win = true;
		if (odpadlik_i != -1) {
			//ak je odpadlik v hre
			for (var i in this.players) {
				if (i == odpadlik_i) continue;
				if (this.players[i].alive) {
					odpadlik_win = false;
					break;
				}
			}
			if (odpadlik_win) return { result: true, winner: 'der Odpadlik' };
		}

		//kontrola vyhry banditov:
		//ak nevyhral odpadlik a je mrtvy serif, znamena to, ze vyhrali banditi
		if (!this.players[sheriff_i].alive) return { result: true, winner: 'banditas' };

		//kontrola vyhry serifa
		let sheriff_win = true;
		for (var i in this.players) {
			if (this.players[i].role == 'Bandita' && this.players[i].alive) sheriff_win = false;
		}
		//ak aj su mrtvi banditi a este zije odpadlik, tak serif stale nevyhral:
		if (odpadlik_i != -1 && this.players[odpadlik_i].alive) sheriff_win = false;
		if (sheriff_win) return { result: true, winner: 'Die Polizeiten' };

		//ak zatial nie je vitaz:
		return { result: false, winner: null };
	}

	isFelipePrisonero(target) {
		return this.players[target].prison && this.players[target].character.name == 'felipe_prisonero';
	}

	isInRange(sender, target, card) {
		return this.getDistance(sender, target, card) <= 1 || this.players[sender].cards[card].onRange == false;
	}

	trashCard(card) {
		this.cards.unshift(card);
		this.trashedCards += 1;
	}

	getNextPlayer(player) {
		var nextPlayer = player;
		if (nextPlayer + 1 < this.players.length) {
			nextPlayer++;
		} else {
			nextPlayer = 0;
		}

		//preskoci hracov, ktori su mrtvi
		while (!this.players[nextPlayer].alive) {
			nextPlayer++;
			if (nextPlayer >= this.players.length) nextPlayer = 0;
		}
		return nextPlayer;
	}

	safeBeerCheck(player_index) {
		var pivo_index = this.players[player_index].cards.findIndex((card) => card.name == 'Pivo');

		if (pivo_index != -1) {
			//ak ma pifko, dostane moznost sa zachranit
			this.safeBeer = player_index;
			return true;
		} else {
			this.safeBeer = -1;
			return false;
		}
	}

	update(io) {
		io.emit('update', this);
	}
}

//shamelessly stolen from the internet
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

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

class Role {
	constructor(player) {
		this.player = player;
		this.player.role = null;
	}
}
class Sheriff extends Role {
	constructor(player) {
		super(player);
		this.player.role = 'Sheriff';
		this.player.maxHP++;
		this.player.HP = this.player.maxHP;
	}
}
class Vice extends Role {
	constructor(player) {
		super(player);
		this.player.role = 'Vice';
	}
}
class Odpadlik extends Role {
	constructor(player) {
		super(player);
		this.player.role = 'Odpadlik';
	}
}
class Bandita extends Role {
	constructor(player) {
		super(player);
		this.player.role = 'Bandita';
	}
}

module.exports = Game;
