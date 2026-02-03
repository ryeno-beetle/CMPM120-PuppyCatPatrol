// Rye Donaldson
// PuppyCat Patrol
// time estimate: 10hrs ??
/* mods:
    - mouse control for player movement and left mouse click to fire (5)
    - new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses (5)
    - display the time remaining (in seconds) on the screen (3)
    - using a texture atlas, create a new animated sprite (three frames minimum) for the enemy spaceships (3)
    - write + implement my own simple looping background track (approved s-tier, 3 pts)
    - add popup text that fades out with a tween when you hit a ship showing the points and time gained, or time lost for a miss (approved s-tier, 1pt) 
*/
/*
other changes:
    - changed bounding box for 'spaceships' to just be the front of puppycat (hands/mouth area) since he's eating the fish
    - added tween animation to 'spaceships' for 'explosion' to make it look more like puppycat is flying away as he chews
*/
/* citations:
    - event emitters: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/eventemitter3/
    - scaling tweens: https://www.html5gamedevs.com/topic/40768-how-to-tween-scale-in-phaser-3/
    - tween example: https://labs.phaser.io/phaser4-view.html?src=src%5Ctweens%5Cchains%5Cbat%20tween.js&return=phaser4-index.html
*/
'use strict'

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT;

// set ui size
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// mouse on canvas
let pointerOnCanvas = false;