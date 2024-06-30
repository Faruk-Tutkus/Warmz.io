let zombies = [];
let trees = []; // Assuming trees is an array, if it is not already declared somewhere else

// Function to initialize or reset the game
function initializeGame() {
    // Reset player position and health
    player.position = { x: 5000 / 2, y: 5000 / 2 };
    player.velocity = { x: 0, y: 0 };
    toolbar.health = 100;
    toolbar.shield = 100;
    toolbar.hunger = 100;
    player.attackInstance.color = player.type.balta.color
    home.health = 100
    toolbar.itemSections.forEach(item => item.count = 0);
    toolbar.selectedSection = 0
    player.type.statue = 0;
    zombies = []
    trees = []

    spawnTrees(trees, treeSpriteSheet);
    zombies = spawnZombies(25);

    // Recreate trees (assuming you have a function for this)
    // trees = spawnTrees();
}

function update() {
    draw();
}

function Collision(object1, object2) {
    const collision = {
        top: false,
        bottom: false,
        left: false,
        right: false,
        fullyInside: false // Nesnenin tam olarak içine girmesi durumu
    };

    const getVertices = (obj) => {
        const angle = obj.angle || 0;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const hw = obj.size.x / 2;
        const hh = obj.size.y / 2;

        const cx = obj.position.x + hw;
        const cy = obj.position.y + hh;

        return [
            { x: cx + hw * cos - hh * sin, y: cy + hw * sin + hh * cos },
            { x: cx - hw * cos - hh * sin, y: cy - hw * sin + hh * cos },
            { x: cx - hw * cos + hh * sin, y: cy - hw * sin - hh * cos },
            { x: cx + hw * cos + hh * sin, y: cy + hw * sin - hh * cos }
        ];
    };

    const vertices1 = getVertices(object1);
    const vertices2 = getVertices(object2);

    const axes = [
        { x: vertices1[1].x - vertices1[0].x, y: vertices1[1].y - vertices1[0].y },
        { x: vertices1[3].x - vertices1[0].x, y: vertices1[3].y - vertices1[0].y },
        { x: vertices2[1].x - vertices2[0].x, y: vertices2[1].y - vertices2[0].y },
        { x: vertices2[3].x - vertices2[0].x, y: vertices2[3].y - vertices2[0].y }
    ];

    const project = (vertices, axis) => {
        let min = (vertices[0].x * axis.x + vertices[0].y * axis.y);
        let max = min;
        for (let i = 1; i < vertices.length; i++) {
            const projection = (vertices[i].x * axis.x + vertices[i].y * axis.y);
            if (projection < min) {
                min = projection;
            }
            if (projection > max) {
                max = projection;
            }
        }
        return { min, max };
    };

    const overlap = (proj1, proj2) => {
        return proj1.max >= proj2.min && proj2.max >= proj1.min;
    };

    let allOverlapping = true;

    for (let i = 0; i < axes.length; i++) {
        const axis = axes[i];
        const proj1 = project(vertices1, axis);
        const proj2 = project(vertices2, axis);
        if (!overlap(proj1, proj2)) {
            return false;
        }
        if (proj1.min < proj2.min || proj1.max > proj2.max) {
            allOverlapping = false;
        }
    }

    if (allOverlapping) {
        collision.fullyInside = true;
    } else {
        collision.fullyInside = false;
    }

    const deltaX = (object1.position.x + object1.size.x / 2) - (object2.position.x + object2.size.x / 2);
    const deltaY = (object1.position.y + object1.size.y / 2) - (object2.position.y + object2.size.y / 2);
    const intersectX = (object1.size.x / 2) + (object2.size.x / 2) - Math.abs(deltaX);
    const intersectY = (object1.size.y / 2) + (object2.size.y / 2) - Math.abs(deltaY);

    if (intersectX > intersectY) {
        if (deltaY > 0) {
            collision.top = true;
        } else {
            collision.bottom = true;
        }
    } else {
        if (deltaX > 0) {
            collision.left = true;
        } else {
            collision.right = true;
        }
    }

    return collision;
}

function returnAttack(player) {
    if (!player.attackInstance.active) {
        return {
            position: player.attackInstance.inactivePosition,
            size: {
                x: player.attackInstance.size.width,
                y: player.attackInstance.size.height
            },
            angle: player.attackInstance.angle
        };
    }
    const attackX = player.position.x + Math.cos(player.attackInstance.angle) * (player.size.x / 2 + player.attackInstance.size.width / 2);
    const attackY = player.position.y + Math.sin(player.attackInstance.angle) * (player.size.y / 2 + player.attackInstance.size.height / 2);
    return {
        position: {
            x: attackX,
            y: attackY
        },
        size: {
            x: player.attackInstance.size.width,
            y: player.attackInstance.size.height
        },
        angle: player.attackInstance.angle
    };
}

function draw() {
    var dir = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    layers.forEach(drawLayer);

    if (Collision(home, player)) {
        home.color = '#ffffff59';
    } else {
        home.color = '#ffffff';
    }

    player.move();
    player.draw(camera.x, camera.y);
    trees.forEach((element, index) => {
        if (Collision(player, element).fullyInside) {
            dir = 1;
        }
        if (!Collision(element, home)) {
            element.draw(camera.x, camera.y);
        } else {
            trees.splice(index, 1);
        }
        if (Collision(element, player)) {
            element.color = '#00FF0059';
        } else {
            element.color = '#ffff00';
        }
        if ((Collision(returnAttack(player), element)) && player.type.statue == 0) {
            element.takeDamage(5);
            if (element.health <= 0) {
                toolbar.itemSections[0].count += 1;
                trees.splice(index, 1);
            }
        }
    });
    zombies.forEach((zombie, index) => {
        if (dir == 0) {
            zombie.update(player.position);
        } else if (dir == 1) {
            zombie.update(home.position);
        }
        zombie.draw(camera.x, camera.y);
        if (Collision(zombie, returnAttack(player)) && player.type.statue == 2) {
            zombie.health -= 10;
            if (zombie.health <= 0) {
                zombies.splice(index, 1);
            }
        }
        if (Collision(zombie, player)) {
            toolbar.health -= 1;
            if (toolbar.health <= 0) {
                console.log('you are dead');
                initializeGame(); // Restart the game
            }
        }
        if (Collision(zombie, home)) {
            home.takeDamage(0.01)
            if (home.health <= 0) {
                initializeGame()
            }
        }
    });
    home.draw(camera.x, camera.y);
    toolbar.updatePosition();
    toolbar.draw();
    ctx.fillStyle = '#0000AA20';
    ctx.fillRect(-camera.x, -camera.y, gameWorld.width, gameWorld.height);
    ctx.restore();
}


function gameLoop() {
    updateCamera();
    update();
    window.requestAnimationFrame(gameLoop);
}

// Start the game initially
initializeGame();
gameLoop();
