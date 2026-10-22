import Phaser from 'phaser';

const NJDH_BASE = "https://nj-dispensary-hub.vercel.app";

export default class TitleScene extends Phaser.Scene {
    constructor() { super('TitleScene'); }

    create() {
        const cx = this.cameras.main.centerX, cy = this.cameras.main.centerY;

        this.add.text(cx, cy - 120, 'CANNAFARM', {
            fontFamily: 'monospace', fontSize: '48px', color: '#00E5C7', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(cx, cy - 20, '21+ ONLY\n\nYou are playing a licensed operator.\nUnlicensed home cultivation is illegal in New Jersey.', {
            fontFamily: 'sans-serif', fontSize: '16px', color: '#EDE8DF', align: 'center', lineSpacing: 8
        }).setOrigin(0.5);

        this.add.rectangle(cx, cy + 100, 240, 48, 0xB15CFF)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                try { localStorage.setItem('cf_21_plus', 'true'); } catch (e) {}
                this.scene.start('GameScene');
            });
        
        this.add.text(cx, cy + 100, 'I AM 21+ / ENTER', {
            fontFamily: 'sans-serif', fontSize: '16px', color: '#0C0D10', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(cx, cy + 180, '← Return to NJ Dispensary Hub', {
            fontFamily: 'sans-serif', fontSize: '14px', color: '#00E5C7', fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => {
            window.location.href = `${NJDH_BASE}?ref=cannafarm`;
        });
    }
}
