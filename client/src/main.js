var TILE_WIDTH = 40;
var TILE_HEIGHT = 40;
var EASY_ENEMIES_SPEED = 50;
var NORMAL_ENEMIES_SPEED = 35;
var PLAYER_SPEED = 100;
function BomberMan(Id, game, x, y) {
    this.Id = Id;
    this.game = game;
    this.sprite = game.add.sprite(x, y, 'bomberman');
    this.numberOfBomb = 1;
    this.speed = PLAYER_SPEED;
    this.power = 1;
}
var game = new Phaser.Game(1000, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

function preload() {
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
}

var map;
var layer;
var cursors;
var player;
var booms;
var items;
var easyenemies;
var normalenemies;
var randomX;
var randomY;


//debug
var style = { font: "20px Arial", fill: "#ff0044", align: "center" };
var text;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  Because we're loading CSV map data we have to specify the tile size here or we can't render it

	map = game.add.tilemap('level1', TILE_WIDTH, TILE_HEIGHT);

    //  Now add in the tileset
    map.addTilesetImage('tiles');

    layer = map.createLayer(0);

    map.setCollisionByExclusion([240], true, layer);
    

    //  This resizes the game world to match the layer dimensions
    layer.resizeWorld();

    // Ease Enemies
    easyenemies = game.add.group();
    easyenemies.enableBody = true;
    var numEasyEnemies = Math.floor(Math.random() * 2 + 2);
    for (var i = 0; i < numEasyEnemies; i++) {
        getRandomCoordinates();
        easyenemies.create(randomX, randomY, 'easyenemies');
    }
    easyenemies.setAll('body.velocity.x', EASY_ENEMIES_SPEED);
    easyenemies.setAll('body.velocity.y', EASY_ENEMIES_SPEED);
    easyenemies.callAll('animations.add', 'animations', 'walk', [0, 1, 2], 5, false);
    easyenemies.callAll('animations.add', 'animations', 'die', [3, 4, 5, 6, 7], 5, false);

    // Normal Enemies
    normalenemies = game.add.group();
    normalenemies.enableBody = true;
    var numNormalEnemies = Math.floor(Math.random() * 2 + 1);
    for (var t = 0; t < numNormalEnemies; t++) {
        getRandomCoordinates();
        normalenemies.create(randomX, randomY, 'easyenemies', 8);
    }
    normalenemies.setAll('body.velocity.x', NORMAL_ENEMIES_SPEED);
    normalenemies.setAll('body.velocity.y', NORMAL_ENEMIES_SPEED);
    normalenemies.callAll('animations.add', 'animations', 'walk', [8, 9, 10], 5, false);
    normalenemies.callAll('animations.add', 'animations', 'die', [11, 12, 13], 5, false);

    // Items 
    items = game.add.group();
    items.enableBody = true;
    items.setAll('')

    // Player
    player = new BomberMan(0, game, 40, 40);
    game.physics.arcade.enable(player.sprite);
    // Fix size player
    player.sprite.body.setSize(34, 34, 0, 4);
    player.sprite.body.collideWorldBounds = true;

    player.sprite.animations.add('right', [3, 17, 31], 5, false);
    player.sprite.animations.add('left', [1, 15, 29], 5, false);
    player.sprite.animations.add('up', [2, 16, 30], 5, false);
    player.sprite.animations.add('down', [0, 14, 28], 5, false);
    player.sprite.animations.add('die', [5, 6, 18, 19, 20, 32, 33], 10, false);

    layer.debug = true;

    cursors = game.input.keyboard.createCursorKeys();
    items.create(120, 40, 'items', 2);
    
}

function update() {

    game.physics.arcade.collide(easyenemies, layer);
    game.physics.arcade.collide(normalenemies, layer);
    game.physics.arcade.collide(player.sprite, layer);

    // OVERLAP

    game.physics.arcade.overlap(player.sprite, easyenemies, playerHitEnemy, null, this);
    game.physics.arcade.overlap(player.sprite, normalenemies, playerHitEnemy, null, this);
    game.physics.arcade.overlap(player.sprite, items, playerHitItem, null, this);

    // Easy enemies
    easyenemies.callAll('play', null, 'walk');
    easyenemies.forEach(easyEnemyMovement, this, true, EASY_ENEMIES_SPEED);

    //Normal enemies
    normalenemies.callAll('play', null, 'walk');
    normalenemies.forEach(normalEnemyMovement, this, true, player);

    player.sprite.body.velocity.x = 0;
    player.sprite.body.velocity.y = 0;

    if (!player.sprite.alive) {
        player.sprite.animations.play('die');
    }
    else if (cursors.right.isDown) {
        //  Move to the right
        player.sprite.body.velocity.x = player.speed;
        player.sprite.animations.play('right');
    }
    else if (cursors.left.isDown) {
        //  Move to the left
        player.sprite.body.velocity.x = -player.speed;
        player.sprite.animations.play('left');
    }
    else if (cursors.up.isDown) {
        //  Move up
        player.sprite.body.velocity.y = -player.speed;
        player.sprite.animations.play('up');
    }
    else if (cursors.down.isDown) {
        //  Move down
        player.sprite.body.velocity.y = player.speed;
        player.sprite.animations.play('down');
    }
    else {
        player.sprite.animations.stop();
        player.sprite.frame = 0;
    }
}
function easyEnemyMovement(easyEnemy, speed) {
    if (easyEnemy.body.blocked.left) {
        easyEnemy.body.velocity.x = speed;
    }
    else if (easyEnemy.body.blocked.right) {
        easyEnemy.body.velocity.x = -speed;
    }
    else if (easyEnemy.body.blocked.up) {
        easyEnemy.body.velocity.y = speed;
    }
    else if (easyEnemy.body.blocked.down) {
        easyEnemy.body.velocity.y = -speed;
    }
}

