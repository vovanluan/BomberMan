var menuState = {
	create: function() {
		game.add.button(400, 200, 'startGame', this.play, this);
		game.add.button(390, 300, 'howToPlay', this.howToPlay, this);
	},
	play: function() {
		game.state.start('chooseMode');
	},
	howToPlay: function () {
		game.state.start('howToPlay');
	}
};