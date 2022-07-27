let gameStarted;
let gamePaused;
let gameEnded = false;

const timer = () => (performance.now() - gameStarted) / 1000;
let timeBeforePaused;
let stayedAliveFor;

let lastParticleCollision;

let throwParticle = 0;
let particleDifficulty = 25; // lower = easier

let pointParticle = [];
let maxGreenBoxes = 3;

let touchingGround = false;
let hp = 5;
let points = 0;

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

const ground = Bodies.rectangle(0, 100, 90, 30, { isStatic: true, friction: 0.3, restitution: 0.6 });
const player = Bodies.rectangle(0, 0, 30, 30, { friction: 0.3, restitution: 0 });

Body.setInertia(player, 1000);

Events.on(engine, 'collisionStart', e => {
    for (const pair of e.pairs) {
        const bodies = [ pair.bodyA, pair.bodyB ];

        if (!bodies.includes(player)) continue;

        const body = bodies.find(p => p !== player);

        if (body === ground) {
            touchingGround = true;
            continue;
        }
        
        if (particles.using.includes(body)) {
            Composite.remove(engine.world, body);
            
            lastParticleCollision = {
                start: performance.now(),
                type: pointParticle.includes(body) // false = damaged, true = point
            };

            if (pointParticle.includes(body)) {
                ++points;
                if (particleDifficulty > 0) --particleDifficulty;

                Body.scale(body, .4, .4);
                pointParticle.splice(pointParticle.indexOf(body), 1);

                grabPoint.rate((Math.random() * .2) + 1);
                grabPoint.play();

                if (points >= 10 && points <= 25) audioTrack.rate(1 + (((points - 10) / 15) ** 2))
                if (points % 15 === 0 && maxGreenBoxes > 1) --maxGreenBoxes; 
            } else {
                hitSound.play();
                if (--hp === 0) return endGame();
            }
            
            particles.using.splice(particles.using.indexOf(body), 1);
            particles.unused.push(body);

            continue;
        };
    }
});

const particles = {
    unused: [],
    using: []
}

for (let i = 0; i < 1000; ++i) {
    particles.unused.push(Bodies.rectangle(0, 0, 5, 5, { friction: 0.3, restitution: 0 }));
}

Composite.add(engine.world, [ ground, player ]);

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

window.onblur = () => {
    if (!gameStarted || gameEnded) return;
    
    gamePaused = performance.now();
    timeBeforePaused = timer();
}

window.onfocus = () => {
    if (!gameStarted || gameEnded) return;

    const toAdd = performance.now() - gamePaused;

    gameStarted += toAdd;
    lastUpdated += toAdd;
    if (lastParticleCollision) lastParticleCollision.start += toAdd;

    timeBeforePaused = null;

    gamePaused = null;
    updatePhysicsLoop();
}