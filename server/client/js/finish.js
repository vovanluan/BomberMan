var finishState = {
	init: function(loose) {
		this.loose = loose;
	},
	create: function() {
		var sprite = game.add.sprite(0 , 50, 'finishBackground');
		if (this.loose) {
			game.add.text(300, 100, 'YOU LOSE!', {font: '60px Arial', fill: '#19de65'});			
		}
		else {
			game.add.text(300, 100, 'YOU WON!', {font: '60px Arial', fill: '#19de65'});				
		}
		game.add.button(400, 400, 'playAgain', this.playAgain, this);
	},
	playAgain: function() {
		game.state.start('chooseMode');
	}
};