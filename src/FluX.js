/**
 * Created by Diamond on 20/04/2014.
 */
var game = new Phaser.Game(480,800, Phaser.AUTO, '', {preload:preload, create: create, update:update});
var player;
var cursors;
var leftButton;
var rightButton;
var shootButton;

function preload()
{
    game.load.image('ship','assets/ship.png');
    game.load.image('left','assets/left.png');
    game.load.image('right','assets/right.png');
    game.load.image('shoot','assets/shoot.png');
}

function create()
{
    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = game.add.sprite(game.world.width / 2,(game.world.height / 3) * 2,'ship');
    player.anchor.setTo(0.5,0.5);

    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();

    leftButton = game.add.button(0,game.world.height - 128, 'left', leftOnClick,this,2,1,0);
    rightButton = game.add.button(game.world.width - 64,game.world.height - 128, 'right', rightOnClick,this,2,1,0);
    shootButton = game.add.button(game.world.centerX - 84,game.world.height - 85, 'shoot', shootOnClick,this,2,1,0);
}

function update()
{
    update_player();
    update_projectile();
    enemy_AI();
    check_collide();
    update_score();
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
}

function update_projectile(){

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

}