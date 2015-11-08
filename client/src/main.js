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

	game.load.image('tiles', 'assets/tilemaps/tiles/tiles.png');

	

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
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it

	map = game.add.tilemap('level1', 40, 40);

    //  Now add in the tileset
    map.addTilesetImage('tiles');

    layer = map.createLayer(0);

    map.setCollisionByExclusion([196], true, layer);
    

    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();


    player = game.add.sprite(40, 40, 'bomberman');
    game.physics.arcade.enable(player);
    player.body.setSize(10, 14, 2, 1);
    player.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();
    console.log(player);
    console.log(layer);

}

function update() {

    game.physics.arcade.collide(player, layer);
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.right.isDown)
    {
        //  Move to the left
        player.body.velocity.x = +150;

        //player.animations.play('left');
    }
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        //player.animations.play('left');
    }
    if (cursors.up.isDown)
    {
        //  Move to the left
        player.body.velocity.y = -150;

        //player.animations.play('left');
    }
    if (cursors.down.isDown)
    {
        //  Move to the left
        player.body.velocity.y = +150;

        //player.animations.play('left');
    }
}
