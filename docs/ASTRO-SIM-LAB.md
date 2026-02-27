# Astro Sim Lab (Additions Only)

New additive route `/space/sim-lab` providing three lightweight, local-only simulators:

- Orbit Playground — Kepler-like velocity & period scaler with SVG orbit sketch.
- Star Evolution Estimator — Mass-based lifetime bars and stellar fate.
- Black Hole Lens Demo — Toy gravitational lens warp with adjustable mass.

## How it thinks (per simulator)
- Orbit: assumes circular orbit; uses v ≈ 29.78 km/s × √(M/r) and P ≈ √(r³/M) with M in M☉ and r in AU.
- Star: lifetime ~ 10 Gyr × M^-2.5; 10% to giant phase; fates chosen by mass (WD/NS/BH).
- Lens: maps mass → warp/blur/brightness factors to visually distort a 2D starfield (illustrative, not physical).

## Local storage
Each simulator persists its last inputs under dedicated keys: `sim-lab-orbit`, `sim-lab-star`, `sim-lab-lens`.

## Run the page
```
npm run dev
# open http://localhost:3000/space/sim-lab
```

## Quick tests (no extra deps)
```
node tests/sim-lab.test.js
```
Asserts orbit scalings, stellar lifetimes/fates, and monotonic lens distortion factors.

## Added files
- `app/space/sim-lab/page.tsx`
- `components/SimLab/*`
- `utils/simLab/calculations.js`
- `tests/sim-lab.test.js`
