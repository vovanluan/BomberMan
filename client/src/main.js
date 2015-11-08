var game = new Phaser.Game(512, 512, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	// Tilemaps are split into two parts: the actual map data and the tilesets to render the map

	// First, load the actual map data from a CSV file
	game.load.tilemap('level1', 'assets/tilemaps/maps/level1.csv', null, Phaser.Tilemap.CSV);
    
	//Next we load the tilesets
	game.load.image('tiles', 'assets/tilemaps/tiles/tiles.png');
    
}

var map;
var layer;
var cursors;
var player;

function create() {
    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
	map = game.add.tilemap('level1', 16, 16);

    //  Now add in the tileset
    map.addTilesetImage('tiles');

    //  Creates our layer
    layer = map.createLayer(0);

    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();
}

function update() {
}
