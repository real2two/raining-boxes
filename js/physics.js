//const MAX_DISTANCE = 800;

let gameStarted;
let gamePaused;
let gameEnded = false;

const timer = () => (performance.now() - gameStarted) / 1000;
let timeBeforePaused;
let stayedAliveFor;

let lastParticleCollision;

let throwParticle = 0;
let particleDifficulty = 25;

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

//const maxLeft = Bodies.rectangle(-MAX_DISTANCE - 30, -1000, 30, 1100, { isStatic: true, restitution: 1 });
//const maxRight = Bodies.rectangle(MAX_DISTANCE, -1000, 30, 1100, { isStatic: true, restitution: 1 });

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
                type: pointParticle === body // false = damaged, true = point
            };

            if (pointParticle === body) {
                ++points;
                if (particleDifficulty > 0) --particleDifficulty;
                pointParticle = null;
            } else {
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

let pointParticle;

for (let i = 0; i < 1000; ++i) {
    particles.unused.push(Bodies.rectangle(0, 0, 5, 5, { friction: 0.3, restitution: 0 }));
}

Composite.add(engine.world, [ ground, player ]); // , maxLeft, maxRight

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