class ToolBar {
    constructor({ position, width, height, color, padding, gap, toolCount, itemCount, verticalPadding, toolLabels, itemLabels, itemCounts, health, shield, hunger }) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
        this.padding = padding; // ToolBar başındaki ve sonundaki boşluk
        this.gap = gap; // Bölmeler arasındaki boşluk
        this.toolCount = toolCount; // Tool bölme sayısı
        this.itemCount = itemCount; // Item bölme sayısı
        this.verticalPadding = verticalPadding; // Bölmelerin üstünde ve altında boşluk
        this.toolLabels = toolLabels; // Tool bölmelerin etiketleri
        this.itemLabels = itemLabels; // Item bölmelerin etiketleri
        this.itemCounts = itemCounts; // Item bölmelerin sayıları
        this.health = health; // Can barı
        this.shield = shield; // Kalkan barı
        this.hunger = hunger; // Açlık barı
        this.toolSections = []; // Tool bölümleri
        this.itemSections = []; // Item bölümleri
        this.selectedSection = 0; // Seçili bölüm
        this.hoveredBar = null; // Üzerine gelinen bar

        this.createSections(); // Parçaları oluştur
    }

    createSections() {
        this.toolSections = []; // Tool bölümlerini temizle
        this.itemSections = []; // Item bölümlerini temizle

        const sectionSize = Math.min((this.width / 2 - 2 * this.padding - (Math.max(this.toolCount, this.itemCount) - 1) * this.gap) / Math.max(this.toolCount, this.itemCount), this.height - 2 * this.verticalPadding);

        // Tool bölümlerini oluştur
        for (let i = 0; i < this.toolCount; i++) {
            this.toolSections.push({
                x: this.position.x + this.padding + i * (sectionSize + this.gap),
                y: this.position.y + this.verticalPadding,
                size: sectionSize,
                color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                label: this.toolLabels[i],
                showLabel: true
            });
        }

        // Item bölümlerini oluştur
        for (let i = 0; i < this.itemCount; i++) {
            this.itemSections.push({
                x: this.position.x + this.width / 2 + this.padding + i * (sectionSize + this.gap),
                y: this.position.y + this.verticalPadding,
                size: sectionSize,
                color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                label: this.itemLabels[i],
                count: this.itemCounts[i],
                showLabel: true
            });
        }
    }

    drawBars() {
        // Health bar
        const healthBarHeight = 40;
        const healthBarWidth = this.width;
        const healthBarX = this.position.x;
        const healthBarY = this.position.y - healthBarHeight - 10;
        ctx.fillStyle = '#ff0000AA';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth * (this.health / 100), healthBarHeight);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        // Shield bar
        const shieldBarHeight = healthBarHeight - 10;
        const shieldBarWidth = this.width / 2 - 10;
        const shieldBarX = this.position.x;
        const shieldBarY = healthBarY - shieldBarHeight - 10;
        ctx.fillStyle = '#0000ffAA';
        ctx.fillRect(shieldBarX, shieldBarY, shieldBarWidth * (this.shield / 100), shieldBarHeight);
        ctx.strokeRect(shieldBarX, shieldBarY, shieldBarWidth, shieldBarHeight);

        // Hunger bar
        const hungerBarHeight = healthBarHeight - 10;
        const hungerBarWidth = this.width / 2 - 10;
        const hungerBarX = this.position.x + shieldBarWidth + 20;
        const hungerBarY = shieldBarY;
        ctx.fillStyle = '#00ff00AA';
        ctx.fillRect(hungerBarX, hungerBarY, hungerBarWidth * (this.hunger / 100), hungerBarHeight);
        ctx.strokeRect(hungerBarX, hungerBarY, hungerBarWidth, hungerBarHeight);

        // Hovered bar
        if (this.hoveredBar) {
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'center';
            let textX = healthBarX + healthBarWidth / 2;
            let textY = healthBarY - 10;
            let value = 0;
            let label = '';
            switch (this.hoveredBar) {
                case 'health':
                    label = 'Health';
                    value = this.health;
                    textX = healthBarX + healthBarWidth / 2;
                    textY = healthBarY + healthBarHeight / 2;
                    break;
                case 'shield':
                    label = 'Shield';
                    value = this.shield;
                    textX = shieldBarX + shieldBarWidth / 2;
                    textY = shieldBarY + shieldBarHeight / 2;
                    break;
                case 'hunger':
                    label = 'Hunger';
                    value = this.hunger;
                    textX = hungerBarX + hungerBarWidth / 2;
                    textY = hungerBarY + hungerBarHeight / 2;
                    break;
            }
            ctx.fillText(`${label}: ${value}`, textX, textY);
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        this.drawBars(); // Can, kalkan ve açlık barlarını çiz

        // Her bir tool bölümü çiz
        this.toolSections.forEach((section, index) => {
            ctx.fillStyle = section.color;
            ctx.globalAlpha = (this.selectedSection === index) ? 1.0 : 0.5; // Seçili bölüm tam renkte, diğerleri saydam
            ctx.fillRect(section.x, section.y, section.size, section.size);
            ctx.globalAlpha = 1.0; // Alpha değerini sıfırla

            // Eğer label gösteriliyorsa, yazıyı çiz
            if (section.showLabel) {
                ctx.fillStyle = 'black';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const textY = section.y + section.size / 2;
                ctx.fillText(section.label, section.x + section.size / 2, textY);
            }
        });

        // Her bir item bölümü çiz
        this.itemSections.forEach((section, index) => {
            ctx.fillStyle = section.color;
            ctx.globalAlpha = 1.0; // Tüm item bölümleri tam renkte
            ctx.fillRect(section.x, section.y, section.size, section.size);
            ctx.globalAlpha = 1.0; // Alpha değerini sıfırla

            // Eğer label gösteriliyorsa, yazıyı çiz
            ctx.fillStyle = 'black';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const textY = section.y + section.size / 2;
            ctx.fillText(section.label, section.x + section.size / 2, textY - 10);
            ctx.fillText(section.count, section.x + section.size / 2, textY + 10);
        });

        // Seçili silahın adını ekranda göster
        if (this.selectedSection !== null) {
            ctx.fillStyle = 'white';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(this.toolSections[this.selectedSection].label, canvas.width / 2, 10);
        }
    }

    updatePosition() {
        this.position.x = canvas.width / 2 - this.width / 2;
        this.position.y = canvas.height - this.height - 10;

        // ToolBar'ı canvas içinde tutmak için sınırlandırma
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > canvas.width) this.position.x = canvas.width - this.width;
        if (this.position.y < 0) this.position.y = 0;
        if (this.position.y + this.height > canvas.height) this.position.y = canvas.height - this.height;

        // Her bir bölümün pozisyonunu güncelle
        const sectionSize = Math.min((this.width / 2 - 2 * this.padding - (Math.max(this.toolCount, this.itemCount) - 1) * this.gap) / Math.max(this.toolCount, this.itemCount), this.height - 2 * this.verticalPadding);

        this.toolSections.forEach((section, index) => {
            section.x = this.position.x + this.padding + index * (sectionSize + this.gap);
            section.y = this.position.y + this.verticalPadding;
            section.size = sectionSize;
        });

        this.itemSections.forEach((section, index) => {
            section.x = this.position.x + this.width / 2 + this.padding + index * (sectionSize + this.gap);
            section.y = this.position.y + this.verticalPadding;
            section.size = sectionSize;
        });
    }

    setItemCount(newCount) {
        this.itemCount = newCount;
        this.createSections();
    }

    handleMouseMove(mouseX, mouseY) {
        let needsRedraw = false;
        this.toolSections.forEach(section => {
            const wasShowing = section.showLabel;
            section.showLabel = mouseX >= section.x && mouseX <= section.x + section.size &&
                mouseY >= section.y && mouseY <= section.y + section.size;
            if (wasShowing !== section.showLabel) {
                needsRedraw = true;
            }
        });

        this.itemSections.forEach(section => {
            section.showLabel = true; // Item bölümlerinde her zaman göster
        });

        const barX = this.position.x;
        const healthBarY = this.position.y - 50;
        const shieldBarY = this.position.y - 90;
        const hungerBarY = this.position.y - 90;
        const barWidth = this.width;
        const halfBarWidth = this.width / 2 - 10;

        const hoveredBar = (mouseX >= barX && mouseX <= barX + barWidth) && (
            (mouseY >= healthBarY && mouseY <= healthBarY + 40 && (this.hoveredBar = 'health')) ||
            (mouseX >= barX && mouseX <= barX + halfBarWidth && mouseY >= shieldBarY && mouseY <= shieldBarY + 20 && (this.hoveredBar = 'shield')) ||
            (mouseX >= barX + halfBarWidth + 20 && mouseX <= barX + barWidth && mouseY >= hungerBarY && mouseY <= hungerBarY + 20 && (this.hoveredBar = 'hunger'))
        );

        if (!hoveredBar) {
            this.hoveredBar = null;
        }

        return needsRedraw || hoveredBar;
    }

    handleKeyDown(key) {
        switch (key) {
            case '1':
                this.selectedSection = 0;
                player.attackInstance.size = player.type.balta.size
                player.attackInstance.color = player.type.balta.color
                player.type.statue = 0
                break;
            case '2':
                this.selectedSection = 1;
                player.attackInstance.size = player.type.kazma.size
                player.attackInstance.color = player.type.kazma.color
                player.type.statue = 1
                break;
            case '3':
                this.selectedSection = 2;
                player.attackInstance.size = player.type.kılıç.size
                player.attackInstance.color = player.type.kılıç.color
                player.type.statue = 2
                break;
            case '4':
                this.selectedSection = 3;
                player.attackInstance.size = player.type.balta.size
                player.attackInstance.color = player.type.balta.color
                player.type.statue = 3
                break;
            case '5':
                this.selectedSection = 4;
                player.attackInstance.size = player.type.balta.size
                player.attackInstance.color = player.type.balta.color
                player.type.statue = 4
                break;
        }
        return true; // Always redraw on keydown
    }
}

const toolbar = new ToolBar({
    position: {
        x: 0,
        y: 0
    },
    width: 700,
    height: 80,
    color: '#54AB7750',
    padding: 10,
    gap: 10,
    toolCount: 5, // Başlangıçta 5 tool
    itemCount: 5, // Başlangıçta 5 item
    verticalPadding: 10, // Üstte ve altta 10 piksel boşluk
    toolLabels: ['Balta', 'Kazma', 'Kılıç', 'Ok ve Yay', 'Bomba'],
    itemLabels: ['Odun', 'Taş', 'Demir', 'Altın', 'Elmas'],
    itemCounts: [0, 0, 0, 0, 0],
    health: 100,
    shield: 100,
    hunger: 100
});

window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    if (toolbar.handleMouseMove(mouseX, mouseY)) {
        toolbar.draw();
    }
});

window.addEventListener('keydown', (e) => {
    if (toolbar.handleKeyDown(e.key)) {
        toolbar.draw();
    }
});
