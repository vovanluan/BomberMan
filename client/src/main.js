/*function BomberMan(Id, game){
    this.Id = Id;
    this.game = game;
    this.bomberman = game.add.sprite(40, 40, 'bomberman');
}*/

function Enemy(Id, game, x, y) {
    this.Id = Id;
    this.game = game;
    this.enemy = game.add.sprite(x, y, 'easyenemies');
}
var game = new Phaser.Game(1000, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

function preload() {
	// Tilemaps are split into two parts: the actual map data and the tilesets to render the map

	// First, load the actual map data from a CSV file
	game.load.tilemap('level1', 'assets/tilemaps/maps/level1.csv', null, Phaser.Tilemap.CSV);
    
	//Next we load the tilesets

	game.load.image('tiles', 'assets/tilemaps/tiles/tileset.png');

    //Load spritesheet

    game.load.spritesheet('bomberman', 'assets/images/Bomberman2.png', 58.67, 43);

    game.load.spritesheet('items', 'assets/images/Items.png');
    game.load.spritesheet('bombexplosion', 'assets/images/Bomb&Explosions.png');
    game.load.spritesheet('easyenemies', 'assets/images/Enemies.png', 36, 32, 16, 0, 24);
}

var map;
var layer;
var cursors;
var player;
var booms;
var easyenemies;
var randomX;
var randomY;

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

    // easyenemies
    easyenemies = game.add.group();
    easyenemies.enableBody = true;

    var numEasyEnemies = Math.floor(Math.random() * 4 + 1);
    for (var i = 0; i < numEasyEnemies; i++) {
        getRandomCoordinates();
        var easyEnemy = easyenemies.create(randomX, randomY, 'easyenemies');
        easyEnemy.body.velocity.x = 30;
        easyEnemy.body.velocity.y = 30;
    }

    // Create animations for all easyenemies in this group
    easyenemies.callAll('animations.add', 'animations', 'walk', [0, 1, 2], 5, false);

    // Player
    player = game.add.sprite(40, 40, 'bomberman');
    game.physics.arcade.enable(player);
    player.body.setSize(40, 40, 0, 0);
    player.body.collideWorldBounds = true;

    player.animations.add('right', [3, 17, 31], 5, false);
    player.animations.add('left', [1, 15, 29], 5, false);
    player.animations.add('up', [2, 16, 30], 5, false);
    player.animations.add('down', [0, 14, 28], 5, false);

    layer.debug = true;

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {

    game.physics.arcade.collide(easyenemies, layer);
    game.physics.arcade.collide(player, layer);

    // Easy enemies
    easyenemies.callAll('play', null, 'walk');
    var changeDirection = 1;
    easyenemies.forEach(easyEnemyMovement, this, changeDirection);

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.right.isDown)
    {
        //  Move to the left
        player.body.velocity.x = +150;
        player.animations.play('right');
        //player.animations.play('left');
    }
    else if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        player.animations.play('left');

        //player.animations.play('left');
    }
    else if (cursors.up.isDown)
    {
        //  Move to the left
        player.body.velocity.y = -150;
        player.animations.play('up');
    }
    else if (cursors.down.isDown)
    {
        //  Move to the left
        player.body.velocity.y = +150;
        player.animations.play('down');
    }
    else {
        player.animations.stop();

        player.frame = 0;

    }
}
function easyEnemyMovement(easyEnemy, changeDirection) {
    if (easyEnemy.body.blocked.left) {
        easyEnemy.body.velocity.x = 30;
    }
    else if (easyEnemy.body.blocked.right) {
        easyEnemy.body.velocity.x = -30;
    }
    else if (easyEnemy.body.blocked.up) {
        easyEnemy.body.velocity.y = 30;
    }
    else if (easyEnemy.body.blocked.down) {
        easyEnemy.body.velocity.y = -30;
    }
}
function getRandomCoordinates(){
            var randX = Math.floor((Math.random() * (game.world.width/40)));
            var randY = Math.floor((Math.random() * (game.world.height/40)));
            var tileId = map.getTile(randX,randY,layer).index;
            if (tileId != 240 || (randX == 1 && randY == 1)) {
                getRandomCoordinates();
            }else{
                randomX = randX * 40;
                randomY = randY * 40;
                return;
            }
        }
function render() {
    game.debug.body(player)
}
