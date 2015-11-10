/*function BomberMan(Id, game){
    this.Id = Id;
    this.game = game;
    this.bomberman = game.add.sprite(40, 40, 'bomberman');
}*/
// var welcome = new Phaser.Game(600, 600, Phaser.AUTO, '', { preload: preload1, create: create1});
// function preload1() {
//     welcome.load.image('sky', 'assets/images/sky.png');
// }

// function create1() {
//     welcome.add.sprite(0, 0,' sky');
// }

var game = new Phaser.Game(600, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	

	// Tile maps
	game.load.tilemap('level1', 'assets/tilemaps/maps/level1.csv', null, Phaser.Tilemap.CSV);
	game.load.image('tiles', 'assets/tilemaps/tiles/tileset.png');

    //Load spritesheet
    game.load.spritesheet('bomberman', 'assets/images/Bomberman2.png', 58.67, 43);
    game.load.spritesheet('items', 'assets/images/Items.png');
    game.load.spritesheet('bombexplosion', 'assets/images/Bomb and Explosions.png');
    game.load.spritesheet('bomb', 'assets/images/bomb.png', 35, 35, 3);

    // Font
    game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');

    // Bomb
    game.load.image('bomb_exploision0', 'assets/images/bomb_exploision0.png');
    game.load.image('bomb_exploision1', 'assets/images/bomb_exploision1.png');
    game.load.image('bomb_exploision2', 'assets/images/bomb_exploision2.png');

    game.load.image('sky', 'assets/images/sky.png');

}

var map;
var layer;
var cursors;
var player; // Class
var bpmText;
var bombs;
var tile_size = 40;
var space_keyboard;
var bombs_exploision;

function create() {


    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    game.add.sprite(0, 0, 'sky');
    
    // Map
	map = game.add.tilemap('level1', 40, 40);
    map.addTilesetImage('tiles');
    layer = map.createLayer(0);
    map.setCollisionByExclusion([240], true, layer);
    layer.resizeWorld();

    // Player
    var player_sprite = game.add.sprite(40, 40, 'bomberman');
    
    game.physics.arcade.enable(player_sprite);
    player_sprite.body.setSize(40, 40, 0, 0);
    player_sprite.body.collideWorldBounds = true;

    player_sprite.animations.add('right', [3, 17, 31], 5, false);
    player_sprite.animations.add('left', [1, 15, 29], 5, false);
    player_sprite.animations.add('up', [2, 16, 30], 5, false);
    player_sprite.animations.add('down', [0, 14, 28], 5, false);
    player = new Player('tri', player_sprite);

    
    // Input
    cursors = game.input.keyboard.createCursorKeys();

    // Text output
    bmpText = game.add.bitmapText(150, 10, 'carrier_command', player.name + ' is playing', 16);

    // Bomb
    bombs = game.add.group();
    bombs.enableBody = true;
    bombs_exploision = game.add.group();
    bombs_exploision.enableBody = true;
    //Bomb(1, 2, 1);
    //game.input.keyboard.isDown(Phaser.KeyCode.BACKSPACE);
}


function update() {
	var pos = {x:0, y:0};
	pos.x = this.math.snapToFloor(Math.floor(player.sprite.x), tile_size) / tile_size;
	pos.y = this.math.snapToFloor(Math.floor(player.sprite.y), tile_size) / tile_size;


    game.physics.arcade.collide(player.sprite, layer);
    game.physics.arcade.collide(bombs, player.sprite);
    game.physics.arcade.overlap(bombs_exploision, player.sprite, player_dead, null, this);
    game.physics.arcade.overlap(bombs, bombs_exploision, bomb_explosion_chain, null, this);

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

    if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
    	var exist = {e:false};
    	bombs.forEachAlive(placeBombIfNotExist, this, pos.x, pos.y, exist);
    	if (!exist.e)
    		Bomb(5, pos.x, pos.y);
    }

}
function placeBombIfNotExist(child, posInTile_x, posInTile_y, exist) {
	var posInWorld = getPosFromTile(posInTile_x, posInTile_y);
	if (posInWorld.x == child.x && posInWorld.y == child.y) {
		exist.e = true;
	}

}

