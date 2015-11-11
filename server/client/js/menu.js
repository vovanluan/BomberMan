var menuState = {
	create: function() {
		var sprite = game.add.sprite(0 , 0, 'menu');
		sprite.scale.setTo(1.5625, 1.5625);
		var bar = game.add.graphics();
	    bar.beginFill(0x000000, 0.2);
	    bar.drawRect(0, 100, 1000, 100);

	    var style = { font: "bold 50px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

	    //  The Text is positioned at 0, 100
	    text = game.add.text(0, 0, "BOMBERMAN", style);
	    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

	    //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
	    text.setTextBounds(0, 100, 1000, 100);
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