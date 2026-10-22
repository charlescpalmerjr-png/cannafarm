import Phaser from 'phaser';

const STAGES = ['Empty', 'Germination', 'Seedling', 'Vegetative', 'Flowering', 'Harvested', 'Drying', 'Curing', 'Tested (Pass)', 'Tested (Fail)'];
const MINUTE = 60000;
// Growth timers (in ms) for vertical slice tuning
const STAGE_TIMES = [0, 1*MINUTE, 1*MINUTE, 2*MINUTE, 2*MINUTE, 0, 1*MINUTE, 1*MINUTE, 0, 0];

export default class GameScene extends Phaser.Scene {
    constructor() { super('GameScene'); }

    init() {
        const now = Date.now();
        this.state = {
            capital: 5000, temp: 25, rh: 60, light: '18/6',
            plots: Array(9).fill(null).map((_, i) => ({
                id: i, stage: 0, progress: 0, stress: 0, grade: '', 
                lastUpdate: now, waterTs: 0, feedTs: 0 
            }))
        };
        try {
            const saved = localStorage.getItem('cf_save');
            if (saved) {
                this.state = JSON.parse(saved);
                // Catch up offline time
                this.state.plots.forEach(p => { if(!p.lastUpdate) p.lastUpdate = Date.now(); });
            }
        } catch(e) {}
        this.selectedPlot = null;
    }

    saveProgress() {
        try { localStorage.setItem('cf_save', JSON.stringify(this.state)); } catch(e) {}
        this.updateUI();
    }

    calcVPD(temp, rh) {
        const SVP = 0.61078 * Math.exp((17.27 * temp) / (temp + 237.3));
        return (SVP * (1 - rh / 100)).toFixed(2);
    }

    generateTextures() {
        const g = this.make.graphics({x:0, y:0}, false);
        g.lineStyle(2, 0xEDE8DF, 0.4);
        g.beginPath(); g.moveTo(64,0); g.lineTo(128,32); g.lineTo(64,64); g.lineTo(0,32); g.closePath(); g.strokePath();
        g.generateTexture('iso-tile', 128, 64); g.clear();

        const draw = (name, color, type, w, h) => {
            g.fillStyle(color, 1);
            if (type==='circle') g.fillCircle(w/2, h/2, w/2);
            if (type==='rect') g.fillRect(0, 0, w, h);
            if (type==='tri') { g.beginPath(); g.moveTo(w/2,0); g.lineTo(w,h); g.lineTo(0,h); g.fill(); }
            if (type==='diamond') { g.beginPath(); g.moveTo(w/2,0); g.lineTo(w,h/2); g.lineTo(w/2,h); g.lineTo(0,h/2); g.fill(); }
            g.generateTexture(name, w, h); g.clear();
        }
        draw('shape-1', 0x555555, 'circle', 16, 16);    // Germination
        draw('shape-2', 0x00E5C7, 'tri', 24, 24);       // Seedling
        draw('shape-3', 0x00B39E, 'rect', 32, 48);      // Veg
        draw('shape-4', 0xB15CFF, 'diamond', 40, 40);   // Flower
        draw('shape-5', 0xFFC24B, 'diamond', 40, 40);   // Harvested
        draw('shape-6', 0x886633, 'rect', 32, 32);      // Drying
        draw('shape-7', 0xAA8844, 'rect', 32, 32);      // Curing
        draw('shape-8', 0xFFFFFF, 'circle', 24, 24);    // Pass
        draw('shape-9', 0xFF0000, 'rect', 24, 24);      // Fail
    }

