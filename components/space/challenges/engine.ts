import type { ChallengeDef, ChallengeRun } from './types'
import {
  auToKm,
  kmToAu,
  kmToLy,
  lookbackTimeGyr,
  lyToKm,
  orbitalPeriodYears,
  orbitalVelocityKmS,
  schwarzschildRadiusKm,
  stellarEndpointAr,
  stellarLifetimeGyr,
  timeDilationFactorAtMultiple,
} from './calcs'

function asNum(v: unknown) {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : NaN
}

export function runChallenge(def: ChallengeDef, inputs: Record<string, number>): ChallengeRun {
  const outKey = def.output.key

  if (def.id === 'cosmology-lookback-1') {
    const z = asNum(inputs.z)
    const r = lookbackTimeGyr(z)
    return {
      outputValue: r.lookback_gyr,
      outputLabel_ar: def.output.label_ar,
      outputUnit: def.output.unit,
      explanation_ar: def.explain_ar,
      steps_ar: [
        'نستخدم نموذج ΛCDM مسطّح (H0≈70, Ωm≈0.3, ΩΛ≈0.7).',
        'نحسب: t_L = (1/H0) ∫0→z dz / ((1+z)E(z))',
        'حيث: E(z)=√(Ωm(1+z)^3 + ΩΛ)',
        `ناتج التكامل (تقريب): t_L ≈ ${r.lookback_gyr.toFixed(3)} Gyr`,
      ],
    }
  }

  if (def.id === 'cosmology-lookback-delta') {
    const z1 = asNum(inputs.z1)
    const z2 = asNum(inputs.z2)
    const t1 = lookbackTimeGyr(z1).lookback_gyr
    const t2 = lookbackTimeGyr(z2).lookback_gyr
    const delta = Math.abs(t2 - t1)
    return {
      outputValue: delta,
      outputLabel_ar: def.output.label_ar,
      outputUnit: def.output.unit,
      explanation_ar: def.explain_ar,
      steps_ar: [
        `نحسب lookback(z1=${z1}) ⇒ t1 ≈ ${t1.toFixed(3)} Gyr`,
        `نحسب lookback(z2=${z2}) ⇒ t2 ≈ ${t2.toFixed(3)} Gyr`,
        `Δt = |t2 − t1| ≈ ${delta.toFixed(3)} Gyr`,
      ],
    }
  }

  if (def.id === 'stars-lifetime-1') {
    const m = asNum(inputs.mass_solar)
    const t = stellarLifetimeGyr(m)
    return {
      outputValue: t,
      outputLabel_ar: def.output.label_ar,
      outputUnit: def.output.unit,
      explanation_ar: def.explain_ar,
      steps_ar: [
        'نستخدم تقريب عمر النسق الأساسي:',
        't ≈ 10 Gyr × (M/M☉)^(-2.5)',
        `بوضع M=${m} ⇒ t ≈ ${t.toFixed(4)} Gyr`,
      ],
    }
  }

  if (def.id === 'stars-endpoint-1') {
    const m = asNum(inputs.mass_solar)
    const endpoint = stellarEndpointAr(m)
    return {
      outputValue: endpoint,
      outputLabel_ar: def.output.label_ar,
      outputUnit: def.output.unit,
      explanation_ar: def.explain_ar,
      steps_ar: [
        `نحدد نطاق الكتلة: M=${m} M☉`,
        '<0.08 ⇒ قزم بني',
        '0.08–8 ⇒ قزم أبيض',
        '8–20 ⇒ نجم نيوتروني',
        '>20 ⇒ ثقب أسود',
        `إذن: النهاية ≈ ${endpoint}`,
      ],
      expectedChoice_ar: endpoint,
    }
  }

  if (def.id === 'orbits-period-1') {
    const M = asNum(inputs.M_solar)
    const a = asNum(inputs.a_AU)
    const P = orbitalPeriodYears(M, a)
    return {
      outputValue: P,
      outputLabel_ar: def.output.label_ar,
      outputUnit: def.output.unit,
      explanation_ar: def.explain_ar,
      steps_ar: [
        'في وحدات (AU, years, M☉): P^2 = a^3 / M',
        `a=${a} AU ⇒ a^3=${Math.pow(a, 3).toFixed(6)}`,
        `M=${M} M☉ ⇒ P=√(a^3/M) ≈ ${P.toFixed(6)} years`,
      ],
    }
  }

  if (def.id === 'orbits-velocity-1') {
    const M = asNum(inputs.M_solar)
    const a = asNum(inputs.a_AU)
    const P = orbitalPeriodYears(M, a)
    const v = orbitalVelocityKmS(a, P)
    return {
      outputValue: v,
      outputLabel_ar: def.output.label_ar,
      outputUnit: def.output.unit,
      explanation_ar: def.explain_ar,
      steps_ar: [
        'أولاً نحسب الفترة P من كبلر: P=√(a^3/M)',
        `P ≈ ${P.toFixed(6)} years`,
        'ثم السرعة المدارية (تقريب مدار دائري): v ≈ 2πa / P',
        `v ≈ ${v.toFixed(3)} km/s`,
      ],
    }
  }

  if (def.id === 'blackholes-rs-1') {
    const m = asNum(inputs.mass_solar)
    const Rs = schwarzschildRadiusKm(m)
    return {
      outputValue: Rs,
      outputLabel_ar: def.output.label_ar,
      outputUnit: def.output.unit,
      explanation_ar: def.explain_ar,
      steps_ar: [
        'نستخدم: Rs = 2GM/c^2',
        `M=${m} M☉ ⇒ Rs ≈ ${Rs.toFixed(3)} km`,
      ],
    }
  }

  if (def.id === 'blackholes-time-dilation-1') {
    const m = asNum(inputs.mass_solar)
    const k = asNum(inputs.k)
    const Rs = schwarzschildRadiusKm(m)
    const factor = timeDilationFactorAtMultiple(k)
    const slowerPct = (1 - factor) * 100
    return {
      outputValue: factor,
      outputLabel_ar: def.output.label_ar,
      outputUnit: def.output.unit,
      explanation_ar: def.explain_ar,
      steps_ar: [
        `أولاً: Rs لمعاملات الكتلة (للمعلومية): Rs ≈ ${Rs.toFixed(3)} km`,
        'تقريب شفارتزشيلد: dτ/dt = √(1 − Rs/r)',
        `إذا r = k×Rs ⇒ dτ/dt = √(1 − 1/k)`,
        `k=${k} ⇒ dτ/dt ≈ ${factor.toFixed(6)} (أبطأ بحوالي ${slowerPct.toFixed(2)}%)`,
      ],
    }
  }

  if (def.id === 'units-au-to-km') {
    const au = asNum(inputs.au)
    const km = auToKm(au)
    return {
      outputValue: km,
      outputLabel_ar: def.output.label_ar,
      outputUnit: def.output.unit,
      explanation_ar: def.explain_ar,
      steps_ar: [`1 AU ≈ 149,597,870.7 km`, `km = AU × 149,597,870.7 ⇒ ${km.toFixed(3)} km`],
    }
  }

  if (def.id === 'units-km-to-au') {
    const km = asNum(inputs.km)
    const au = kmToAu(km)
    return {
      outputValue: au,
      outputLabel_ar: def.output.label_ar,
      outputUnit: def.output.unit,
      explanation_ar: def.explain_ar,
      steps_ar: [`AU = km / 149,597,870.7`, `AU ≈ ${au.toFixed(8)} AU`],
    }
  }

  if (def.id === 'units-km-to-ly') {
    const km = asNum(inputs.km)
    const ly = kmToLy(km)
    return {
      outputValue: ly,
      outputLabel_ar: def.output.label_ar,
      outputUnit: def.output.unit,
      explanation_ar: def.explain_ar,
      steps_ar: [`1 ly ≈ 9.4607×10^12 km`, `ly = km / 9.4607e12 ⇒ ${ly.toExponential(6)} ly`],
    }
  }

  if (def.id === 'units-ly-to-km') {
    const ly = asNum(inputs.ly)
    const km = lyToKm(ly)
    return {
      outputValue: km,
      outputLabel_ar: def.output.label_ar,
      outputUnit: def.output.unit,
      explanation_ar: def.explain_ar,
      steps_ar: [`km = ly × 9.4607e12 ⇒ ${km.toExponential(6)} km`],
    }
  }

  // Fallback for unknown/added defs.
  return {
    outputValue: outKey,
    outputLabel_ar: def.output.label_ar,
    outputUnit: def.output.unit,
    explanation_ar: def.explain_ar,
    steps_ar: ['(لا توجد خطوات لهذا التحدي بعد)'],
  }
}

