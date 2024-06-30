class Zombie {
    constructor({ position, size, speed, color }) {
        this.position = position;
        this.size = size;
        this.speed = speed;
        this.color = color;
        this.angle = 0; // Zombinin dönme açısı
        this.health = 100; // Zombinin başlangıç sağlığı
    }

    draw(cameraX, cameraY) {
        ctx.save();
        ctx.translate(this.position.x - cameraX + this.size.x / 2, this.position.y - cameraY + this.size.y / 2);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
        ctx.restore();

        // Can barını çiz
        this.drawHealthBar(cameraX, cameraY);
    }

    drawHealthBar(cameraX, cameraY) {
        const barWidth = this.size.x;
        const barHeight = 5;
        const barX = this.position.x - cameraX;
        const barY = this.position.y - cameraY - barHeight - 5; // Zombinin biraz üstünde olacak şekilde
        ctx.save()
        ctx.fillStyle = 'red';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        ctx.fillStyle = 'green';
        ctx.fillRect(barX, barY, (this.health / 100) * barWidth, barHeight);
    }

    update(playerPosition) {
        // Oyuncunun pozisyonunu takip et
        const dx = playerPosition.x - this.position.x;
        const dy = playerPosition.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Hedefe doğru hareket et
        if (distance > 0) {
            this.position.x += (dx / distance) * this.speed;
            this.position.y += (dy / distance) * this.speed;
        }

        // Zombinin dönme açısını hesapla
        this.angle = Math.atan2(dy, dx);
    }
}

// Rastgele zombi oluşturma fonksiyonu
function spawnZombies(numberOfZombies) {
    const zombies = [];
    for (let i = 0; i < numberOfZombies; i++) {
        const zombie = new Zombie({
            position: {
                x: Math.random() * 5000,
                y: Math.random() * 5000
            },
            size: {
                x: 25,
                y: 25
            },
            speed: 1,
            color: 'green'
        });
        zombies.push(zombie);
    }
    return zombies;
}

