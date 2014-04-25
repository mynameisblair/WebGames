/**
 * Created by Diamond on 20/04/2014.
 */
var game = new Phaser.Game(480,800, Phaser.AUTO, '', {preload:preload, create: create, update:update});
var player;
var cursors;
var leftButton;
var rightButton;
var shootButton;
var fireButton;
var background;
var bullets;
var bulletsE;
var enemies;
var shootTime = 0;
var enemyAlive = 0;
var enemyTotal = 0;
var numAI = 1;
var playerHP = 3;

var testString = '';
var testText;

function preload()
{
    game.load.image('ship','assets/ship.png');
    game.load.image('left','assets/left.png');
    game.load.image('right','assets/right.png');
    game.load.image('shoot','assets/shoot.png');
    game.load.image('background','assets/background.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('enemyBullet', 'assets/enemyBullet.png');
    game.load.image('enemy', 'assets/shipEnemy.png');
}

function create()
{
    // Set world physics to arcade.
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Create background images for scrolling.
    background = game.add.tileSprite(0,0,480,800,'background');

    // Create player.
    player = game.add.sprite(game.world.width / 2,(game.world.height / 3) * 2,'ship');
    player.anchor.setTo(0.5,0.5);

    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    // Create cursors group for movement.
    cursors = game.input.keyboard.createCursorKeys();

    // Create UI buttons.
    leftButton = game.add.button(0,game.world.height - 128, 'left', leftOnClick,this,2,1,0);
    rightButton = game.add.button(game.world.width - 64,game.world.height - 128, 'right', rightOnClick,this,2,1,0);
    shootButton = game.add.button(game.world.centerX - 84,game.world.height - 85, 'shoot', shootOnClick,this,2,1,0);
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Create bullets group and set default values.
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(10,'bullet');
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // Create bullets group and set default values.
    bulletsE = game.add.group();
    bulletsE.enableBody = true;
    bulletsE.physicsBodyType = Phaser.Physics.ARCADE;
    bulletsE.createMultiple(10,'enemyBullet');
    bulletsE.setAll('outOfBoundsKill', true);
    bulletsE.setAll('checkWorldBounds', true);

    // Create enemies group and get default values.
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    testText = game.add.text(10,10,testString, { font: '20px Arial', fill: '#fff' });
}

function update()
{
    update_bg();
    update_player();
    update_projectile();
    enemy_AI();
    check_collide();
    update_score();
    testText.text = playerHP;
}

function update_bg(){
    background.tilePosition.y += 2;
}

function update_player(){
    if(cursors.left.isDown)
    {
        player.body.velocity.x = -200;
    }
    else if(cursors.right.isDown)
    {
        player.body.velocity.x = 200;
    }
    if(fireButton.isDown)
    {
        shootOnClick();
    }
}

function update_projectile(){

}

function enemy_AI(){
    if(enemyAlive == 0)
    {
        var rAI = 2 //game.rnd.integerInRange(0,numAI);
        if(rAI == 0)
        {
            enemyAlive = 2;
            for(var i = 0; i < enemyAlive; i++)
            {
                createEnemy((game.world.width / 6),-200 + (-400 * i),rAI);
            }
        } else if(rAI == 1)
        {
            enemyAlive = 4;
            for(var i = 0; i < enemyAlive; i++)
            {
                createEnemy(-100 + (-100 * i),(game.world.height / 4),rAI);
            }
        } else if(rAI == 2)
        {
            enemyAlive = 4;
            for(var i = 0; i < 2; i++)
            {
                createEnemy(-100,100 + (100 * i),rAI);
                createEnemy(game.world.width + 100,100 + (100 * i),rAI);
            }
        }
    } else
    {
        for(var i = 0; i < enemies.length; i++)
        {
            var enemyCur = enemies.getAt(i);
            if(enemyCur.exists){
                if(enemyCur.numAI == 0){
                   if(enemyCur.y <= 150 && enemyCur.x <= (game.world.width / 6)*5)
                   {
                       enemyCur.body.velocity.y = 100;
                   } else if(enemyCur.y >= 150 && enemyCur.x <= (game.world.width / 2))
                   {
                       enemyCur.body.velocity.y = 50;
                       enemyCur.body.velocity.x = 100;
                       if(enemyCur != null){
                           shootEnemy(enemyCur,1000);
                       }
                   } else if(enemyCur.y >= 150 && enemyCur.x >= (game.world.width / 2))
                   {
                       enemyCur.body.velocity.y = -50;
                       enemyCur.body.velocity.x = 100;
                       if(enemyCur != null){
                           shootEnemy(enemyCur,1000);
                       }
                   }  else if(enemyCur.y >= -200 && enemyCur.x >= (game.world.width / 6)*5)
                   {
                       enemyCur.body.velocity.y = -100;
                       enemyCur.body.velocity.x = 0;
                   } else
                   {
                       enemyCur.kill();
                       //enemies.remove(enemyCur);
                       enemyAlive -= 1
                   }
                } else if(enemyCur.numAI == 1)
                {
                    if(enemyCur.x <= game.world.width) {
                        enemyCur.body.velocity.x = 100;
                        if (enemyCur != null) {
                            shootEnemy(enemyCur, game.rnd.integerInRange(2000, 4000));
                        }
                    } else
                    {
                        enemyCur.kill();
                        //enemies.remove(enemyCur);
                        enemyAlive -= 1;
                    }
                } else if(enemyCur.numAI == 2)
                {
                    var moved = false;
                    var leftTime = 0;
                    var rightTime = 0;
                    if(enemyCur.x <= 90 && (enemyCur.y == 100 || enemyCur.y == 200))
                    {
                        enemyCur.body.velocity.x = 100;
                    } else if(enemyCur.x >= 80 && enemyCur.x <= 240 && enemyCur.y == 100)
                    {
                        enemyCur.body.velocity.x = 0;
                    } else if(enemyCur.x >= 180 && enemyCur.x <= 240 && enemyCur.y == 200)
                    {
                        enemyCur.body.velocity.x = 0;
                        enemyCur.y += 1;
                        leftTime = game.time.now + 450;
                    }

                    if(enemyCur.x >= 400)
                    {
                        enemyCur.body.velocity.x = -100;
                    } else if(enemyCur.x <= 400 && enemyCur.x >= 240 && enemyCur.y == 100)
                    {
                        enemyCur.body.velocity.x = 0;
                    } else if(enemyCur.x <= 320 && enemyCur.x >= 240 && enemyCur.y == 200)
                    {
                        enemyCur.body.velocity.x = 0;
                    }
                }
            }
        }
    }
}

function check_collide(){
    game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);
    game.physics.arcade.overlap(bulletsE, player, playerHit, null, this);
}

