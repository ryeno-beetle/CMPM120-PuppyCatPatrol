// Rye Donaldson
// PuppyCat Patrol
// time estimate:
/* mods:
    - mouse control for player movement and left mouse click to fire (5)
    - new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses (5)
    - display the time remaining (in seconds) on the screen (3)
*/
/* citations:
    -  event emitters: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/eventemitter3/
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