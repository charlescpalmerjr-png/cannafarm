# CannaFarm: Game Design Document

## 1. Pentafarm Inspiration
- **Source:** `u1974750/Pentafarm` (Unity 3D student project). 
- **License Status:** No open-source license is explicitly surfaced; standard copyright applies. 
- **Action:** Inspiration ONLY. Borrow the satisfying core loop (grow → harvest → expand) and growth timers. Zero code or art reuse.

## 2. Tech Choice & Recommendation
- **Unity WebGL:** Rejected. Heavy payloads and poor mobile browser performance.
- **Three.js / React Three Fiber:** Viable for 3D. Good ecosystem, but can be battery-heavy for mobile web.
- **Phaser (Recommended):** 2.5D isometric view. Extremely lightweight, guarantees 60 fps on iPhone, loads instantly on Vercel. Aligns perfectly with your Node/web stack and uses standard web Canvas/WebGL.

## 3. The Growing Model
- **Sources:** Rutgers NJAES (horticulture) & N.J.A.C. 17:30 (CRC compliance).
- **Stages:** Germination → Seedling → Vegetative (18/6 light) → Flowering (12/12 light) → Harvest → Dry → Cure.
- **Simplified Mechanics:** Players manage water, light toggles, and VPD (temp/humidity) meters. Stresses extend timers; perfect care yields higher quality grades.

## 4. The NJ Layer & Compliance
- **Core Rule:** Home cultivation is a felony in NJ (N.J.S.A. 2C:35-5). The game features a mandatory disclaimer: *You are playing a licensed operator. Unlicensed home cultivation is strictly illegal in New Jersey.*
- **Data Source:** NJ Dispensary Hub CC BY 4.0 dataset.
- **Mechanics:** Town opt-in verification, seed-to-sale tagging, lab testing wait-times, and Impact Zone priority. 

## 5. Economy
- **Soft Currency:** Capital (Cash).
- **Sinks:** Class upgrades (1 to 5), facility expansion, compliance renewals.
- **No Pay-to-Win:** No loot boxes, no premium currency to skip timers. Supporter hooks exist but are strictly behind a config toggle.

## 6. Retention Loops (Ranked)
1. **Daily Harvest / Check-in:** Real-time growth timers bring players back.
2. **Strain Collection:** Shared with Nugget Blitz (invented strains).
3. **Grow Journal:** Log of past successful yields.
4. **Season Goals:** Tiered business milestones.

## 7. Ecosystem Integration
- Links route to NJ Dispensary Hub using `?ref=cannafarm`.
- Hooks: "Learn more: Class 1 Cultivators", "Is your town opted in?", "Record relief and legal help".

## 8. Art Direction
- **Palette:** "The Record" (Ink `#0C0D10`, Paper `#EDE8DF`, Cyan `#00E5C7`, Violet `#B15CFF`).
- **Style:** Clean, isometric 2.5D, vector-based. Adult, warm, stylish (no cartoons/candy).
- **Asset Pipeline:** You generate sprites via Canva at explicit dimensions requested by the engine.
