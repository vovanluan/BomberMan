var chooseModeState = {
	create: function() {
		game.add.button(400, 200, 'playOnline', this.playOnline, this);
		game.add.button(360, 300, 'playAgainstBot', this.playAgainstBot, this);
	},
	playOnline: function() {
		game.state.start('chooseRoom');
	},
	playAgainstBot: function () {
		game.state.start('playAgainstBot');
	}
};