    create() {
        this.generateTextures();
        this.cx = this.cameras.main.centerX;
        
        // Room Controls UI
        this.roomTxt = this.add.text(10, 10, '', { fontFamily: 'sans-serif', fontSize: '14px', color: '#EDE8DF', lineSpacing: 4 });
        this.createBtn(10, 80, 80, 24, 'Temp -', () => { this.state.temp = Math.max(15, this.state.temp - 1); this.saveProgress(); });
        this.createBtn(100, 80, 80, 24, 'Temp +', () => { this.state.temp = Math.min(40, this.state.temp + 1); this.saveProgress(); });
        this.createBtn(10, 110, 80, 24, 'RH -', () => { this.state.rh = Math.max(20, this.state.rh - 5); this.saveProgress(); });
        this.createBtn(100, 110, 80, 24, 'RH +', () => { this.state.rh = Math.min(90, this.state.rh + 5); this.saveProgress(); });
        this.createBtn(10, 140, 170, 24, 'Toggle Light (18/6)', () => { 
            this.state.light = this.state.light === '18/6' ? '12/12' : '18/6'; this.saveProgress(); 
        }).txt.setName('lightBtnTxt');

        // Context UI
        this.plotTxt = this.add.text(this.cx + 80, 10, 'Select a plot', { fontFamily: 'sans-serif', fontSize: '14px', color: '#00E5C7', lineSpacing: 4 });
        this.actionBtn = this.createBtn(this.cx + 80, 100, 120, 30, 'Action', () => this.doPlotAction());
        this.waterBtn = this.createBtn(this.cx + 210, 100, 70, 30, 'Water', () => this.doCare('water'));
        this.feedBtn = this.createBtn(this.cx + 290, 100, 70, 30, 'Feed', () => this.doCare('feed'));

        this.sprites = [];
        this.drawIsoGrid(this.cx, this.cameras.main.centerY - 20);

        this.time.addEvent({ delay: 1000, callback: this.tickRealTime, callbackScope: this, loop: true });
        this.updateUI();
    }

    createBtn(x, y, w, h, label, cb) {
        const bg = this.add.rectangle(x+w/2, y+h/2, w, h, 0x00E5C7).setInteractive({useHandCursor:true}).on('pointerdown', cb);
        const txt = this.add.text(x+w/2, y+h/2, label, { fontFamily: 'sans-serif', fontSize: '12px', color: '#0C0D10', fontStyle: 'bold' }).setOrigin(0.5);
        return { bg, txt };
    }

    drawIsoGrid(startX, startY) {
        const tw = 128, th = 64;
        let i = 0;
        for (let x=0; x<3; x++) {
            for (let y=0; y<3; y++) {
                const ix = startX + (x-y)*(tw/2);
                const iy = startY + (x+y)*(th/2);
                const depth = x + y; 
                
                const tile = this.add.sprite(ix, iy, 'iso-tile').setDepth(depth).setInteractive({useHandCursor:true});
                const plant = this.add.sprite(ix, iy - 20, 'shape-1').setDepth(depth + 0.5).setVisible(false);
                const label = this.add.text(ix, iy, String(i), { fontSize: '10px', color: '#fff' }).setOrigin(0.5).setDepth(depth + 0.6);
                
                const idx = i;
                tile.on('pointerdown', () => { this.selectedPlot = idx; this.updateUI(); });
                
                this.sprites.push({ plant, label });
                i++;
            }
        }
    }

    doCare(type) {
        if (this.selectedPlot === null) return;
        const p = this.state.plots[this.selectedPlot];
        const now = Date.now();
        if (type === 'water' && now - p.waterTs > MINUTE) p.waterTs = now;
        if (type === 'feed' && now - p.feedTs > MINUTE * 2) p.feedTs = now;
        this.saveProgress();
    }

    doPlotAction() {
        if (this.selectedPlot === null) return;
        const p = this.state.plots[this.selectedPlot];
        
        if (p.stage === 0 && this.state.capital >= 50) {
            this.state.capital -= 50;
            p.stage = 1; p.progress = 0; p.stress = 0; p.waterTs = Date.now(); p.feedTs = Date.now();
        } else if (p.stage === 4) { // Force Harvest manually if flowering finished? Prompt says wait for timer, stage 5 is Harvested.
        } else if (p.stage === 5) {
            p.stage = 6; p.progress = 0; // Move to Drying
        } else if (p.stage === 7) {
            // Lab Test (N.J.A.C. 17:30-19.3)
            p.stage = p.stress > 1000 ? 9 : 8; // 1000 stress threshold for fail
            if (p.stage === 8) {
                p.grade = p.stress < 300 ? 'Top' : (p.stress < 700 ? 'Standard' : 'Low');
            }
        } else if (p.stage === 8) {
            // Sell
            const price = p.grade === 'Top' ? 600 : (p.grade === 'Standard' ? 350 : 200);
            this.state.capital += price;
            p.stage = 0; p.grade = '';
        } else if (p.stage === 9) {
            p.stage = 0; // Destroy failed batch
        }
        this.saveProgress();
    }

