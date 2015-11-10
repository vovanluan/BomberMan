var loadState = {
	preload: function() {
		// Tilemaps are split into two parts: the actual map data and the tilesets to render the map

		// First, load the actual map data from a CSV file
		game.load.tilemap('level1', 'assets/tilemaps/maps/level1.csv', null, Phaser.Tilemap.CSV);
	    
		//Next we load the tilesets
		game.load.image('tiles', 'assets/tilemaps/tiles/tileset.png');

	    //Load spritesheet

	    //Fix size player
	    game.load.spritesheet('bomberman', 'assets/images/BomberMan_Luan.png', 34, 42, 42, 0, 26);

	    game.load.spritesheet('items', 'assets/images/Items.png', 42, 42, 16, 4, 4);
	    game.load.spritesheet('bombexplosion', 'assets/images/Bomb&Explosions.png');
	    game.load.spritesheet('easyenemies', 'assets/images/Enemies.png', 36, 32, 16, 0, 24);
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.state.start('menu');
	}

};