var finishState = {
	create: function() {
		var winLabel = game.add.text( 80, 80, 'YOU WON');
		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		wkey.onDown.addOnce(this.restart, this);
	},
	restart: function() {
		game.state.start('play');
	}
};