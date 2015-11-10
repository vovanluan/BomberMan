var TILE_WIDTH = 40;
var TILE_HEIGHT = 40;
var EASY_ENEMIES_SPEED = 50;
var NORMAL_ENEMIES_SPEED = 35;
var PLAYER_SPEED = 100;
var lastTime = 0;
function BomberMan(Id, game, x, y) {
    this.Id = Id;
    this.game = game;
    this.sprite = game.add.sprite(x, y, 'bomberman');
    this.numberOfBomb = 1;
    this.bomb_available = 0;
    this.speed = PLAYER_SPEED;
    this.power = 1;
}
function easyEnemyMovement(easyEnemy, speed) {
    easyEnemy.animations.play('walk');
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

function enemyDeath(bombSprite, enemy) {
    if (enemy.alive) {
        enemy.animations.play('die');
        enemy.body.velocity.x = 0;
        enemy.body.velocity.y = 0;
        enemy.alive = false;
        game.time.events.add(Phaser.Timer.SECOND, function() {
            enemy.kill();   
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
    if (rand < 0.2) {
        items.create(TILE_WIDTH * posInTile_x, TILE_HEIGHT * posIntile_y, 'items', 0);
    }
    // Create Power Item: Increase range
    else if (rand < 0.4) {
        items.create(TILE_WIDTH * posInTile_x, TILE_HEIGHT * posIntile_y, 'items', 1);
    }
    // Create increasing speed Item
    else if (rand < 0.6) {
        items.create(TILE_WIDTH * posInTile_x, TILE_HEIGHT * posIntile_y, 'items', 2);
    }
    // else {
    //     map.putTile(240, posInTile_x, posIntile_y, layer);
    // }

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

var playState = {
	create:function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Map
        
        map = game.add.tilemap('level1', TILE_WIDTH, TILE_HEIGHT);

        //  Now add in the tileset
        map.addTilesetImage('tiles');
        layer = map.createLayer(0);
        map.setCollisionByExclusion([240], true, layer);
        layer.resizeWorld();

        // Bomb
        bombs = game.add.group();
        bombs.enableBody = true;
        bombs_exploision = game.add.group();
        bombs_exploision.enableBody = true;
        //Bomb(1, 2, 1);
        //game.input.keyboard.isDown(Phaser.KeyCode.BACKSPACE);

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
        easyenemies.callAll('animations.add', 'animations', 'die', [3, 4, 5, 6, 7], 3, false);

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
        normalenemies.callAll('animations.add', 'animations', 'die', [11, 12, 13], 3, false);

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
	},
	update: function () {
        if (!player.sprite.alive) {
            if (game.time.time - lastTime > 2000) {
                this.finish();
                return;                
            }
        }
        else {
            lastTime = game.time.time;
        }
        var pos = {x:0, y:0};
        // pos.x = this.math.snapToFloor(Math.floor(player.sprite.x+17), TILE_WIDTH) / TILE_WIDTH;
        // pos.y = this.math.snapToFloor(Math.floor(player.sprite.y+21), TILE_WIDTH) / TILE_WIDTH;
        pos = getPosTile(player.sprite.x + 17, player.sprite.y + 21);

        game.physics.arcade.collide(easyenemies, layer);
        game.physics.arcade.collide(normalenemies, layer);
        game.physics.arcade.collide(player.sprite, layer);
        
        game.physics.arcade.collide(bombs, player.sprite);
        game.physics.arcade.overlap(bombs_exploision, player.sprite, playerDeath, null, this);
        game.physics.arcade.overlap(bombs, bombs_exploision, bomb_explosion_chain, null, this);

        // OVERLAP
        game.physics.arcade.overlap(bombs_exploision, easyenemies, enemyDeath, null, this);
        game.physics.arcade.overlap(bombs_exploision, normalenemies, enemyDeath, null, this);        
        game.physics.arcade.overlap(player.sprite, easyenemies, playerDeath, null, this);
        game.physics.arcade.overlap(player.sprite, normalenemies, playerDeath, null, this);
        game.physics.arcade.overlap(player.sprite, items, playerHitItem, null, this);

        // Easy enemies
        easyenemies.forEachAlive(easyEnemyMovement, this, EASY_ENEMIES_SPEED);

        //Normal enemies
        normalenemies.forEachAlive(normalEnemyMovement, this, player);

        player.sprite.body.velocity.x = 0;
        player.sprite.body.velocity.y = 0;

        if (!player.sprite.alive) {
        }
        else if (cursors.right.isDown) {
            //  Move to the right
            player.sprite.body.velocity.x = player.speed;
            player.sprite.animations.play('right');
            // var posInTile = getPosTile(player.sprite.x + 17, player.sprite.y + 21);
            // if (Math.abs(getPosFromTile(posInTile.x, posInTile.y).y - player.sprite.y) < 50) {
            //     player.sprite.y = getPosFromTile(posInTile.x, posInTile.y).y - TILE_WIDTH*0.5;
            // }

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
            if (!exist.e) {
                if (player.bomb_available < player.numberOfBomb) {
                    var b = Bomb(player.power, pos.x, pos.y);
                    player.bomb_available ++;
                }
            }
        }

	},
	finish: function () {
		game.state.start('finish');
	}
};