function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    //let throwParticle = 0;
    Events.on(engine, 'beforeUpdate', () => {
        // Movement

        if (keyIsDown(87) && touchingGround === true) { // W
            touchingGround = false;
            Body.applyForce(player, player.position, { x: 0, y: -.05 });
        }

        //const collidingSides = {
        //    left: Collision.collides(player, maxLeft) || { collided: false },
        //    right: Collision.collides(player, maxRight) || { collided: false }
        //}

        if (keyIsDown(65)) { // A // && collidingSides.left.collided === false
            Body.applyForce(player, player.position, { x: -.005, y: 0 });
        }

        if (keyIsDown(68)) { // D // && collidingSides.right.collided === false
            Body.applyForce(player, player.position, { x: .005, y: 0 });
        }

        // Ground and corners.

        Body.setPosition(ground, { x: player.position.x, y: 100 });

        //if (player.position.x > MAX_DISTANCE) {
        //    Body.setPosition(player, { x: MAX_DISTANCE, y: player.position.y });
        //}

        //if (player.position.x < -MAX_DISTANCE) {
        //    Body.setPosition(player, { x: -MAX_DISTANCE, y: player.position.y });
        //}

        // Particles

        //++throwParticle;
        //if (throwParticle !== 1) {
        //    if (++throwParticle > 50) throwParticle = 0;
        //    return;
        //};

        if (particles.unused.length !== 0) {
            const particle = particles.unused.shift();
            let x;

            if (pointParticle) {
                x = (Math.random() * 14400) + player.position.x - 6400;
            } else {
                pointParticle = particle;
                x = (Math.random() * 400) + player.position.x - 200;
            }

            Body.setPosition(particle, {
                x, //: x > MAX_DISTANCE ? MAX_DISTANCE : (x < -MAX_DISTANCE ? -MAX_DISTANCE : x),
                y: -1000
            });

            Composite.add(engine.world, particle);

            particles.using.push(particle);
        }

        const toRemove = [];
        for (const particle of particles.using) {
            if (particle.position.y > 200) {
                if (pointParticle === particle) pointParticle = null;

                toRemove.push(particle);

                particles.using.splice(particles.using.indexOf(particle), 1);
                particles.unused.push(particle);
            }
        }
        Composite.remove(engine.world, toRemove);
    });
}

function draw() {
    clear();
    background(222);

    const waves = [
        // Mountains on the back.
        {
            r: 200,
            g: 200,
            b: 200,

            a: 40,
            h: -player.positionPrev.x / 10,
            c: 100,
            k: canvas.height / 5,

            rotateMultiply: 0.1
        }
    ];

    for (const { r, g, b, a, h, c, k } of waves) {
        push();
        beginShape();
    
        noStroke();
        fill(r, g, b);
    
        vertex(width + 100, height + 100);
        vertex(-100, height + 100);
    
        for (let x = 0; x < canvas.width; ++x) {
            const y = a * Math.sin((x - h) / c) + k;
            vertex(x, y);
        }
    
        endShape(CLOSE);
        pop();
    }

    translatePush(ground.position.x, ground.position.y);
    rectMode(CENTER);
    rect(0, 0, 90, 30);
    pop();

    translatePush(player.position.x, player.position.y);
    rectMode(CENTER);
    rotate(player.angle);
    if (lastParticleCollision && performance.now() < lastParticleCollision.start + 255) {
        const values = Math.round(performance.now() - lastParticleCollision.start);
        if (lastParticleCollision.type === true) { // point
            fill(`rgb(${values},255,${values})`);
        } else { // damaged
            fill(`rgb(255,${values},${values})`);
        }
    }
    square(0, 0, 30);
    pop();

    for (const particle of particles.using) {
        translatePush(particle.position.x, particle.position.y);
        rectMode(CENTER);
        rotate(particle.angle);
        noStroke();
        fill(particle === pointParticle ? "green" : "red");
        square(0, 0, particle === pointParticle ? 10 : 5);
        pop();
    }

    //translatePush(0, 0);
    //rectMode(CENTER);
    //square(0, 0, 30);
    //pop();

    if (gameEnded) {
        push();
        translate(canvas.width / 2, canvas.height / 2.5);
        textAlign(CENTER);
        textSize(30);
        text(`You lose!\nScore: ${points} points\nStayed alive for ${stayedAliveFor} seconds.\n\nClick SPACE to restart.`, 0, 0);
        pop();
    } else if (!gameStarted) {
        push();
        translate(canvas.width / 2, canvas.height / 2);
        textAlign(CENTER);
        textSize(50);
        text(`Click SPACE to start.`, 0, 0);
        pop();
    } else {
        push();
        textSize(30);
        text(`HP: ${hp}\nScore: ${points} points\nTimer: ${timeBeforePaused|| timer()} seconds`, 30, 50);
        pop();
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function translatePush(translateX, translateY) {
    push();
    translate(translateX - player.positionPrev.x + (window.innerWidth / 2), translateY - player.positionPrev.y + (window.innerHeight / 1.5));
}

function keyPressed() {
    if (!keyIsDown(32) || gameStarted) return;

    pointParticle = null;
    Composite.remove(engine.world, particles.using);
    for (const particle of particles.using) particles.unused.push(particle);
    particles.using = [];
    
    points = 0;
    hp = 5;

    lastUpdated = performance.now();
    lastUpdatedOffset = 0;
    physicsOffset = null;
    physicsLoop = null;

    gameEnded = false;
    stayedAliveFor = null;

    gameStarted = performance.now();
    lastUpdated = performance.now();

    updatePhysicsLoop();
}