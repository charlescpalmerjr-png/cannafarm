import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        this.add.text(cx, cy - 120, 'CANNAFARM', {
            fontFamily: 'monospace',
            fontSize: '48px',
            color: '#00E5C7',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        const disclaimerText = '21+ ONLY\n\nYou are playing a licensed operator.\nUnlicensed home cultivation is illegal in New Jersey.';
        this.add.text(cx, cy - 20, disclaimerText, {
            fontFamily: 'sans-serif',
            fontSize: '16px',
            color: '#EDE8DF',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);

        const btn = this.add.rectangle(cx, cy + 100, 240, 48, 0xB15CFF)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('GameScene');
            });
        
        this.add.text(cx, cy + 100, 'I AM 21+ / ENTER', {
            fontFamily: 'sans-serif',
            fontSize: '16px',
            color: '#0C0D10',
            fontWeight: 'bold'
        }).setOrigin(0.5);
    }
}
