/**
 * Created by Diamond on 20/04/2014.
 */
var game = new Phaser.Game(480,800, Phaser.AUTO, '', {preload:preload, create: create, update:update});
var inMenu = true;
var inEnd = false;
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
var numAI = 2;
var playerHP = 3;
var moved = false;
var leftTime = 0;
var scoreTotal = 0;
var addScore = 0;
var obstacles;
var spawnObs = 10000;
var menuText;
var logo;

var testString = '';
var testText;
var uri = 'http://mcm-highscores-hrd.appspot.com/';
var gamename;
var name;
var email;
var score;

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
    game.load.image('obstacle', 'assets/obstacle.png');
    game.load.image('logo', 'assets/logo.png');
}

function create()
{
    // Set world physics to arcade.
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Create background images for scrolling.
    background = game.add.tileSprite(0,0,480,800,'background');
    logo = game.add.sprite(240,300,'logo');
    logo.anchor.setTo(0.5,0.5);
    menuText = game.add.text(130,150,'', { font: '50px Fixedsys', fill: '#ff0000' });

    game.input.onTap.addOnce(gameStart, this);

    name = 'Blair';
    email = 'mynameisntblair@gmail.com';
    gamename = 'FluX';
}

function update()
{
    score = scoreTotal;
    if(inMenu == true)
    {
        menuText.text = 'Start Game';
        update_bg();
    } else if(inEnd == false)
    {
        update_bg();
        update_player();
        enemy_AI();
        spawn_obstacles();
        check_collide();
        update_UI();
    } else if(inEnd == true)
    {
        testText.text = '';
        //menuText.text = ' Dead'
        update_bg();
    }
}

function gameStart(){
    logo.kill();
    menuText.text = '';
    // Create player.
    player = game.add.sprite(game.world.width / 2,(game.world.height / 3) * 2,'ship');
    player.anchor.setTo(0.5,0.5);

    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    // Create cursors group for movement.
    cursors = game.input.keyboard.createCursorKeys();

    //Create obstacle group and set default values.
    obstacles = game.add.group();
    obstacles.enableBody = true;
    obstacles.physicsBodyType = Phaser.Physics.ARCADE;
    obstacles.z = 3;
    obstacles.createMultiple(10,'obstacle');

    // Create bullets group and set default values.
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.z = 1;
    bullets.createMultiple(10,'bullet');
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // Create bullets group and set default values.
    bulletsE = game.add.group();
    bulletsE.enableBody = true;
    bulletsE.physicsBodyType = Phaser.Physics.ARCADE;
    bulletsE.z = 1;
    bulletsE.createMultiple(10,'enemyBullet');
    bulletsE.setAll('outOfBoundsKill', true);
    bulletsE.setAll('checkWorldBounds', true);

    // Create enemies group and set default values.
    enemies = game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    enemies.z = 2;

    // Create UI buttons.
    leftButton = game.add.button(0,game.world.height - 128, 'left', leftOnClick,this,2,1,0);
    leftButton.z = 4;
    rightButton = game.add.button(game.world.width - 64,game.world.height - 128, 'right', rightOnClick,this,2,1,0);
    rightButton.z = 4;
    shootButton = game.add.button(game.world.centerX - 84,game.world.height - 85, 'shoot', shootOnClick,this,2,1,0);
    shootButton.z = 4;
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    testText = game.add.text(10,10,testString, { font: '20px Arial', fill: '#fff' });
    inMenu = false;
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

function enemy_AI(){
    if(enemyAlive == 0)
    {
        var rAI = game.rnd.integerInRange(0,numAI);
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
            enemyAlive = 2;
            for(var i = 0; i < 1; i++)
            {
                createEnemy(-100,200,rAI);
                createEnemy(game.world.width + 100,200,rAI);
                moved = false;
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
                    if(enemyCur.x <= 90 && moved == false)
                    {
                        enemyCur.body.velocity.x = 100;
                    } else if(enemyCur.x >= 80 && enemyCur.x <= 240 && enemyCur.y == 100 && moved == false)
                    {
                        enemyCur.body.velocity.x = 0;
                    } else if(enemyCur.x >= 180 && enemyCur.x <= 240 && enemyCur.y == 200 && moved == false)
                    {
                        enemyCur.body.velocity.x = 0;
                        leftTime = game.time.now + 300;
                        moved = true;
                    } else if(enemyCur.x <= 240 && leftTime > game.time.now && moved == true)
                    {
                        shootEnemy(enemyCur,400);
                    } else if(enemyCur.x <= 240 && enemyCur.x >= 0 && moved == true)
                    {
                        enemyCur.body.velocity.x = -100;
                    } else if(enemyCur.x <= 240 && moved == true && enemyCur.x <= 0) {
                        enemyCur.kill();
                        enemyAlive -= 1;
                    }

                    if(enemyCur.x >= 400 && moved == false)
                    {
                        enemyCur.body.velocity.x = -100;
                    } else if(enemyCur.x <= 400 && enemyCur.x >= 240 && enemyCur.y == 100 && moved == false)
                    {
                        enemyCur.body.velocity.x = 0;
                    } else if(enemyCur.x <= 320 && enemyCur.x >= 240 && enemyCur.y == 200 && moved == false)
                    {
                        enemyCur.body.velocity.x = 0;
                        leftTime = game.time.now + 300;
                        moved = true;
                    } else if(enemyCur.x >= 240 && leftTime > game.time.now && moved == true)
                    {
                        shootEnemy(enemyCur,400);
                    } else if(enemyCur.x >= 240 && enemyCur.x <= game.world.width && moved == true)
                    {
                        enemyCur.body.velocity.x = 100;
                    } else if(enemyCur.x >= 240 && enemyCur.x >= game.world.width && moved == true)
                    {
                        enemyCur.kill();
                        enemyAlive -= 1;
                    }
                }
            }
        }
    }
}

