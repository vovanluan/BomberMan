var TILE_WIDTH = 40;
var TILE_HEIGHT = 40;
var EASY_ENEMIES_SPEED = 50;
var NORMAL_ENEMIES_SPEED = 35;
var PLAYER_SPEED = 100;
var lastTime = 0;

var test =0 ;
function BomberMan(Id, game, x, y) {
    this.Id = Id;
    this.game = game;
    if (this.Id == 0) {
        this.sprite = game.add.sprite(x, y, 'bomberman');       
    }
    else {
        this.sprite = game.add.sprite(x, y, 'bomberman', 7);
    }
    this.numberOfBomb = 10;
    this.bomb_available = 0;
    this.speed = PLAYER_SPEED;
    this.power = 1;
}


function playerDeath(sprite, enemy) {
    if (sprite.alive) {
        sprite.animations.play('die');
        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;
        sprite.alive = false;
        game.time.events.add(Phaser.Timer.SECOND, function() {
            sprite.kill();   
        })
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
    
    bomb.power = power;
    bomb.posInTile_x = pos_x;
    bomb.posInTile_y = pos_y;

    var clock = game.time.create(false);
    clock.add(3000, this.BombExplosion, this, power, pos_x, pos_y, bomb, true);
    clock.start();
    bomb.clock = clock;

    return bomb;
}

function BombExplosion(power, posInTile_x, posInTile_y, bomb, isTimeUp) {
    duration = 500;

    bomb.kill();
    //bomb.destroy();
    if (!isTimeUp) {
        bomb.clock.pause();
    }
    
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
    var posx = tile_x*TILE_WIDTH + 0.5*TILE_WIDTH;
    var posy = tile_y*TILE_WIDTH + 0.5*TILE_WIDTH;

    return {
        x:posx, y:posy
    };
}
function getPosTile(posInWorld_x, posInWorld_y) {
    var pos={x:0, y:0};
    pos.x = game.math.snapToFloor(Math.floor(posInWorld_x), TILE_WIDTH) / TILE_WIDTH;
    pos.y = game.math.snapToFloor(Math.floor(posInWorld_y), TILE_WIDTH) / TILE_WIDTH;
    return pos;
}

function bomb_exploision_end(bombs_exploision, destroyed_blocks) {
    
    bombs_exploision.removeAll(true); // Remove then destroy
    player.bomb_available --;
}

function explosion_tail(posInTile_x, posIntile_y, direction) {
    map.removeTile(posInTile_x, posIntile_y, layer);
    var rand = Math.random();
    map.putTile(240, posInTile_x, posIntile_y, layer);
    // Create Bomb Item

    if (rand < 0.15) {
        items.create(TILE_WIDTH * posInTile_x, TILE_HEIGHT * posIntile_y, 'items', 0);
    }
    // Create Power Item: Increase range
    else if (rand < 0.3) {
        items.create(TILE_WIDTH * posInTile_x, TILE_HEIGHT * posIntile_y, 'items', 1);
    }
    // Create increasing speed Item
    else if (rand < 0.4) {
        items.create(TILE_WIDTH * posInTile_x, TILE_HEIGHT * posIntile_y, 'items', 2);
    }


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

    BombExplosion(bomb.power, bomb.posInTile_x, bomb.posInTile_y, bomb);
}

function placeBombIfNotExist(child, posInTile_x, posInTile_y, exist) {
    var posInWorld = getPosFromTile(posInTile_x, posInTile_y);
    if (posInWorld.x == child.x && posInWorld.y == child.y) {
        exist.e = true;
    }

}

var playOnlineState= {
    players : {},
	create:function () {
        socket.on("notifyRoom1", function (data) {
            this.players = data.players;
            this.playerId = data.players.length;
            this.player =  new BomberMan(playerId, game, 40, 40);
            this.players[playerId] = this.player;
            this.map = data.map;
            this.layer = data.layer;
        })
        this.map = game.add.tilemap('level1', TILE_WIDTH, TILE_HEIGHT);
        map.addTilesetImage('tiles');
        layer = map.createLayer(0);
        map.setCollisionByExclusion([240], true, layer);  
        layer.resizeWorld();
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Bomb
        bombs = game.add.group();
        bombs.enableBody = true;
        bombs_exploision = game.add.group();
        bombs_exploision.enableBody = true;

        // Items 
        items = game.add.group();
        items.enableBody = true;
        items.setAll('')

        // Player
        this.initialGraphic();



        cursors = game.input.keyboard.createCursorKeys();
	},
    initialGraphic : function() {
        for (var p in this.players) {
            if (p.playerId  == 0) {
                p.sprite.animations.add('right', [3, 17, 31], 5, false);
                p.sprite.animations.add('left', [1, 15, 29], 5, false);
                p.sprite.animations.add('up', [2, 16, 30], 5, false);
                p.sprite.animations.add('down', [0, 14, 28], 5, false);
                p.sprite.animations.add('die', [5, 6, 18, 19, 20, 32, 33], 10, false);                
            }
            else {
                p.sprite.animations.add('right', [10, 24, 38], 5, false);
                p.sprite.animations.add('left', [8, 22, 36], 5, false);
                p.sprite.animations.add('up', [9, 23, 37], 5, false);
                p.sprite.animations.add('down', [7, 21, 35], 5, false);
                p.sprite.animations.add('die', [12, 13, 25, 26, 27, 39, 40], 10, false);                  
            }
            game.physics.arcade.enable(this.p.sprite);
            // Fix size player
            p.sprite.body.setSize(34, 34, 0, 4);
            p.sprite.body.collideWorldBounds = true;
        }
    },
	update: function () {

/*        if (!player.sprite.alive) {

            if (game.time.time - lastTime > 2000) {
                this.finish();
                return;                
            }
        }
        else {

            lastTime = game.time.time;
        }

        var pos = {x:0, y:0};

        pos = getPosTile(player.sprite.x + 17, player.sprite.y + 21);

        game.physics.arcade.collide(player.sprite, layer);
        
        game.physics.arcade.collide(bombs, player.sprite);
        game.physics.arcade.overlap(bombs_exploision, player.sprite, playerDeath, null, this);
        game.physics.arcade.overlap(bombs, bombs_exploision, bomb_explosion_chain, null, this);

        // OVERLAP
        game.physics.arcade.overlap(player.sprite, items, playerHitItem, null, this);

        player.sprite.body.velocity.x = 0;
        player.sprite.body.velocity.y = 0;

        if (!player.sprite.alive) {
        }
        else if (cursors.right.isDown) {
            //  Move to the right
            player.sprite.body.velocity.x = player.speed;
            player.sprite.animations.play('right');

        }
        else if (cursors.left.isDown) {
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


        if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
            var exist = {e:false};
            bombs.forEachAlive(placeBombIfNotExist, this, pos.x, pos.y, exist);
            console.log('len bombs = ' + bombs.length);
            if (!exist.e) {
                if (player.bomb_available < player.numberOfBomb) {
                    var b = Bomb(player.power, pos.x, pos.y);
                    player.bomb_available ++;
                    console.log(test++);
                }
            }
        }*/

	},
	finish: function () {
		game.state.start('finish');
	}
};