function normalEnemyMovement(normalEnemy, player) {
    var normalEnemyTile = map.getTileWorldXY(normalEnemy.body.position.x, normalEnemy.body.position.y, 40, 40, layer);
    var playerTile = map.getTileWorldXY(player.sprite.body.position.x, player.sprite.body.position.y, 40, 40, layer);
    // Enemy and player are in the same column
    var canEnemySeePlayer = true;
    if (normalEnemyTile.x == playerTile.x) {
        if (normalEnemyTile.y < playerTile.y) {
            for (var i = normalEnemyTile.y; i < playerTile.y; i++) {
                if (map.getTile(normalEnemyTile.x, i).index != 240) {
                    canEnemySeePlayer = false;
                    break;
                }
            }
        }
        else {
            for (var i = playerTile.y; i < normalEnemyTile.y; i++) {
                if (map.getTile(normalEnemyTile.x, i).index != 240) {
                    canEnemySeePlayer = false;
                    break;
                }
            }   
        }
    }
    // Enemy and player are in the same row
    else if (normalEnemyTile.y == playerTile.y) {
        if (normalEnemyTile.x < playerTile.x) {
            for (var i = normalEnemyTile.x; i < playerTile.x; i++) {
                if (map.getTile(i, normalEnemyTile.y).index != 240) {
                    canEnemySeePlayer = false;
                    break;
                }
            }            
        }
        else {
            for (var i = playerTile.x; i < normalEnemyTile.x; i++) {
                if (map.getTile(i, normalEnemyTile.y).index != 240) {
                    canEnemySeePlayer = false;
                    break;
                }
            }            
        }
    }
    else {
        canEnemySeePlayer = false;
    }

    if (canEnemySeePlayer) {
        game.physics.arcade.moveToObject(normalEnemy, player.sprite, NORMAL_ENEMIES_SPEED);
    }
    else {
        easyEnemyMovement(normalEnemy, NORMAL_ENEMIES_SPEED);
    }
}
function playerHitEnemy(sprite, enemy) {
    if (sprite.alive) {
        sprite.animations.play('die');
        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;
        sprite.alive = false;
    }
}
function playerHitItem(sprite, item) {
    if (item.frame == 0) {
        player.numberOfBomb += 1;
    }
    else if (item.frame == 1) {
        player.power += 1;
    }
    else if (item.frame == 2) {
        player.speed += 50;
    }
    item.kill();
    map.putTile(240, item.body.position.x, item.body.position.y, layer);
}
function getRandomCoordinates(){
            var randX = Math.floor((Math.random() * (game.world.width/TILE_WIDTH)));
            var randY = Math.floor((Math.random() * (game.world.height/TILE_HEIGHT)));
            var tileId = map.getTile(randX,randY,layer).index;
            if (tileId != 240 || (randX == 1 && randY == 1)) {
                getRandomCoordinates();
            }else{
                randomX = randX * TILE_WIDTH;
                randomY = randY * TILE_HEIGHT;
                return;
            }
        }
function render() {
}

function removeBlock(x, y) {
    map.removeTile(x, y, layer);
    var rand = Math.random();
    // Create Bomb Item
    if (rand < 0.1) {
        items.create(TILE_WIDTH * x, TILE_HEIGHT * y, 'items', 0);
    }
    // Create Power Item: Increase range
    else if (rand < 0.2) {
        items.create(TILE_WIDTH * x, TILE_HEIGHT * y, 'items', 1);
    }
    else if (rand < 0.3) {
        items.create(TILE_WIDTH * x, TILE_HEIGHT *y, 'items', 2);
    }
    else {
        map.putTile(240, x, y, layer);
    }
}
