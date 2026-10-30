const test = require('node:test')
const assert = require('node:assert/strict')
const { lightTravelSeconds, constantSpeedJourney, gravitationalTimeFactor, filterDestinations, readExploredIds } = require('../utils/halfspace/science')

test('light travel uses physical units: Moon, AU, and a Julian light-year', () => {
  assert.ok(Math.abs(lightTravelSeconds(384400, 'km') - 1.28222) < 0.00001)
  assert.ok(Math.abs(lightTravelSeconds(1, 'au') - 499.00478) < 0.00001)
  assert.equal(lightTravelSeconds(1, 'ly'), 31557600)
  assert.equal(lightTravelSeconds(0, 'km'), 0)
})
test('inertial travel separates Earth-frame time from elapsed ship time', () => {
  const year = 31557600
  const halfC = constantSpeedJourney(1, 'ly', 0.5)
  assert.ok(Math.abs(halfC.earthSeconds - 2 * year) < 1e-6)
  assert.ok(Math.abs(halfC.shipSeconds - Math.sqrt(3) * year) < 1e-6)
  const fast = constantSpeedJourney(1, 'ly', 0.8)
  assert.ok(Math.abs(fast.earthSeconds - 1.25 * year) < 1e-6)
  assert.ok(Math.abs(fast.shipSeconds - 0.75 * year) < 1e-6)
  assert.deepEqual(constantSpeedJourney(0, 'km', 0.9), { earthSeconds: 0, shipSeconds: 0 })
  const nearC = constantSpeedJourney(1, 'ly', 0.999999999999)
  assert.ok(nearC.shipSeconds > 0 && nearC.shipSeconds < nearC.earthSeconds)
})

test('inertial model rejects impossible or nonfinite speeds and time', () => {
  for (const speed of [-0.1, 0, 1, 1.1, NaN, Infinity]) {
    assert.throws(() => constantSpeedJourney(1, 'au', speed), RangeError)
  }
  assert.throws(() => constantSpeedJourney(-1, 'km', 0.5), RangeError)
  assert.throws(() => constantSpeedJourney(1, 'parsec', 0.5), RangeError)
  assert.throws(() => constantSpeedJourney(1e308, 'km', 1e-12), RangeError)
})

test('invalid scientific inputs never produce a plausible result', () => {
  for (const n of [-1, NaN, Infinity]) assert.throws(() => lightTravelSeconds(n, 'km'), RangeError)
  assert.throws(() => lightTravelSeconds(1, 'parsec'), RangeError)
  for (const n of [0, 1, -2, NaN, Infinity]) assert.throws(() => gravitationalTimeFactor(n), RangeError)
  assert.ok(Math.abs(gravitationalTimeFactor(2) - Math.SQRT2) < 1e-12)
})
const places = [
  { id: 'orbit', category: 'lab', title: { en: 'Orbit lab', ar: 'مختبر المدارات' }, description: { en: 'Gravity', ar: 'الجاذبية' } },
  { id: 'sky', category: 'learn', title: { en: 'Night sky', ar: 'السماء' }, description: { en: 'Stars', ar: 'النجوم' } },
]
test('search covers both languages and combines with category', () => {
  assert.equal(filterDestinations(places, '  GRAVITY ', 'all')[0].id, 'orbit')
  assert.equal(filterDestinations(places, 'النُّجوم', 'all')[0].id, 'sky')
  assert.equal(filterDestinations(places, 'مختبر', 'learn').length, 0)
  assert.equal(filterDestinations(places, '', 'all').length, 2)
  assert.equal(filterDestinations(places, 'missing', 'all').length, 0)
})
test('local progress accepts only unique known IDs and tolerates damaged storage', () => {
  assert.deepEqual(readExploredIds('["sky","sky","old",1]', ['sky', 'orbit']), ['sky'])
  for (const raw of [null, 'null', '{}', 'bad json']) assert.deepEqual(readExploredIds(raw, ['sky']), [])
})
