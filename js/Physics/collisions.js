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