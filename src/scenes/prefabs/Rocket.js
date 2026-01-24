// rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add obj to existing scene
        scene.add.existing(this); // add to existing, displayList, updateList
        this.isFiring = false; // track rocket's firing status
        this.moveSpeed = 3; // rocket speed in px/frame
        this.sfxFsh = scene.sound.add('fsh_sfx');

        this.eventEmitter = this.scene.events;
    }

    update() {
        // left/right movement
        if (!this.isFiring) {
            if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.moveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
                this.x += this.moveSpeed;
            }
            if (pointerOnCanvas) {
                let pX = this.scene.input.activePointer.worldX;
                if (pX > borderUISize && pX < game.config.width - borderUISize) {
                    this.x = pX;
                }
                // if (pX < this.x) {
                //     this.x -= this.moveSpeed;
                // } else {
                //     this.x += this.moveSpeed;
                // }
            }
        }
        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyFIRE) && !this.isFiring) {
            this.fire();
        }
        // if fired, move up
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // reset on miss
        if (this.y <= borderUISize * 3 + borderPadding) {
            console.log("firing rocketmiss event");
            this.reset();
            this.eventEmitter.emit('rocketmiss');
        }
    }
    
    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding - borderPadding;
    }

    // fires rocket
    fire() {
        this.isFiring = true;
        this.sfxFsh.play();
    }
}