function render() {

}

function Player(name, sprite) {
    this.name = name;
    this.bullet_power = 1;
    this.sprite = sprite;
}

/////////////////////////////////////////////////////////////////////

function Bomb(power, pos_x, pos_y) {
	var pos = getPosFromTile(pos_x, pos_y);
	var bomb = bombs.create(pos.x, pos.y, 'bomb');
    game.physics.arcade.enable(bomb);
    bomb.body.immovable = true;
    bomb.body.setSize(40, 40, 0, 0);
    bomb.body.collideWorldBounds = true;
    bomb.frame = 2;
    bomb.animations.add('bomb_static', [0, 1, 2], 1, false);
    bomb.anchor.x = 0.5;
    bomb.anchor.y = 0.5;
    bomb.animations.play('bomb_static');
    game.time.events.add(3000, this.BombExplosion, this, power, pos_x, pos_y, bomb);
}

function BombExplosion(power, posInTile_x, posInTile_y, bomb) {
	duration = 500;

	bomb.kill();

	
	game.physics.arcade.enable(bombs_exploision);
	// Bomb kernel
	var pos = getPosFromTile(posInTile_x, posInTile_y);
    var bomb_apart = bombs_exploision.create(pos.x,pos.y, 'bomb_exploision0');
    bomb_apart.anchor.x = 0.5;
    bomb_apart.anchor.y = 0.5;

    var destroyed_blocks = [];

    // Up
    i=0;
    for (i=1; i<power; i++) {
    	var tile_index = map.getTile(posInTile_x, posInTile_y-i).index;
    	if (tile_index == 240) {
		    pos = getPosFromTile(posInTile_x, posInTile_y-i);
		    var bomb_apart = bombs_exploision.create(pos.x, pos.y, 'bomb_exploision1');
		    bomb_apart.anchor.x = 0.5;
		    bomb_apart.anchor.y = 0.5;
		   	bomb_apart.angle = 90;
		} else {
			if (tile_index == 134) {
			 	explosion_tail(posInTile_x, posInTile_y-i, 'up');
			}
			break;
		}
   	}
   	var tile_index = map.getTile(posInTile_x, posInTile_y-i).index;
    if (tile_index == 240) {
	   	pos = getPosFromTile(posInTile_x, posInTile_y-i);
	    var bomb_apart = bombs_exploision.create(pos.x, pos.y, 'bomb_exploision2');
	    bomb_apart.anchor.x = 0.5;
	    bomb_apart.anchor.y = 0.5;
	   	bomb_apart.angle = -90;
	} else {
		if (tile_index == 134) {
		 	explosion_tail(posInTile_x, posInTile_y-i, 'up');
		}
	}

   	// Down
   	for (i=1; i<power; i++) {
   		var tile_index = map.getTile(posInTile_x, posInTile_y+i).index;
    	if (tile_index == 240) {
		    pos = getPosFromTile(posInTile_x, posInTile_y+i);
		    var bomb_apart = bombs_exploision.create(pos.x, pos.y, 'bomb_exploision1');
		    bomb_apart.anchor.x = 0.5;
		    bomb_apart.anchor.y = 0.5;
		   	bomb_apart.angle = 90;
		} else {
			if (tile_index == 134) {
			 	explosion_tail(posInTile_x, posInTile_y+i, 'down');
		   	}
			break;
		}
   	}

   	var tile_index = map.getTile(posInTile_x, posInTile_y+i).index;
    if (tile_index == 240) {
	   	pos = getPosFromTile(posInTile_x, posInTile_y+i);
	    var bomb_apart = bombs_exploision.create(pos.x, pos.y, 'bomb_exploision2');
	    bomb_apart.anchor.x = 0.5;
	    bomb_apart.anchor.y = 0.5;
	   	bomb_apart.angle = 90;
	} else {
		if (tile_index == 134) {
		 	explosion_tail(posInTile_x, posInTile_y+i, 'down');
		}
	}

   	// Left
   	for (i=1; i<power; i++) {
   		var tile_index = map.getTile(posInTile_x-i, posInTile_y).index;
    	if (tile_index == 240) {
		    pos = getPosFromTile(posInTile_x-i, posInTile_y);
		    var bomb_apart = bombs_exploision.create(pos.x, pos.y, 'bomb_exploision1');
		    bomb_apart.anchor.x = 0.5;
		    bomb_apart.anchor.y = 0.5;
		   	bomb_apart.angle = 0;
		} else {
			if (tile_index == 134) {
				explosion_tail(posInTile_x-i, posInTile_y, 'left');
			}
			break;
		}
   	}
	var tile_index = map.getTile(posInTile_x-i, posInTile_y).index;
    if (tile_index == 240) {
	   	pos = getPosFromTile(posInTile_x-i, posInTile_y);
	    var bomb_apart = bombs_exploision.create(pos.x, pos.y, 'bomb_exploision2');
	    bomb_apart.anchor.x = 0.5;
	    bomb_apart.anchor.y = 0.5;
	   	bomb_apart.angle = 180;
	} else {
		if (tile_index == 134) {
			explosion_tail(posInTile_x-i, posInTile_y, 'left');
		}
	}

   	// Right
	for (i=1; i<power; i++) {
		var tile_index = map.getTile(posInTile_x+i, posInTile_y).index;
    	if (tile_index == 240) {
		    pos = getPosFromTile(posInTile_x+i, posInTile_y);
		    var bomb_apart = bombs_exploision.create(pos.x, pos.y, 'bomb_exploision1');
		    bomb_apart.anchor.x = 0.5;
		    bomb_apart.anchor.y = 0.5;
		   	bomb_apart.angle = 0;
		} else {
			if (tile_index == 134) {
				explosion_tail(posInTile_x+i, posInTile_y, 'right');
			}
			break;
		}
   	}

   	var tile_index = map.getTile(posInTile_x+i, posInTile_y).index;
    if (tile_index == 240) {
	   	pos = getPosFromTile(posInTile_x+i, posInTile_y);
	    var bomb_apart = bombs_exploision.create(pos.x, pos.y, 'bomb_exploision2');
	    bomb_apart.anchor.x = 0.5;
	    bomb_apart.anchor.y = 0.5;
	   	bomb_apart.angle = 0;
   	} else {
   		if (tile_index == 134) {
   			explosion_tail(posInTile_x+i, posInTile_y, 'right');
   		}
   	}

   game.time.events.add(duration, bomb_exploision_end, this, bombs_exploision, destroyed_blocks);
}

