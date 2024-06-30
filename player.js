class Player {
    constructor({ position, velocity, size, color }) {
        this.position = position;
        this.velocity = velocity;
        this.size = size;
        this.color = color;
        this.friction = 0.1; // Sürtünme katsayısı
        this.acceleration = 0.25; // Hızlanma katsayısı
        this.maxSpeed = 2.5; // Maksimum hız
        this.type = {
            statue: 0,
            balta: {
                color:'blue',
                size : {width: 50, height: 50},
                statue: 'balta'
            },
            kazma: {
                color:'gray',
                size : {width: 50, height: 50},
                statue: 'kazma'
            },
            kılıç: {
                color:'purple',
                size : {width: 50, height: 50},
                statue: 'kılıç'
            },
        }
        this.attackInstance = new Attack({
            player: this,
            size: this.type.balta.size,
            duration: 5,
            color: this.type.balta.color,
        });
    }

    draw(cameraX, cameraY) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x - cameraX, this.position.y - cameraY, this.size.x, this.size.y);
        this.attackInstance.draw(cameraX, cameraY);
    }

    move() {
        if (keys.a.pressed) {
            this.velocity.x = Math.max(this.velocity.x - this.acceleration, -this.maxSpeed);
        } else if (keys.d.pressed) {
            this.velocity.x = Math.min(this.velocity.x + this.acceleration, this.maxSpeed);
        } else {
            if (this.velocity.x > 0) {
                this.velocity.x = Math.max(this.velocity.x - this.friction, 0);
            } else if (this.velocity.x < 0) {
                this.velocity.x = Math.min(this.velocity.x + this.friction, 0);
            }
        }

        if (keys.w.pressed) {
            this.velocity.y = Math.max(this.velocity.y - this.acceleration, -this.maxSpeed);
        } else if (keys.s.pressed) {
            this.velocity.y = Math.min(this.velocity.y + this.acceleration, this.maxSpeed);
        } else {
            if (this.velocity.y > 0) {
                this.velocity.y = Math.max(this.velocity.y - this.friction, 0);
            } else if (this.velocity.y < 0) {
                this.velocity.y = Math.min(this.velocity.y + this.friction, 0);
            }
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Update attack position
        this.attackInstance.update();
    }

    attack(targetX, targetY) {
        this.attackInstance.start(targetX, targetY);
    }
}

class Attack {
    constructor({ player, size, duration, color}) {
        this.player = player;
        this.size = size;
        this.duration = duration;
        this.color = color;
        this.active = false;
        this.angle = 0;
        this.currentDuration = 0;
        this.inactivePosition = { x: -1000, y: -1000 }; // Position when not active
        this.position = { ...this.inactivePosition };
    }

    start(targetX, targetY) {
        this.active = true;
        const dx = targetX - (this.player.position.x + this.player.size.x / 2);
        const dy = targetY - (this.player.position.y + this.player.size.y / 2);
        this.angle = Math.atan2(dy, dx);
        this.currentDuration = this.duration;
        this.position = {
            x: this.player.position.x + Math.cos(this.angle) * (this.player.size.x / 2 + this.size.width / 2),
            y: this.player.position.y + Math.sin(this.angle) * (this.player.size.y / 2 + this.size.height / 2)
        };
    }

    update() {
        if (this.active && this.currentDuration > 0) {
            this.currentDuration--;
        } else {
            this.active = false;
            this.position = { ...this.inactivePosition }; // Move to inactive position
        }
    }

    draw(cameraX, cameraY) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.player.position.x - cameraX + this.player.size.x / 2, this.player.position.y - cameraY + this.player.size.y / 2);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        const attackX = this.player.size.x / 2; // Start just outside the player
        const attackY = -this.size.height / 2; // Center the attack vertically
        ctx.fillRect(attackX, attackY, this.size.width, this.size.height); // Draw the attack
        ctx.restore();
    }
}


const player = new Player({
    position: { x: 5000 / 2, y: 5000 / 2 },
    velocity: { x: 0, y: 0 },
    size: { x: 25, y: 25 },
    color: 'red'
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left + camera.x;
    const mouseY = e.clientY - rect.top + camera.y;
    player.attack(mouseX, mouseY);
});
