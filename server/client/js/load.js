var loadState = {
	preload: function() {
		// Tile maps
		game.load.tilemap('level1', 'assets/tilemaps/maps/level1.csv', null, Phaser.Tilemap.CSV);
		game.load.image('tiles', 'assets/tilemaps/tiles/tileset.png');

	    //Load spritesheet


	    game.load.spritesheet('bomb', 'assets/images/bomb.png', 35, 35, 3);

	    // Font
	    game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');

	    // Bomb
	    game.load.image('bomb_exploision0', 'assets/images/bomb_exploision0.png');
	    game.load.image('bomb_exploision1', 'assets/images/bomb_exploision1.png');
	    game.load.image('bomb_exploision2', 'assets/images/bomb_exploision2.png');
	    game.load.image('startGame', 'assets/images/startButton.png');
	    game.load.image('howToPlay', 'assets/images/howToPlay.png');
	    game.load.image('playOnline', 'assets/images/playOnline.png');
	    game.load.image('playAgainstBot', 'assets/images/playAgainstBot.png');	
	    game.load.image('playAgain', 'assets/images/playAgain.png');
	    game.load.image('room1', 'assets/images/room1.png');	    
	    game.load.image('room2', 'assets/images/room2.png');	    
	    game.load.image('menu', 'assets/images/menu.png');
	    game.load.image('chooseModeBackground', 'assets/images/chooseModeBackground.jpg');
	    game.load.image('chooseRoomBackground', 'assets/images/chooseRoomBackground.jpg');	 
	    game.load.image('finishBackground', 'assets/images/finishBackground.jpg');	
	    game.load.audio('bom_no_sound','assets/sound/bom_no.mp3');
	    game.load.audio('an_vat_pham_sound','assets/sound/an_vat_pham.mp3');
	    game.load.audio('dat_bom_sound','assets/sound/dat_bom_sound.mp3');
	    game.load.audio('die_sound','assets/sound/die_sound.mp3');
	    game.load.audio('nhac_nen','assets/sound/nhac_nen.mp3'); 	       


	    //Fix size player
	    game.load.spritesheet('bomberman', 'assets/images/BomberMan_Luan.png', 34, 42, 42, 0, 26);

	    game.load.spritesheet('items', 'assets/images/Items.png', 42, 42, 16, 4, 4);
	    game.load.spritesheet('bombexplosion', 'assets/images/Bomb&Explosions.png');
	    game.load.spritesheet('easyenemies', 'assets/images/Enemies.png', 36, 32, 16, 0, 24);
	},

	create: function() {
		background_music = game.add.audio('nhac_nen',1,true);
		background_music.play();
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start('menu');
	}

};