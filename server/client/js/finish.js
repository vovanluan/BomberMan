var finishState = {
	create: function() {
		var sprite = game.add.sprite(0 , 50, 'finishBackground');
		game.add.button(400, 200, 'playAgain', this.playAgain, this);
	},
	playAgain: function() {
		game.state.start('chooseMode');
	}
};