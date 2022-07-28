Events.on(engine, 'beforeUpdate', () => {
    // Movement

    if ((keyIsDown(32) || keyIsDown(38) || keyIsDown(87)) && touchingGround === true) { // space, up arrow key, w
        touchingGround = false;
        Body.applyForce(player, player.position, { x: 0, y: -.05 });
    }

    if (keyIsDown(37) || keyIsDown(65)) { // left arrow key, a
        Body.applyForce(player, player.position, { x: -.005 * speed, y: 0 });
    }

    if (keyIsDown(39) || keyIsDown(68)) { // right arrow key, d
        Body.applyForce(player, player.position, { x: .005 * speed, y: 0 });
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
});