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
var background1;
var background2;
var bullets;
var enemies;
var shootTime = 0;

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
}

function create()
{
    // Set world physics to arcade.
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Create background images for scroling.
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

    // Create enemies group and get default values.
    enemies = game.add.group();

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
}

function update_bg(){
    background.tilePosition.y += 3;
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
    for(var i = 0;i < bullets.length;i++){
        if(bullets.getAt(i).y <= 0)
        {
            bullets.getAt(i).kill();
        }
    }
}

function enemy_AI(){

}

function check_collide(){

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
        var bullet1 = bullets.create(player.x - 24, player.y, 'bullet');
        bullet1.body.velocity.y = -400;

        var bullet2 = bullets.create(player.x + 22, player.y, 'bullet');
        bullet2.body.velocity.y = -400;

        shootTime = game.time.now + 150;
    }
}