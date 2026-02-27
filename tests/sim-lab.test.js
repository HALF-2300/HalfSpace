const assert = require('assert')
const { computeOrbit, computeStarEvolution, calculateLensEffect } = require('../utils/simLab/calculations')

function approxEqual(value, target, tolerance) {
  assert.ok(Math.abs(value - target) <= tolerance, `${value} not within ${tolerance} of ${target}`)
}

// Orbit: Earth-like baseline
const earth = computeOrbit(1, 1)
approxEqual(Number(earth.periodYears.toFixed(2)), 1.0, 0.05)
assert.ok(earth.speedKmS > 28 && earth.speedKmS < 31, 'Earth speed near 29.8 km/s')

// Orbit: heavier star speeds up
const heavy = computeOrbit(2, 1)
assert.ok(heavy.speedKmS > earth.speedKmS, 'Heavier star yields faster orbit at same radius')

// Stellar evolution: sun-like
const sun = computeStarEvolution(1)
const mainSeqGyr = sun.path[0].years / 1_000_000_000
assert.ok(mainSeqGyr > 9 && mainSeqGyr < 11, 'Main sequence ~10 Gyr for 1 Msun')

// Stellar evolution: massive star ends as neutron star with short lifetime
const massive = computeStarEvolution(15)
assert.strictEqual(massive.path[3].stage, 'Neutron star')
assert.ok(massive.path[0].years < 100_000_000, 'Massive star main sequence is short (<100 Myr)')

// Lens effect: increases with mass
const lensLow = calculateLensEffect(1)
const lensHigh = calculateLensEffect(40)
assert.ok(lensHigh.warp > lensLow.warp, 'Warp grows with mass')
assert.ok(lensHigh.blur > lensLow.blur, 'Blur grows with mass')

console.log('sim-lab tests passed')
