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