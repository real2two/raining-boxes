const Engine = Matter.Engine,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Collision = Matter.Collision,
    Composite = Matter.Composite,
    Body = Matter.Body,
    Events = Matter.Events;

const engine = Engine.create({
    positionIterations: 10,
    velocityIterations: 30
});

let lastUpdated = 0;
let lastUpdatedOffset = 0;
let physicsOffset;
let physicsLoop;

function updatePhysicsLoop() {
    physicsOffset = performance.now() - lastUpdated + lastUpdatedOffset;

    if (physicsOffset >= 8) {
        physicsLoop = Math.floor(physicsOffset / 8);
        
        for (let i = 0; i < physicsLoop; ++i) {
            Engine.update(engine, 8);
        }

        lastUpdatedOffset = physicsOffset % 8;
        lastUpdated = performance.now();
    }

    if (gamePaused || gameEnded) return;
    setTimeout(() => updatePhysicsLoop(), 0);
}

function endGame() {
    stayedAliveFor = timer();
    gameEnded = true;

    gameStarted = null;

    if (!audioTrack.paused) audioTrack.stop();
}