function update_score(){

}

function leftOnClick(){
    player.body.velocity.x = -200;
}

function rightOnClick(){
    player.body.velocity.x = 200;
}

function shootOnClick(){
    if(game.time.now > shootTime) {
        var bullet1 = bullets.getFirstExists(false);
        if(bullet1) {
            bullet1.reset(player.x - 24, player.y);
            bullet1.body.velocity.y = -400;
        }
        shootTime = game.time.now + 200;
    }
}

function shootEnemy(enemyCur,shootInt){
    if(game.time.now > enemyCur.shootTimeE){
        var bulletE = bulletsE.getFirstExists(false);
        if(bulletE) {
            bulletE.reset(enemyCur.x - 24, enemyCur.y);
            bulletE.body.velocity.y = 300;
        }
        enemyCur.shootTimeE = game.time.now + shootInt;
    }
}

function createEnemy(x,y,AI){
    var enemy = enemies.create(x,y,'enemy');
    enemy.anchor.setTo(0.5,0.5);
    enemy.numAI = AI;
    enemy.hp = 2;
    enemy.shootTimeE = 0;
}

function collisionHandler(bullet,enemy){
    bullet.kill();
    //bullets.remove(bullet);

    enemy.hp -= 1;
    if(enemy.hp <= 0)
    {
        enemy.kill();
        enemyAlive -= 1;
        //enemies.remove(enemy);
    }
}

function playerHit(player,bullet){
    bullet.kill();
    //bullets.remove(bullet);

    playerHP -= 1;
}