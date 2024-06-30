class Home {
    constructor({ position, size, color }) {
        this.position = position;
        this.size = size;
        this.color = color;
        this.health = 100;
        this.maxHealth = this.health; // Store the maximum health
    }

    draw(cameraX, cameraY) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x - cameraX, this.position.y - cameraY, this.size.x, this.size.y);

        if (this.health < this.maxHealth) {
            this.drawHealthBar(cameraX, cameraY);
        }
    }

    drawHealthBar(cameraX, cameraY) {
        const healthBarWidth = this.size.x;
        const healthBarHeight = 10;
        const healthRatio = this.health / this.maxHealth;
        const healthBarX = this.position.x - cameraX;
        const healthBarY = this.position.y - cameraY - healthBarHeight - 5;

        ctx.fillStyle = 'red';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        ctx.fillStyle = 'green';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthRatio, healthBarHeight);
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            // Handle the home being destroyed, if needed
        }
    }
}
// Create home object
const home = new Home({
    position: {
        x: 5000 / 2,
        y: 5000 / 2,
    },
    size: {
        x: 200,
        y: 200
    },
    color: '#ffffff'
});
class Tree {
    constructor({ position, size, color, health, spriteSheet, frameCount }) {
        this.position = position;
        this.size = size;
        this.color = color;
        this.health = health || 100; // Default health value if not provided
        this.maxHealth = this.health;
        this.spriteSheet = spriteSheet; // Sprite sheet for animation
        this.frameCount = frameCount; // Number of frames in the sprite sheet
        this.currentFrame = 0; // Current frame for animation
        this.frameWidth = this.spriteSheet.width / this.frameCount; // Width of a single frame
        this.frameHeight = this.spriteSheet.height / 2; // Height of a single frame
        this.frameDuration = 1000 / 10; // Duration of each frame in milliseconds (20 FPS)
        this.lastFrameUpdateTime = 0; // Timestamp of the last frame update
    }

    draw(cameraX, cameraY) {
        const currentTime = Date.now();

        if (this.spriteSheet) {
            // Draw the current frame of the sprite sheet (only the first row)
            ctx.drawImage(
                this.spriteSheet,
                this.currentFrame * this.frameWidth, 0, // Source x, y (first row only)
                this.frameWidth, this.frameHeight, // Source width, height
                this.position.x - cameraX, this.position.y - cameraY, // Destination x, y
                this.size.x, this.size.y // Destination width, height
            );

            // Update the frame for animation if enough time has passed
            if (currentTime - this.lastFrameUpdateTime > this.frameDuration) {
                this.currentFrame = (this.currentFrame + 1) % this.frameCount;
                this.lastFrameUpdateTime = currentTime;
            }
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x - cameraX, this.position.y - cameraY, this.size.x, this.size.y);
        }

        if (this.health < this.maxHealth) {
            this.drawHealthBar(cameraX, cameraY);
        }
    }

    drawHealthBar(cameraX, cameraY) {
        const healthBarWidth = this.size.x;
        const healthBarHeight = 5;
        const healthRatio = this.health / this.maxHealth;
        const healthBarX = this.position.x - cameraX;
        const healthBarY = this.position.y - cameraY - healthBarHeight - 5;

        ctx.fillStyle = 'red';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        ctx.fillStyle = 'green';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthRatio, healthBarHeight);
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
        }
    }
}


// Function to spawn trees
function spawnTrees(treeArray, spriteSheet) {
    for (let i = 0; i < 250; i++) {
        treeArray.push(
            new Tree({
                position: {
                    x: Math.floor(Math.random() * 5000),
                    y: Math.floor(Math.random() * 5000)
                },
                size: {
                    x: 192,
                    y: 192
                },
                color: '#ffff00',
                health: 100, // Adding health to each tree
                spriteSheet: spriteSheet, // Adding sprite sheet for animation
                frameCount: 4 // Using 3 frames for the animation
            })
        );
    }
}

// Load the sprite sheet image
const treeSpriteSheet = new Image();
treeSpriteSheet.height = 192 * 2
treeSpriteSheet.src = 'src/Tree.png'; // Update the path to the sprite sheet
treeSpriteSheet.onload = () => {
    const trees = [];
    spawnTrees(trees, treeSpriteSheet);
    // You can now use the trees array in your game loop
};
