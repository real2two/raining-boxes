function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
    clear();
    background(222);

    const waves = [
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
        fill(pointParticle.includes(particle) ? "green" : "red");
        square(0, 0, pointParticle.includes(particle) ? 12.5 : 9);
        pop();
    }

    if (gameEnded) {
        push();
        translate(canvas.width / 2, canvas.height / 2.5);
        textAlign(CENTER);
        textSize(20 * (height / 720));
        text(`You lose!\nScore: ${points} points\nStayed alive for ${stayedAliveFor} seconds.\n\nClick SPACE to restart.`, 0, 0);
        pop();
    } else if (!gameStarted) {
        push();
        translate(width / 2, height / 2);
        textAlign(CENTER);
        textSize(50 * (height / 720));
        text(`Click SPACE to start.`, 0, 0);
        pop();
    } else {
        push();
        textSize(25 * (height / 720));
        text(`HP: ${hp}\nScore: ${points} points\nTimer: ${timeBeforePaused || timer()} seconds`, 30, 50);
        pop();
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function translatePush(translateX, translateY) {
    push();
    translate(translateX - player.position.x + (window.innerWidth / 2), translateY - player.position.y + (window.innerHeight / 1.5));
}