    tickRealTime() {
        const now = Date.now();
        let changed = false;
        const envOk = this.state.temp >= 25 && this.state.temp <= 30 && this.state.rh >= 55 && this.state.rh <= 60;

        this.state.plots.forEach(p => {
            const dt = now - p.lastUpdate;
            p.lastUpdate = now;

            if (p.stage > 0 && p.stage < 8 && p.stage !== 5) {
                p.progress += dt;
                // Add stress if outside target band (Eichhorn Bilodeau et al.)
                if (!envOk) p.stress += (dt / 1000) * 5; 
                
                // Add stress if thirsty/hungry
                if (now - p.waterTs > MINUTE * 3) p.stress += (dt / 1000) * 2;

                const req = STAGE_TIMES[p.stage];
                if (req && p.progress >= req) {
                    if (p.stage === 3 && this.state.light !== '12/12') {
                        p.stress += (dt / 1000) * 1; // Stressed if left in veg too long
                    } else {
                        p.stage++;
                        p.progress = 0;
                    }
                }
                changed = true;
            }
        });
        
        if (changed) this.saveProgress();
    }

    updateUI() {
        const { capital, temp, rh, light, plots } = this.state;
        const vpd = this.calcVPD(temp, rh);
        
        this.roomTxt.setText(
            `Capital: $C ${capital}\n` +
            `Temp: ${temp}°C | RH: ${rh}%\n` +
            `Light Cycle: ${light}\n` +
            `VPD (Calculated): ${vpd} kPa\n` +
            `Target Band: 25-30°C / 55-60% RH\n(VPD Target: ~1.26 - 1.90 kPa)`
        );
        this.children.getByName('lightBtnTxt').setText(`Toggle Light (${light})`);

        plots.forEach((p, i) => {
            const s = this.sprites[i];
            if (p.stage === 0) {
                s.plant.setVisible(false);
                s.label.setText('');
            } else {
                s.plant.setVisible(true).setTexture(`shape-${p.stage}`);
                s.label.setText(p.stress > 500 ? '⚠️' : ''); // Visual stress indicator
            }
            if (this.selectedPlot === i) s.plant.setAlpha(0.5); else s.plant.setAlpha(1);
        });

        if (this.selectedPlot !== null) {
            const p = plots[this.selectedPlot];
            let timeStr = '';
            if (STAGE_TIMES[p.stage]) {
                const left = Math.max(0, Math.ceil((STAGE_TIMES[p.stage] - p.progress) / 1000));
                timeStr = ` (${left}s left)`;
            }
            
            this.plotTxt.setText(`Plot ${this.selectedPlot}: ${STAGES[p.stage]}${timeStr}\nStress: ${Math.floor(p.stress)} | Grade: ${p.grade||'N/A'}`);
            
            this.actionBtn.bg.setVisible(true); this.actionBtn.txt.setVisible(true);
            this.waterBtn.bg.setVisible(p.stage > 0 && p.stage < 6); this.waterBtn.txt.setVisible(p.stage > 0 && p.stage < 6);
            this.feedBtn.bg.setVisible(p.stage > 0 && p.stage < 6); this.feedBtn.txt.setVisible(p.stage > 0 && p.stage < 6);

            let actLbl = 'Wait';
            if (p.stage === 0) actLbl = 'Plant ($C 50)';
            else if (p.stage === 5) actLbl = 'Dry Harvest';
            else if (p.stage === 7) actLbl = 'Lab Test';
            else if (p.stage === 8) actLbl = 'Sell Batch';
            else if (p.stage === 9) actLbl = 'Destroy Batch';
            else this.actionBtn.bg.setVisible(false);

            if (this.actionBtn.bg.visible) this.actionBtn.txt.setText(actLbl);
        } else {
            this.actionBtn.bg.setVisible(false); this.actionBtn.txt.setVisible(false);
            this.waterBtn.bg.setVisible(false); this.waterBtn.txt.setVisible(false);
            this.feedBtn.bg.setVisible(false); this.feedBtn.txt.setVisible(false);
        }
    }
}
