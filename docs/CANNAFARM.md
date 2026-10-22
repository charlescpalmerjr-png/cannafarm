# CannaFarm: Game Design Document

## 1. Pentafarm Inspiration
- **Source:** `u1974750/Pentafarm` (Unity 3D student project). 
- **License Status:** No open-source license explicitly surfaced; standard copyright applies. 
- **Action:** Inspiration ONLY. Borrow the satisfying core loop (grow → harvest → expand) and growth timers. Zero code or art reuse.

## 2. Tech Choice & Recommendation
- **Unity WebGL:** Rejected. Heavy payloads and poor mobile browser performance.
- **Three.js / React Three Fiber:** Viable for 3D, but potentially battery-heavy on mobile.
- **Phaser (Recommended):** 2.5D isometric view. Extremely lightweight, target 60 fps, verified on Charles's iPhone, loads instantly on Vercel. Aligns with standard web Canvas/WebGL.

## 3. The Growing Model
- **Sources & Variables:** 
  - **Rutgers NJAES (Hemp/Agriculture):** *Commercial Hemp Production* (Read: Oct 21, 2026; https://njaes.rutgers.edu/hemp/). Used for general soil and nutrient baseline logic.
  - **Supplemental (VPD & Light Cycles):** Eichhorn Bilodeau et al. (2019), "An Update on Plant Photobiology and Implications for Cannabis Production," *Frontiers in Plant Science*, https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2019.00296/pdf. Supports 18/6 vegetative, about 12 h for flowering, 25–30 °C and 55–60% RH. Gives no VPD ranges, so calculate VPD in-game from temperature and RH with the Tetens equation and label it as calculated.
  - **Compliance (N.J.A.C. 17:30):** *Personal Use Cannabis Rules* (Read: Oct 21, 2026; https://www.nj.gov/cannabis/documents/rules/NJAC%201730%20Personal%20Use%20Cannabis.pdf). Subchapter 9 (N.J.A.C. 17:30-9.13) explicitly requires utilizing the inventory tracking system designated by the Commission for all seed-to-sale tracking.
- **Mechanics:** Players manage water, light toggles, and VPD meters. Stresses extend timers; perfect care yields higher quality grades.

## 4. The NJ Layer & Legal Compliance
- **Core Legal Fact:** Home cultivation is illegal. New Jersey grades unlawful manufacturing/growing based on plant count.
- **Statute & Thresholds:** Verified per the NJ Attorney General summary of P.L.2021 c.19 (https://www.nj.gov/oag/dcj/Marijuana%20Decriminalization%20A1897.PDF) and N.J.S.A. 2C:35-5 from the NJ Legislature: 50 or more plants is a crime of the first degree; 10 to 49 plants is a crime of the second degree.
- **In-Game Disclaimer (Exact wording):** "You are playing a licensed operator. Unlicensed home cultivation is illegal in New Jersey."
- **Data Source:** NJ Dispensary Hub CC BY 4.0 dataset. Snapshot used for town opt-ins and Impact Zones.

## 5. Economy & Progression Curve
- **Soft Currency:** Capital ($C).
- **Start Capital:** $C 5,000.
- **Costs & Income:** 
  - Class 1 License Fee: $C 1,000 - Seed (per plot):$C 50
  - Water/Power overhead (per day tick): $C 10 - Facility Upgrade (Tier 2 lights):$C 1,500
  - Wholesale Class 1 Yield (Standard Grade): $C 350 - Wholesale Class 1 Yield (Top Grade):$C 600
- **Progression Curve:**
  - **Day 1:** Obtain Class 1 Cultivator license, plant first seeds, manage seedling VPD, complete first fast-timer harvest.
  - **Day 7:** Scale to multiple plots, unlock Class 2 Manufacturer license (turns raw harvests into pre-rolls/vapes for higher wholesale margin).
  - **Day 30:** Full multi-license operation (Classes 1-5), managing wholesale trades (Class 3), distribution routes (Class 4), and storefront compliance (Class 5).
- **No Pay-to-Win:** No premium currency to skip timers. Allowed integrations (cosmetics/merch) are gated behind an off-switch.

## 6. Retention Loops (Ranked)
1. **Daily Harvest / Check-in:** Real-time growth timers bring players back.
2. **Strain Collection:** Shared with Nugget Blitz (invented strains).
3. **Season Goals:** Tiered business milestones (e.g., "Harvest 100oz of 'Neon Skyline'").
4. **Grow Journal:** Log of past successful yields and mistakes.
5. **Events:** Tied to real moments (e.g., CRC license application windows).
6. **Shareable Farm Snapshot:** Exportable image of the current facility layout.

## 7. Ecosystem Integration & Link Map
Base URL config: `NJDH_BASE = "https://nj-dispensary-hub.vercel.app"`
- **"Learn more: License Classes"** → `${NJDH_BASE}/nj/licenses?ref=cannafarm` (and subpaths like `/nj/licenses/cultivators`)
- **"Is your town opted in?"** → `${NJDH_BASE}/nj/policies?ref=cannafarm`
- **"Impact Zones Explained"** → `${NJDH_BASE}/impact-zones?ref=cannafarm`
- **"Record Relief and Legal Help"** → `${NJDH_BASE}/nj/legal?ref=cannafarm`
*(Note: No store link included until the store page exists.)*

## 8. Art Direction & Asset List
- **Palette:** "The Record" (Ink `#0C0D10`, Paper `#EDE8DF`, Cyan `#00E5C7`, Violet `#B15CFF`).
- **Pipeline:** Generated in Canva, exported as transparent PNGs.
- **Required Assets (Exact Sizes, with @2x for Retina):**
  - `social-preview.png`: 1200x630
  - `favicon.ico` / `logo.png`: 512x512
  - `isometric-floor-tile.png`: 128x64 (256x128 @2x)
  - `plant-stage-germination.png`: 64x64 (128x128 @2x)
  - `plant-stage-seedling.png`: 64x64 (128x128 @2x)
  - `plant-stage-veg.png`: 64x128 (128x256 @2x)
  - `plant-stage-flower.png`: 64x128 (128x256 @2x)
  - `plant-stage-harvest.png`: 64x128 (128x256 @2x)
  - `equipment-drying-rack.png`: 128x128 (256x256 @2x)
  - `equipment-curing-rack.png`: 128x128 (256x256 @2x)
  - `facility-class-2.png`: 256x256 (512x512 @2x)
  - `facility-class-3.png`: 256x256 (512x512 @2x)
  - `facility-class-4.png`: 256x256 (512x512 @2x)
  - `facility-class-5.png`: 256x256 (512x512 @2x)
  - `status-pest.png`: 32x32 (64x64 @2x) (Uses distinct shape/icon, not color alone)
  - `status-stress.png`: 32x32 (64x64 @2x) (Uses distinct shape/icon, not color alone)
  - `ui-button-standard.png`: 200x48 (400x96 @2x)
  - `ui-panel-bg.png`: 400x300 (800x600 @2x) (9-slice scalable)
