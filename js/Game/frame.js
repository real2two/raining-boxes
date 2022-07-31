Events.on(engine, 'beforeUpdate', () => {
    // Movement

    if ((keyIsDown(32) || keyIsDown(38) || keyIsDown(87)) && touchingGround === true) { // space, up arrow key, w
        touchingGround = false;
        Body.applyForce(player, player.position, { x: 0, y: -.05 });
    }

    if (keyIsDown(37) || keyIsDown(65)) { // left arrow key, a
        for (let i = 0; i < (player.velocity.x > 0 ? 3 : 1); ++i) {
            Body.applyForce(player, player.position, { x: -.005 * playerSpeed, y: 0 });
        }
    } else if (keyIsDown(39) || keyIsDown(68)) { // right arrow key, d
        for (let i = 0; i < (player.velocity.x < 0 ? 3 : 1); ++i) {
            Body.applyForce(player, player.position, { x: .005 * playerSpeed, y: 0 });
        }
    } else {
        Body.setVelocity(player, { x: player.velocity.x / 100, y: player.velocity.y });
    }
    
    // Ground and corners.
    Body.setPosition(ground, { x: player.position.x, y: 100 });

    // Particles

    if (particleDifficulty !== 0) {
        ++throwParticle;
        if (throwParticle !== 1) {
            if (++throwParticle > particleDifficulty) throwParticle = 0;
            return;
        };
    }

    for (let i = 0; i < maxParticlesToAdd; ++i) {
        if (particles.unused.length !== 0) {
            const particle = particles.unused.shift();
            let x;
    
            if (pointParticle.length < maxGreenBoxes && Math.floor(Math.random() * pointParticle.length * 2) === 0) {
                pointParticle.push(particle);
                Body.scale(particle, 2.5, 2.5);
                x = (Math.random() * 400) + player.position.x - 200;
            } else {
                x = (Math.random() * 14400) + player.position.x - 6400;
            }
    
            Body.setPosition(particle, {
                x,
                y: -1000
            });
    
            Composite.add(engine.world, particle);
    
            particles.using.push(particle);
        }
    }

    const toRemove = [];
    for (const particle of particles.using) {
        if (particle.position.y > 200) {
            if (pointParticle.includes(particle)) {
                Body.scale(particle, 0.4, 0.4);
                pointParticle.splice(pointParticle.indexOf(particle), 1);
            }

            toRemove.push(particle);

            particles.using.splice(particles.using.indexOf(particle), 1);
            particles.unused.push(particle);
        }
    }
    Composite.remove(engine.world, toRemove);

    if (player.position.y > 200) {
        return endGame();
    }
});

Events.on(engine, 'afterUpdate', () => {
    // Ground and corners.
    Body.setPosition(ground, { x: player.position.x, y: 100 });
});