function getPosFromTile(tile_x, tile_y) {
	var posx = tile_x*tile_size + 0.5*tile_size;
	var posy = tile_y*tile_size + 0.5*tile_size;

	return {
		x:posx, y:posy
	};
}

function bomb_exploision_end(bombs_exploision, destroyed_blocks) {
	bombs_exploision.removeAll(true); // Remove then destroy
}

function player_dead() {
	console.log('Player is deaded');
}

function explosion_tail(posInTile_x, posIntile_y, direction) {
	map.removeTile(posInTile_x, posIntile_y);
   	map.putTile(240, posInTile_x, posIntile_y);
   	var posInWorld = getPosFromTile(posInTile_x, posIntile_y);
	var bomb_apart = bombs_exploision.create(posInWorld.x, posInWorld.y, 'bomb_exploision2');
    
    bomb_apart.anchor.x = 0.5;
    bomb_apart.anchor.y = 0.5;
    if (direction == 'down') {
   		bomb_apart.angle = 90;
    }
   	else if (direction == 'up') {
   		bomb_apart.angle = -90;
   	}
   	else if (direction == 'right') {
   		bomb_apart.angle = 0;	
   	}
   	else {
   		bomb_apart.angle = 180;
   	}
}

function bomb_explosion_chain(bomb, bomb_exploision) {
	BombExplosion(1, 1, 1, bomb);
}