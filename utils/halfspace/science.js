const LIGHT_SPEED_KM_S = 299792.458
const AU_KM = 149597870.7
const JULIAN_YEAR_SECONDS = 31557600

/** Light travel in vacuum, in a static-distance approximation. */
function lightTravelSeconds(distance, unit) {
  const factors = { km: 1, au: AU_KM, ly: LIGHT_SPEED_KM_S * JULIAN_YEAR_SECONDS }
  if (!Number.isFinite(distance) || distance < 0 || !Object.hasOwn(factors, unit)) {
    throw new RangeError('Use a finite, nonnegative distance and km, au or ly.')
  }
  const seconds = distance * (unit === 'ly' ? JULIAN_YEAR_SECONDS : factors[unit] / LIGHT_SPEED_KM_S)
  if (!Number.isFinite(seconds)) throw new RangeError('Distance exceeds the supported range.')
  return seconds
}

/** Stationary Schwarzschild observer relative to an observer at infinity. */
function gravitationalTimeFactor(radiusInRs) {
  if (!Number.isFinite(radiusInRs) || radiusInRs <= 1) {
    throw new RangeError('A stationary observer must be outside the event horizon (r > Rs).')
  }
  return 1 / Math.sqrt(1 - 1 / radiusInRs)
}


/**
 * Inertial one-way flight between endpoints at rest in the same reference frame.
 * Acceleration, deceleration, gravity and cosmological expansion are omitted.
 * Returns Earth-frame coordinate time and ship-clock proper time in seconds.
 */
function constantSpeedJourney(distance, unit, fractionOfC) {
  if (!Number.isFinite(fractionOfC) || fractionOfC <= 0 || fractionOfC >= 1) {
    throw new RangeError('Speed must be a finite fraction of c strictly between 0 and 1.')
  }
  const lightSeconds = lightTravelSeconds(distance, unit)
  const earthSeconds = lightSeconds / fractionOfC
  // (1 - beta) * (1 + beta) is numerically better behaved near light speed.
  const shipSeconds = earthSeconds * Math.sqrt((1 - fractionOfC) * (1 + fractionOfC))
  if (!Number.isFinite(earthSeconds) || !Number.isFinite(shipSeconds)) {
    throw new RangeError('Journey exceeds the supported calculation range.')
  }
  return { earthSeconds, shipSeconds }
}

function normalizeSearch(value) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f\u064b-\u065f\u0670ـ]/g, '').toLowerCase().trim()
}

function filterDestinations(destinations, query, category) {
  const term = normalizeSearch(query)
  return destinations.filter(item =>
    (category === 'all' || item.category === category) &&
    normalizeSearch([item.title.en, item.title.ar, item.description.en, item.description.ar].join(' ')).includes(term)
  )
}

function readExploredIds(raw, knownIds) {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return [...new Set(parsed.filter(id => typeof id === 'string' && knownIds.includes(id)))]
  } catch { return [] }
}

module.exports = { lightTravelSeconds, constantSpeedJourney, gravitationalTimeFactor, filterDestinations, readExploredIds }
