/*function BomberMan(Id, game){
    this.Id = Id;
    this.game = game;
    this.bomberman = game.add.sprite(40, 40, 'bomberman');
}*/
var game = new Phaser.Game(600, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	// Tilemaps are split into two parts: the actual map data and the tilesets to render the map

	// First, load the actual map data from a CSV file
	game.load.tilemap('level1', 'assets/tilemaps/maps/level1.csv', null, Phaser.Tilemap.CSV);
    
	//Next we load the tilesets
	game.load.image('tiles', 'assets/tilemaps/tiles/tileset.png');

    //Load spritesheet
    game.load.spritesheet('bomberman', 'assets/images/Bomberman.png', 34, 42, 43, 0, 26);
    game.load.spritesheet('items', 'assets/images/Items.png');
    game.load.spritesheet('bombexplosion', 'assets/images/Bomb and Explosions.png');

    
}

var map;
var layer;
var cursors;
var player;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it
	map = game.add.tilemap('level1', 40, 40);

    //  Now add in the tileset
    map.addTilesetImage('tiles');

    //  Creates our layer
    layer = map.createLayer(0);

    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();

    layer.debug = true;

    map.setCollision([127, 135], true, layer, true);

    //  Player
    player = game.add.sprite(40, 40, 'bomberman');
    player.animations.add('left', [1, 16, 31], 10, true);
    player.animations.add('right', [3, 18, 33], 10, true);
    player.animations.add('up', [2, 17, 32], 10, true);
    player.animations.add('down', [0, 15, 30], 10, true);

    // http://phaser.io/docs/2.4.4/Phaser.Physics.Arcade.Body.html#setSize
    // player.body.setSize(34, 42, 0, 0);

    game.physics.enable(player);

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    //game.physics.arcade.collide(player, layer);

    player.body.velocity.set(0);

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -100;
        player.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 100;
        player.play('right');
    }
    else if (cursors.up.isDown)
    {
        player.body.velocity.y = -100;
        player.play('up');
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 100;
        player.play('down');
    }
    else
    {
        player.animations.stop();
    }
}
function render() {
}