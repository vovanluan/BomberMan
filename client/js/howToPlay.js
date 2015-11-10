var howToPlayState = {
	create: function() {
		game.add.text(80, game.world.height - 80, 'CLICK ANYWHERE TO GO BACK', {font: '25px Arial', fill: '#ffffff'});
	},
	update: function() {
		if (game.input.activePointer.leftButton.isDown) {
			game.state.start('menu');
		}
	},

};