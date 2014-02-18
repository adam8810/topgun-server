/*global Phaser, io*/
'use strict';
window.onload = function () {
    var world = {
        height: 600,
        width: 1000
    }
    var iam,
        myTank,
        tankInfo = {
            angle: 0,
            currentSpeed: 0,
            x: world.width / 2,
            y: world.height / 2
        },
        otherTanks = [],
        turret,
        land,
        cursor,
        currentSpeed,
        bullets;

    var socket = io.connect();
    socket.on('connection', function (data) {
        console.log(data);

    });

    socket.on('tankmove', function (updatelist) {
        tankInfo.angle = updatelist.payload.angle;
        tankInfo.x = updatelist.payload.x;
        tankInfo.y = updatelist.payload.y;

    });

    socket.on('youare', function (id) {
        iam = id;
    });


    var game = new Phaser.Game(world.width, world.height, Phaser.AUTO, 'game-canvas', { preload: preload, create: create, update: update });

    function preload() {
        game.load.atlas('tank', '/images/tanks.png', '/tanks.json');
        game.load.image('earth', '/images/scorched_earth.png');
        game.load.image('bullet', '/images/bullet.png');

    }

    function create() {
        game.add.text(16, 16, 'h', {font: '32px arial', fill: '#000'});
        game.stage.disableVisibilityChange = true;
        game.world.setBounds(-1000, -1000, 2000, 2000);


        land = game.add.tileSprite(0, 0, 1000, 600, 'earth');
        land.fixedToCamera = true;

        initMyTank();

        initOtherTanks();


        // keyboard listener
        cursor = game.input.keyboard.createCursorKeys();

    }

    function update() {

        myTank.animations.play('move');

        if (cursor.left.isDown) {
            tankInfo.angle -= 5;

            tellServer('tankupdate', tankInfo);
        } else if (cursor.right.isDown) {
            tankInfo.angle += 5;
            tellServer('tankupdate', tankInfo);
        }

        if (cursor.up.isDown) {
            //  The speed we'll travel at
            currentSpeed = 300;
            tankInfo.x = myTank.x;
            tankInfo.y = myTank.y;
            tankInfo.currentSpeed = currentSpeed;
            tellServer('tankupdate', tankInfo);
        }
        else {
            if (currentSpeed > 0) {
                currentSpeed -= 4;
            }
        }


        myTank.x = tankInfo.x;
        myTank.y = tankInfo.y;

        if (currentSpeed > 0) {
            game.physics.velocityFromRotation(myTank.rotation, currentSpeed, myTank.body.velocity);
        }

        myTank.angle = tankInfo.angle;
        turret.angle = tankInfo.angle;


        turret.x = myTank.x;
        turret.y = myTank.y;
    }

    function initMyTank() {
        myTank = game.add.sprite(world.width / 2, world.height / 2, 'tank', 'tank1');
        myTank.anchor.setTo(0.5, 0.5);
        myTank.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

        // Limit tank speed
        myTank.body.linearDamping = 0.2;
        myTank.body.maxVelocity.setTo(400, 400);
        myTank.body.collideWorldBounds = true;

        // Turret on top of tank
        turret = game.add.sprite(myTank.x, myTank.y, 'tank', 'turret');
        turret.anchor.setTo(0.3, 0.3);
    }

    function initOtherTanks() {

    }

    function fireCannon() {

    }

    function tellServer(namespace, payload) {

        socket.emit(namespace, {
            iam: iam,
            payload: payload
        });
    }
}