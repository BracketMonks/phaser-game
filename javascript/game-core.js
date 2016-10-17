


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update });


////// Game Globals
var player;
var platforms;
var cursors;

var stars;
var diamonds;
var score = 0;
var scoreText;


////// Game Objects


//// Load game assets
var gameAssets = {
    worldAssets: function () {
        game.load.image('sky', 'images/sky.png');
        game.load.image('ground', 'images/platform.png');
    },

    itemAssets: function () {
        game.load.image('star', 'images/star.png');
        game.load.image('diamond', 'images/diamond.png');
    },

    playerAssets: function () {
        game.load.spritesheet('dude', 'images/dude.png', 32, 48);
    }
};

//// General game settings
var gameSettings = {
    // game physics settings
    physics: function (physicsType) {
        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.physicsType);
    },

    fullscreen: function () {
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        // This code makes game go fullscreen on game click
        // create a function for gofull
        // game.input.onDown.add(gofull, this);
        $(".js-fullscreen").on("click", function () {
            if (game.scale.isFullScreen) {
                game.scale.stopFullScreen();
            } else {
                game.scale.startFullScreen(false);
            }
        });

    },

    score: function () {
        //  The score
        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '16px', fill: '#000' });
    },

    controls: {
        initControll: function () {
            //  Our controls.
            cursors = game.input.keyboard.createCursorKeys();
        },

        mapControls: function () {
            if (cursors.left.isDown)
            {
                //  Move to the left
                player.body.velocity.x = -100;

                player.animations.play('left');
            }
            else if (cursors.right.isDown)
            {
                //  Move to the right
                player.body.velocity.x = 100;

                player.animations.play('right');
            }
            else
            {
                //  Stand still
                player.animations.stop();

                player.frame = 4;
            }

            //  Allow the player to jump if they are touching the ground.
            if (cursors.up.isDown && player.body.touching.down)
            {
                player.body.velocity.y = -450;
            }
        }
    }
};

//// Game elements
var gameComponents = {
    elements: {
        //  A simple background for our game
        sky: function() {
           game.add.sprite(0, 0, 'sky');
        }
    },

    elementGroups: {
        platform: function () {
            //  The platforms group contains the ground and the 2 ledges we can jump on
            platforms = game.add.group();

            //  We will enable physics for any object that is created in this group
            platforms.enableBody = true;
        },

        ground: function () {
            // Here we create the ground.
            var ground = platforms.create(0, game.world.height - 24, 'ground');

            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground.scale.setTo(2, 2);

            //  This stops it from falling away when you jump on it
            ground.body.immovable = true;
        },

        ledge: function () {
            //  Now let's create two ledges
            var ledge = platforms.create(400, 500, 'ground');
            ledge.body.immovable = true;

            ledge = platforms.create(-120,280, 'ground');
            ledge.body.immovable = true;

            ledge = platforms.create(20, 400, 'ground');
            ledge.body.immovable = true;
        },

        player: function () {
            // The player and its settings
            player = game.add.sprite(32, game.world.height - 150, 'dude');

            //  We need to enable physics on the player
            game.physics.arcade.enable(player);

            //  Player physics properties. Give the little guy a slight bounce.
            player.body.bounce.y = 0.1;
            player.body.gravity.y = 800;
            player.body.collideWorldBounds = true;

            //  Our two animations, walking left and right.
            player.animations.add('left', [0, 1, 2, 3], 10, true);
            player.animations.add('right', [5, 6, 7, 8], 10, true);
        },

        stars: function () {
            //  Some stars to collect
            stars = game.add.group();

            //  We will enable physics for any star that is created in this group
            stars.enableBody = true;

            //  Here we'll create 12 of them evenly spaced apart
            for (var i = 0; i < 4; i++) {
                //  Create a star inside of the 'stars' group
                var star = stars.create(i * 150, 500, 'star');

                //  Let gravity do its thing
                star.body.gravity.y = 500;

                //  This just gives each star a slightly random bounce value
                star.body.bounce.y = 0.7 + Math.random() * 0.2;
            }
        },

        diamonds: function () {
            diamonds = game.add.group();
            diamonds.enableBody = true;

            //  Here we'll create 12 of them evenly spaced apart
            for (var i = 0; i < 6; i++) {
                //  Create a star inside of the 'stars' group
                var diamond = diamonds.create(i * 180, 50, 'diamond');

                //  Let gravity do its thing
                diamond.body.gravity.y = 500;

                //  This just gives each star a slightly random bounce value
                diamond.body.bounce.y = 0.1 + Math.random() * 0.2;
            }
        }
    }
};

//// Collect stars score increment and removal
function colectItems (player, items) {
    // Removes the star from the screen
    items.kill();

    //  Add and update the score

    score += 10;

    scoreText.text = 'score: ' + score;
}


/* =========== PRELOAD FUNCTION */
function preload() {
    // load the world assets
    gameAssets.worldAssets();

    // load item assets
    gameAssets.itemAssets();

    // load player assets
    gameAssets.playerAssets();
}

/* =========== CREATE FUNCTION */
function create() {
    //// Game functionality
    gameSettings.physics('ARCADE');
    gameSettings.fullscreen();

    //// Game elements
    gameComponents.elements.sky();
    gameComponents.elementGroups.platform();
    gameComponents.elementGroups.ground();
    gameComponents.elementGroups.ledge();
    gameComponents.elementGroups.player();
    gameComponents.elementGroups.stars();
    gameComponents.elementGroups.diamonds();

    //// Game score init
    gameSettings.score();

    //// Game controls init
    gameSettings.controls.initControll();
}

/* =========== UPDATE FUNCTION */
function update() {
    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.collide(diamonds, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, colectItems, null, this);
    game.physics.arcade.overlap(player, diamonds, colectItems, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    // Set game controlls
    gameSettings.controls.mapControls();
}


