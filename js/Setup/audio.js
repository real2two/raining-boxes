let audioTrack;

let grabPoint;
let hitSound;

function preload() {
    soundFormats('mp3', 'wav');

    audioTrack = loadSound('sounds/music/arp.wav');

    grabPoint = loadSound('sounds/sfx/point.mp3');
    hitSound = loadSound('sounds/sfx/hit.mp3');

    audioTrack.setVolume(.4);
    hitSound.setVolume(.35);
}