function spawn_obstacles(){
   if(spawnObs < game.time.now)
   {
       var obs = obstacles.getFirstExists(false);
       obs.reset(game.rnd.integerInRange(0,game.world.width),0);
       obs.body.velocity.y = 100;
       spawnObs = game.time.now + 5000;
   }
}

function check_collide(){
    game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);
    game.physics.arcade.overlap(bulletsE, player, playerHit, null, this);
    game.physics.arcade.overlap(obstacles,player,playerHitOb,null,this);
}

function update_UI(){

    if(addScore < game.time.now)
    {
        scoreTotal += 5;
        addScore = game.time.now + 200;
    }
    testText.text = "HP: " + playerHP + "\n" + "Score: " + scoreTotal;
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
        shootTime = game.time.now + 600;
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
        scoreTotal += 100;
        //enemies.remove(enemy);
    }
}

function playerHit(player,bullet){
    bullet.kill();
    //bullets.remove(bullet);

    playerHP -= 1;
    if(playerHP <= 0)
    {
        gameOver();
    }
}

function playerHitOb(player,ob){
    ob.kill();

    playerHP -= 1;
    if(playerHP <= 0)
    {
        gameOver();
    }
}

function gameOver(){
    for(var i = 0; i < enemies.length; i++)
    {
        enemies.getAt(i).kill();
    }
    for(var i=0;i<obstacles.length;i++)
    {
        obstacles.getAt(i).kill();
    }
    for(var i=0;i<bullets.length;i++)
    {
        bullets.getAt(i).kill();
    }
    for(var i=0;i<bulletsE.length;i++)
    {
        bulletsE.getAt(i).kill();
    }
    player.kill();
    leftButton.kill();
    rightButton.kill();
    shootButton.kill();
    //fireButton.kill();
    //cursors.kill();
    inEnd = true;

    submitScore(gamename, name, email, score);
    getTable();
    showScoreTable();
}

function submitScore(gamename, name, email, score) {
    var url = uri + "score?game={0}&nickname={1}&email={2}&score={3}&func=?";
    url = url.replace('{0}', gamename);
    url = url.replace('{1}', name);
    url = url.replace('{2}', email);
    url = url.replace('{3}', score);
    document.getElementById('url').innerText = url;

    $.ajax({
        type:  "GET",
        url:   url,
        async: true,
        contentType: 'application/json',
        dataType: 'json',
        success: function (json) {
            $("#result").text(json.result);
        },
        error: function (e) {
            window.alert(e.message);
        }
    });
}

function showScoreTable(obj) {
    var s = '', i;
    for (i = 0; i < obj.scores.length; i += 1) {
        s += obj.scores[i].name + ' : ' + obj.scores[i].score + "\n";
    }
    document.getElementById('scoretable').innerHTML = s;
    menuText.text = s;
}

function getTable() {
    var url = uri + "scoresjsonp?game=FluX&func=?";
    document.getElementById('url').innerText = url;
    $.ajax({
        type: "GET",
        url: url,
        async: true,
        // Note, instead of this we could have a success function...
        jsonpCallback: 'showScoreTable',
        contentType: 'application/json',
        dataType: 'json',
        error: function (e) {
            window.alert(e.message);
        }

    });
}