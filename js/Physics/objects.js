const ground = Bodies.rectangle(0, 100, 90, 30, { isStatic: true, friction: 0.3, restitution: 0.6 });
const player = Bodies.rectangle(0, 0, 30, 30, { friction: 0.3, restitution: 0 });

Body.setInertia(player, 1000);

const particles = {
    unused: [],
    using: []
}

for (let i = 0; i < 1000; ++i) {
    particles.unused.push(Bodies.rectangle(0, 0, 5, 5, { friction: 0.3, restitution: 0 }));
}

Composite.add(engine.world, [ ground, player ]);