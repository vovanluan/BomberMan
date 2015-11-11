var TILE_WIDTH = 40;
var TILE_HEIGHT = 40;
var EASY_ENEMIES_SPEED = 50;
var NORMAL_ENEMIES_SPEED = 35;
var PLAYER_SPEED = 100;
var lastTime = 0;

var test =0 ;
var rand; // Dat lai cho khac cho dep
var players;

// Extends Sprite class
function CreateBomberMan(id, game, posInTile_x, posInTile_y) {
    //var bomberMan = game.add.sprite(x, y, 'bomberman');
    var pos = getPosFromTile(posInTile_x, posInTile_y);
    var bomberMan = players.create(pos.x - TILE_WIDTH/2, pos.y - TILE_WIDTH/2, 'bomberman');

    bomberMan.id = id;

    bomberMan.game = game;
    bomberMan.numberOfBomb = 10;
    bomberMan.bomb_available = 0;
    bomberMan.speed = PLAYER_SPEED;
    bomberMan.power = 1;

    game.physics.arcade.enable(bomberMan);
    // Fix size player
    bomberMan.body.setSize(34, 34, 0, 4);
    bomberMan.body.collideWorldBounds = true;

    bomberMan.animations.add('right', [3, 17, 31], 5, false);
    bomberMan.animations.add('left', [1, 15, 29], 5, false);
    bomberMan.animations.add('up', [2, 16, 30], 5, false);
    bomberMan.animations.add('down', [0, 14, 28], 5, false);
    bomberMan.animations.add('die', [5, 6, 18, 19, 20, 32, 33], 10, false);

    return bomberMan;
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
    var playerTile = map.getTileWorldXY(player.body.position.x, player.body.position.y, 40, 40, layer);
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
        game.physics.arcade.moveToObject(normalEnemy, player, NORMAL_ENEMIES_SPEED);
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
    if (!bomb.alive) {
        console.log('bomb is dead');
        return;

    }
    duration = 500;

    bomb.kill();
    if (!isTimeUp) {
        bomb.clock.destroy();
    }
    //bomb.destroy();

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

    rand = Math.random();
    socket.emit('send_random_number', rand);
    
    
    map.removeTile(posInTile_x, posIntile_y, layer);
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

var n;
var enemy = null;
var player = null;
var playOnlineState = {
    create:function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Map
        game.stage.disableVisibilityChange = true;
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

        var numEasyEnemies = Math.floor(0);

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

        var numNormalEnemies = Math.floor(0);

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

        players = game.add.group();
        players.enableBody = true;

        var d = new Date();
        n = d.getTime();
        
        

        layer.debug = true;

        cursors = game.input.keyboard.createCursorKeys();
        

        socket.on('server_player_move', function(data) {
            if (data == null)
                return;
            if (data.Id != player.Id) {
                enemy.x = data.x;
                enemy.y = data.y;
                enemy.frame = data.frame;
            }
        });

        socket.on('server_bomb', function(data) {
            if (data.Id != player.Id) {
                Bomb(data.power, data.x, data.y);
            }
        });

        socket.on('response_random_number', function(rand_number) {
            rand = rand_number;
        });


        //Luan
        socket.emit("requestjoinRoom1");
        socket.on("pendingGame", function(data) {
            player = CreateBomberMan(data.id, game, data.pos.x, data.pos.y);
        })
        socket.on("startGame", function (data) {
            console.log(player.Id, data.data1, data.data2);  
            if (data.data1.id == player.Id) {
                enemy = CreateBomberMan(data.data2.id, game, data.data2.pos.x, data.data2.pos.y);
            }
            else {
                enemy = CreateBomberMan(data.data1.id, game, data.data1.pos.x, data.data1.pos.y);  
                console.log(player.Id);              
            }
        })

    },
    update: function () {

        if (player == null) {
            return;
        }
        if (!player.alive) {
            if (game.time.time - lastTime > 2000) {
                this.finish();
                return;
            }
        }
        else {
            lastTime = game.time.time;
        }


        var data = {Id:player.Id, x:player.x, y:player.y, frame: player.frame};
        socket.emit('player_move', data);
        

        var pos = {x:0, y:0};
        pos = getPosTile(player.x + 17, player.y + 21);

        game.physics.arcade.collide(easyenemies, layer);
        game.physics.arcade.collide(normalenemies, layer);
        game.physics.arcade.collide(player, layer);
        
        game.physics.arcade.collide(bombs, player);
        game.physics.arcade.overlap(bombs_exploision, player, playerDeath, null, this);
        game.physics.arcade.overlap(bombs, bombs_exploision, bomb_explosion_chain, null, this);

        // OVERLAP
        game.physics.arcade.overlap(bombs_exploision, easyenemies, enemyDeath, null, this);
        game.physics.arcade.overlap(bombs_exploision, normalenemies, enemyDeath, null, this);        
        game.physics.arcade.overlap(player, easyenemies, playerDeath, null, this);
        game.physics.arcade.overlap(player, normalenemies, playerDeath, null, this);
        game.physics.arcade.overlap(player, items, playerHitItem, null, this);

        // Easy enemies
        easyenemies.forEachAlive(easyEnemyMovement, this, EASY_ENEMIES_SPEED);

        //Normal enemies
        normalenemies.forEachAlive(normalEnemyMovement, this, player);

        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        if (!player.alive) {
        }
        else if (cursors.right.isDown) {
            //  Move to the right
            player.body.velocity.x = player.speed;
            player.animations.play('right');
        }
        else if (cursors.left.isDown) {
            player.body.velocity.x = -player.speed;
            player.animations.play('left');
        }
        else if (cursors.up.isDown) {
            //  Move up
            player.body.velocity.y = -player.speed;
            player.animations.play('up');
        }
        else if (cursors.down.isDown) {
            //  Move down
            player.body.velocity.y = player.speed;
            player.animations.play('down');
        }
        else {
            player.animations.stop();
            player.frame = 0;
        }


        if (game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
            var exist = {e:false};
            bombs.forEachAlive(placeBombIfNotExist, this, pos.x, pos.y, exist);
            console.log('len bombs = ' + bombs.length);
            if (!exist.e) {
                if (player.bomb_available < player.numberOfBomb) {
                    Bomb(player.power, pos.x, pos.y);
                    player.bomb_available ++;

                    var data = {power:player.power, x:pos.x, y:pos.y};
                    socket.emit('bomb', data);
                }
            }
        }

    },
    finish: function () {
        game.state.start('finish');
    }
};