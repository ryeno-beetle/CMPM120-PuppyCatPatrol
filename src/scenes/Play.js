class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // place tile sprite
        this.sky = this.add.tileSprite(0, 0, 640, 480, 'sky').setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding - borderPadding, 'fish').setOrigin(0.5, 0);
        this.rocketEventEmitter = this.p1Rocket.scene.events;
        // add spaceships (x3)
        this.ship1 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'puppycat_flail', 0, 30).setOrigin(0, 0);
        this.ship2 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'puppycat_flail', 0, 20).setOrigin(0, 0);
        this.ship3 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'puppycat_flail', 0, 10).setOrigin(0, 0);
        // pink ui background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xffa8be).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xffffff).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xffffff).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xffffff).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xffffff).setOrigin(0, 0);
        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // init score
        this.p1Score = 0;
        // display score
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#bc3c54',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        };
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, textConfig);
        
        //popup text config
        this.popupConfig = {
            fontFamily: 'Courier',
            fontSize: '15px',
            color: '#fff4f6',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        };

        // GAME OVER flag
        this.gameOver = false
        // 60s timer
        textConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', textConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'press (R) to restart or (<-) for menu', textConfig).setOrigin(0.5);
            this.gameOver = true;
            this.music.destroy();
        }, null, this);

        // display timer
        // textConfig.fixedWidth = 50;
        this.timerDisplay = this.add.text(game.config.width - borderUISize + borderPadding - 55, borderUISize + borderPadding * 2, game.settings.gameTimer, textConfig);

        // events to set if mouse is on/off canvas if it has changed
        this.input.on('gameout', () => {
            pointerOnCanvas = false
            // console.log("pointer left canvas");
        });
        this.input.on('gameover', () => {
            pointerOnCanvas = true
            // console.log("pointer on canvas");
        });
        // event for pointer down 
        this.input.on('pointerdown', () => {
            this.p1Rocket.fire();
        })
        // event for rocket miss (subtract 10s from clock)
        this.rocketEventEmitter.on('rocketmiss', (x, y) => {
            // console.log('rocket miss');
            this.clock.elapsed += 10000;
            // popup text
            let timeText = this.add.text(x + this.p1Rocket.width + 20, y + 20, "- 10 sec", this.popupConfig);
            this.PopupTextTween([timeText]);
        })
        // music!
        this.music = this.sound.add('music', {volume: 0.5, loop: true, delay: 0});
        this.music.play();
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.rocketEventEmitter.off('rocketmiss');
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.rocketEventEmitter.off('rocketmiss');
            this.scene.start('menuScene');
        }
        if (!this.gameOver) {
            this.sky.tilePositionX -= 2;
            this.p1Rocket.update();
            this.ship1.update();
            this.ship2.update();
            this.ship3.update();
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship3)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship3);
        }
        if (this.checkCollision(this.p1Rocket, this.ship2)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship2);
        }
        if (this.checkCollision(this.p1Rocket, this.ship1)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship1);
        }

        //update timer
        this.updateTimer();
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width - 5 && 
            rocket.x + rocket.width > ship.x + 5 && 
            rocket.y < ship.y + ship.height && 
            rocket.height + rocket.y > ship.y + 40) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create om ('explosion') sprite at ship's position
        let om = this.add.sprite(ship.x, ship.y, 'om').setOrigin(0, 0);
        
        om.anims.play('om'); // play om animation

        om.on('animationcomplete', () => { // callback after anim completes
            let chew = this.add.sprite(om.x, om.y, 'chew').setOrigin(0, 0);
            om.destroy();
            chew.anims.play('chew');
            this.tweens.chain({
                targets: chew,
                tweens: [
                    {
                        duration: 500,
                        ease: 'Sine.easeIn',
                        //properties
                        y: '-=30',
                        scale: 0.75,
                    },
                    {
                        duration: 500,
                        ease: 'Sine.easeOut',
                        onComplete: function () {
                            ship.reset(); // reset ship position
                            ship.alpha = 1; // make ship visible again
                            //om.destroy(); // remove om sprite
                            chew.destroy(); // remove chew sprite
                        },
                        //properties
                        y: '+=10',
                        scale: 0.5,
                        alpha: 0,
                        persist: false
                    }
                ]
                
            });
            //tweenOut.play();
        });
        //text tween
        let pointsText = this.add.text(ship.x + ship.width + 20, ship.y + 10, "+ " + ship.points + " pts", this.popupConfig);
        let timeText = this.add.text(ship.x + ship.width + 20, ship.y + 40, "+ " + 0.5 * ship.points + " sec", this.popupConfig);
        this.PopupTextTween([pointsText, timeText]);
        // score add and text update
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('om_sfx');
        // add time to timer (ship points / 2 in seconds)
        this.clock.elapsed -= 500 * ship.points;
    }

    PopupTextTween(t) {
        this.tweens.chain({
            targets: t,
            tweens: [
                {
                    duration: 500,
                    ease: 'Linear',
                    y: '-=20',
                },
                {
                    duration: 500,
                    ease: 'Linear',
                    onComplete: function () {
                        t.forEach((val) => {val.destroy()});
                    },
                    y: '-=20',
                    alpha: 0,
                    persist: false
                }
            ]
        });
    }

    updateTimer() {
        let timeLeft = Math.floor((this.game.settings.gameTimer - this.clock.elapsed) / 1000); // seconds left
        this.timerDisplay.text = timeLeft;
    }
}