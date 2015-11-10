var finishState = {
	create: function() {
		var win = game.add.text(80, game.world.height - 80, 'YOU WON', {font: '25px Arial', fill: '#ffffff'});
		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		wkey.onDown.addOnce(this.restart, this);
	},
	restart: function() {
		game.state.start('play');
	}
};