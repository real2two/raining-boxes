function keyPressed() {
    if (!audioTrack.isLoaded() || !grabPoint.isLoaded() || !hitSound.isLoaded()) return;
    if (!keyIsDown(32) || gameStarted) return;

    pointParticle = [];
    Composite.remove(engine.world, particles.using);
    for (const particle of particles.using) particles.unused.push(particle);
    particles.using = [];
    
    points = 0;
    hp = 5;

    lastUpdated = performance.now();
    lastUpdatedOffset = 0;
    physicsOffset = null;
    physicsLoop = null;

    Body.setVelocity(player, { x: 0, y: 0 });
    Body.setAngularVelocity(player, 0);

    gameEnded = false;
    stayedAliveFor = null;

    throwParticle = 0;
    particleDifficulty = 25;

    speed = 1;

    maxGreenBoxes = 3;

    gameStarted = performance.now();
    lastUpdated = performance.now();

    audioTrack.rate(1);
    audioTrack.loop();

    updatePhysicsLoop();
}