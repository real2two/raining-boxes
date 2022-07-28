let gameStarted;
let gamePaused;
let gameEnded = false;

const timer = () => (performance.now() - gameStarted) / 1000;
let timeBeforePaused;
let stayedAliveFor;

let lastParticleCollision;

let throwParticle = 0;
let particleDifficulty = 25; // lower = easier

let speed = 1;

let pointParticle = [];
let maxGreenBoxes = 3;

let touchingGround = false;
let hp = 5;
let points = 0;