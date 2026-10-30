const test = require('node:test')
const assert = require('node:assert/strict')
const { lightTravelSeconds, gravitationalTimeFactor, filterDestinations, readExploredIds } = require('../utils/halfspace/science')

test('light travel uses physical units: Moon, AU, and a Julian light-year', () => {
  assert.ok(Math.abs(lightTravelSeconds(384400, 'km') - 1.28222) < 0.00001)
  assert.ok(Math.abs(lightTravelSeconds(1, 'au') - 499.00478) < 0.00001)
  assert.equal(lightTravelSeconds(1, 'ly'), 31557600)
  assert.equal(lightTravelSeconds(0, 'km'), 0)
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
