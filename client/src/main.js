/*function BomberMan(Id, game){
    this.Id = Id;
    this.game = game;
    this.bomberman = game.add.sprite(40, 40, 'bomberman');
}*/
var game = new Phaser.Game(600, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	

	// Tile maps
	game.load.tilemap('level1', 'assets/tilemaps/maps/level1.csv', null, Phaser.Tilemap.CSV);
	game.load.image('tiles', 'assets/tilemaps/tiles/tileset.png');

    //Load spritesheet
    game.load.spritesheet('bomberman', 'assets/images/Bomberman2.png', 58.67, 43);
    game.load.spritesheet('items', 'assets/images/Items.png');
    game.load.spritesheet('bombexplosion', 'assets/images/Bomb and Explosions.png');

    // Font
    game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');

}

var map;
var layer;
var cursors;
var player;
var booms;
var bpmText;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it

	map = game.add.tilemap('level1', 40, 40);

    //  Now add in the tileset
    map.addTilesetImage('tiles');

    layer = map.createLayer(0);

    map.setCollisionByExclusion([240], true, layer);
    

    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();


    var player_sprite = game.add.sprite(40, 40, 'bomberman');
    game.physics.arcade.enable(player_sprite);
    player_sprite.body.setSize(40, 40, 0, 0);
    player_sprite.body.collideWorldBounds = true;

    player_sprite.animations.add('right', [3, 17, 31], 5, false);
    player_sprite.animations.add('left', [1, 15, 29], 5, false);
    player_sprite.animations.add('up', [2, 16, 30], 5, false);
    player_sprite.animations.add('down', [0, 14, 28], 5, false);
    player = new Player('tri', player_sprite);

    booms = game.add.group();
    booms.enableBody = true;
    var boom = booms.create(0, game.world.height - 64, 'bomberman', 10);

    //layer.debug = true;

    // Input
    cursors = game.input.keyboard.createCursorKeys();

    // Text output
    bmpText = game.add.bitmapText(150, 10, 'carrier_command', player.name + ' is playing', 16);
}

function update() {


    game.physics.arcade.collide(player.sprite, layer);
    player.sprite.body.velocity.x = 0;
    player.sprite.body.velocity.y = 0;

    if (cursors.right.isDown)
    {
        //  Move to the left
        player.sprite.body.velocity.x = +150;
        player.sprite.animations.play('right');
        //player.animations.play('left');
    }
    else if (cursors.left.isDown)
    {
        //  Move to the left
        player.sprite.body.velocity.x = -150;
        player.sprite.animations.play('left');

        //player.animations.play('left');
    }
    else if (cursors.up.isDown)
    {
        //  Move to the left
        player.sprite.body.velocity.y = -150;
        player.sprite.animations.play('up');
    }
    else if (cursors.down.isDown)
    {
        //  Move to the left
        player.sprite.body.velocity.y = +150;
        player.sprite.animations.play('down');
    }
    else {
        player.sprite.animations.stop();

        player.sprite.frame = 0;
    }

}
function render() {

}

function Player(name, sprite) {
    this.name = name;
    this.bullet_power = 1;
    this.sprite = sprite;
}
