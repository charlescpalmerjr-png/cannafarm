import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        this.add.text(cx, 60, 'Facility: Class 1 Cultivator', {
            fontFamily: 'sans-serif',
            fontSize: '20px',
            color: '#00E5C7',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        this.drawIsoGrid(cx, cy + 50);
    }

    drawIsoGrid(startX, startY) {
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xEDE8DF, 0.4);

        const tileW = 128;
        const tileH = 64;

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                const isoX = startX + (x - y) * (tileW / 2);
                const isoY = startY + (x + y) * (tileH / 2);
                
                graphics.beginPath();
                graphics.moveTo(isoX, isoY - tileH / 2);
                graphics.lineTo(isoX + tileW / 2, isoY);
                graphics.lineTo(isoX, isoY + tileH / 2);
                graphics.lineTo(isoX - tileW / 2, isoY);
                graphics.closePath();
                graphics.strokePath();
            }
        }
    }
}
