function BomberMan(Id, game){
    this.Id = Id;
    this.game = game;
    this.bomberman = game.add.sprite(40, 40, 'bomberman');
}
var game = new Phaser.Game(600, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	// Tilemaps are split into two parts: the actual map data and the tilesets to render the map

	// First, load the actual map data from a CSV file
	game.load.tilemap('level1', 'assets/tilemaps/maps/level1.csv', null, Phaser.Tilemap.CSV);
    
	//Next we load the tilesets
	game.load.image('tiles', 'assets/tilemaps/tiles/tileset.png');

    //Load spritesheet
    game.load.spritesheet('bomberman', 'assets/images/Bomberman2.png', 34, 42);
    game.load.spritesheet('items', 'assets/images/Items.png');
    game.load.spritesheet('bombexplosion', 'assets/images/Bomb and Explosions.png');

    
}

var map;
var layer;
var cursors;
var player;

function create() {
    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
	map = game.add.tilemap('level1', 40, 40);

    //  Now add in the tileset
    map.addTilesetImage('tiles');

    //  Creates our layer
    layer = map.createLayer(0);

    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();

    // Create Player
    //player = new BomberMan(0 , game);
    player = game.add.sprite(40, 40, 'bomberman');
}

function update() {
}
