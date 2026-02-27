// Shared lightweight physics helpers for the Astro Sim Lab.
// Plain JS so it can be used by both Next components and Node tests without extra tooling.

const EARTH_ORBITAL_SPEED_KMS = 29.78 // km/s around 1 Msun at 1 AU
const EARTH_YEAR_DAYS = 365.25

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

/**
 * Approximate orbital velocity and period using Kepler scaling.
 * @param {number} starMassMsun Star mass in solar masses
 * @param {number} orbitRadiusAu Orbit radius in AU (assumed circular)
 */
function computeOrbit(starMassMsun, orbitRadiusAu) {
  const mass = clamp(Number(starMassMsun) || 0.1, 0.01, 1000)
  const radius = clamp(Number(orbitRadiusAu) || 0.1, 0.01, 5_000)

  const speedKmS = EARTH_ORBITAL_SPEED_KMS * Math.sqrt(mass / radius)
  const periodYears = Math.sqrt(Math.pow(radius, 3) / mass)
  const periodDays = periodYears * EARTH_YEAR_DAYS

  return {
    speedKmS,
    periodYears,
    periodDays,
  }
}

/**
 * Very rough stellar evolution timeline based on mass.
 * https://en.wikipedia.org/wiki/Stellar_classification (simplified scalings)
 * @param {number} starMassMsun
 */
function computeStarEvolution(starMassMsun) {
  const mass = clamp(Number(starMassMsun) || 1, 0.1, 120)
  const mainSequenceYears = 10_000_000_000 * Math.pow(mass, -2.5) // baseline 10 Gyr at 1 Msun
  const redGiantYears = mainSequenceYears * 0.1
  const postMainSequenceYears = mass > 8 ? 1_000_000 : 50_000_000

  const remnant =
    mass < 0.8 ? 'White dwarf (cooling)' : mass < 8 ? 'Carbon-oxygen white dwarf' : mass < 25 ? 'Neutron star' : 'Black hole'

  const path = [
    { stage: 'Main sequence', years: mainSequenceYears },
    { stage: 'Red giant / supergiant', years: redGiantYears },
    { stage: mass >= 8 ? 'Core collapse (SN)' : 'He shell burning', years: postMainSequenceYears },
    { stage: remnant, years: mass >= 8 ? Infinity : 10_000_000_000 },
  ]

  return { mass, path }
}

/**
 * Toy model for strong lensing magnitude used by the demo slider.
 * Mass in solar masses; returns normalized factors for UI.
 */
function calculateLensEffect(massInput) {
  const mass = clamp(Number(massInput) || 1, 1, 50)
  // Map mass to a gentle distortion factor.
  const warp = 0.02 * Math.log10(mass + 1)
  const blur = 0.4 * Math.sqrt(mass)
  const brightness = clamp(0.85 + warp, 0.85, 1.15)
  return { mass, warp, blur, brightness }
}

module.exports = {
  computeOrbit,
  computeStarEvolution,
  calculateLensEffect,
}
