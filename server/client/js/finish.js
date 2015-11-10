var finishState = {
	create: function() {
		game.add.button(400, 200, 'playAgain', this.playAgain, this);
	},
	playAgain: function() {
		game.state.start('chooseMode');
	}
};