import Phaser from 'phaser';

const STAGES = ['Empty Plot', 'Germination', 'Seedling', 'Vegetative', 'Flowering', 'Harvested', 'Drying', 'Curing', 'Lab Tested'];

export default class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }

    init() {
        this.state = { capital: 5000, day: 1, stageIdx: 0, progress: 0, temp: 25, rh: 60, lightCycle: '18/6' };
        try {
            const saved = localStorage.getItem('cf_save');
            if (saved) this.state = JSON.parse(saved);
        } catch(e) {}
    }

    saveProgress() {
        try { localStorage.setItem('cf_save', JSON.stringify(this.state)); } catch(e) {}
        this.updateUI();
    }

    calcVPD(temp, rh) {
        // Tetens Equation: SVP in kPa
        const SVP = 0.61078 * Math.exp((17.27 * temp) / (temp + 237.3));
        return (SVP * (1 - rh / 100)).toFixed(2);
    }

    create() {
        this.cx = this.cameras.main.centerX;
        this.cy = this.cameras.main.centerY;
        
        this.drawIsoGrid(this.cx, this.cy + 20);
        this.buildUI();
        this.updateUI();
    }

    buildUI() {
        this.infoText = this.add.text(20, 20, '', { 
            fontFamily: 'sans-serif', fontSize: '16px', color: '#EDE8DF', lineSpacing: 6 
        });
        
        this.actionBtn = this.createBtn(this.cx, this.cy + 160, 'Action', () => this.doAction());
        this.tickBtn = this.createBtn(this.cx, this.cy + 220, 'Next Day (+25%)', () => this.tickDay());
    }

    createBtn(x, y, label, cb) {
        const bg = this.add.rectangle(x, y, 200, 40, 0x00E5C7).setInteractive({useHandCursor:true}).on('pointerdown', cb);
        const txt = this.add.text(x, y, label, { fontFamily: 'sans-serif', fontSize: '14px', color: '#0C0D10', fontStyle: 'bold' }).setOrigin(0.5);
        return { bg, txt };
    }

    tickDay() {
        this.state.day++;
        this.state.capital -= 10; // Overhead
        if (this.state.stageIdx > 0 && this.state.stageIdx < 8) {
            this.state.progress += 25;
            if (this.state.progress >= 100) {
                this.state.progress = 0;
                this.state.stageIdx++;
                if (this.state.stageIdx === 4) this.state.lightCycle = '12/12'; // Flowering Trigger
            }
        }
        this.saveProgress();
    }

    doAction() {
        const s = this.state.stageIdx;
        if (s === 0 && this.state.capital >= 50) { 
            this.state.stageIdx = 1; this.state.capital -= 50; this.state.lightCycle = '18/6';
        } else if (s === 8) { 
            this.state.stageIdx = 0; this.state.capital += 350; 
        }
        this.saveProgress();
    }

    updateUI() {
        const { capital, day, stageIdx, progress, temp, rh, lightCycle } = this.state;
        const vpd = this.calcVPD(temp, rh);
        
        this.infoText.setText(
            `Class 1 Cultivator\nCapital: $C ${capital} | Day: ${day}\n` +
            `Stage: ${STAGES[stageIdx]} ${stageIdx > 0 && stageIdx < 8 ? '('+progress+'%)' : ''}\n` +
            `Environment: ${temp}°C, ${rh}% RH\n` +
            `Calculated VPD: ${vpd} kPa | Lights: ${lightCycle}`
        );

        let label = (stageIdx > 0 && stageIdx < 8) ? 'Growing...' : 'Action';
        if (stageIdx === 0) label = 'Plant Seed ($C 50)';
        else if (stageIdx === 8) label = 'Wholesale ($C 350)';
        
        this.actionBtn.txt.setText(label);
        this.actionBtn.bg.setFillStyle((stageIdx === 0 || stageIdx === 8) ? 0xB15CFF : 0x555555);
    }

    drawIsoGrid(startX, startY) {
        const g = this.add.graphics(); g.lineStyle(2, 0xEDE8DF, 0.4);
        const tw = 128, th = 64;
        for (let x=0; x<3; x++) {
            for (let y=0; y<3; y++) {
                const ix = startX + (x-y)*(tw/2), iy = startY + (x+y)*(th/2);
                g.beginPath(); g.moveTo(ix, iy-th/2); g.lineTo(ix+tw/2, iy); g.lineTo(ix, iy+th/2); g.lineTo(ix-tw/2, iy); g.closePath(); g.strokePath();
            }
        }
    }
}
