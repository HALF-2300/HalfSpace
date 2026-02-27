type CosmologyParams = {
  H0_km_s_Mpc: number
  OmegaM: number
  OmegaLambda: number
}

const DEFAULT_COSMOLOGY: CosmologyParams = {
  H0_km_s_Mpc: 70,
  OmegaM: 0.3,
  OmegaLambda: 0.7,
}

const MPC_IN_METERS = 3.085677581491367e22
const SEC_PER_YEAR = 365.25 * 24 * 60 * 60
const SEC_PER_GYR = 1e9 * SEC_PER_YEAR

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function E(z: number, p: CosmologyParams) {
  return Math.sqrt(p.OmegaM * Math.pow(1 + z, 3) + p.OmegaLambda)
}

// Simpson integration on [a, b] with N even.
function simpsonIntegrate(fn: (x: number) => number, a: number, b: number, n: number) {
  const N = Math.max(2, Math.floor(n / 2) * 2)
  const h = (b - a) / N
  let s = fn(a) + fn(b)
  for (let i = 1; i < N; i++) {
    const x = a + i * h
    s += (i % 2 === 0 ? 2 : 4) * fn(x)
  }
  return (h / 3) * s
}

export function lookbackTimeGyr(zInput: number, params: Partial<CosmologyParams> = {}) {
  const z = clamp(zInput, 0, 30)
  const p: CosmologyParams = { ...DEFAULT_COSMOLOGY, ...params }

  // t_L = (1/H0) ∫0^z dz' / ((1+z') E(z'))
  const H0_s = (p.H0_km_s_Mpc * 1000) / MPC_IN_METERS
  const invH0_s = 1 / H0_s

  const integral = simpsonIntegrate((zp) => 1 / ((1 + zp) * E(zp, p)), 0, z, 1200)
  const t_s = invH0_s * integral
  const t_gyr = t_s / SEC_PER_GYR

  return {
    z,
    params: p,
    lookback_gyr: t_gyr,
    explanation_ar:
      'تقريب زمن الرجوع (lookback time) عبر نموذج ΛCDM مسطّح: نحسب تكامل  ∫0→z  dz/((1+z)E(z)) ثم نضرب بـ 1/H0. هذا تقريب تعليمي (لا يغني عن حزم كونية دقيقة).',
    explanation_en:
      'Approximate lookback time using a flat ΛCDM model: integrate ∫0→z dz/((1+z)E(z)) and multiply by 1/H0. Educational approximation (not precision cosmology).',
  }
}

export function stellarLifetimeAndEndpoint(massSolarInput: number) {
  const mass_solar = massSolarInput
  if (!Number.isFinite(mass_solar) || mass_solar <= 0) {
    return {
      ok: false as const,
      error_ar: 'الرجاء إدخال كتلة موجبة (بوحدة كتلة الشمس M☉).',
      error_en: 'Please enter a positive mass in solar masses (M☉).',
    }
  }

  // Simple main-sequence lifetime scaling: t ≈ 10 Gyr * (M/M☉)^(-2.5)
  const lifetime_gyr = 10 * Math.pow(mass_solar, -2.5)

  let endpoint: string
  let endpoint_ar: string
  if (mass_solar < 0.08) {
    endpoint = 'Brown dwarf (no sustained hydrogen fusion)'
    endpoint_ar = 'قزم بني (لا يملك اندماج هيدروجين مستدام)'
  } else if (mass_solar < 8) {
    endpoint = 'White dwarf'
    endpoint_ar = 'قزم أبيض'
  } else if (mass_solar < 20) {
    endpoint = 'Neutron star (after core-collapse supernova)'
    endpoint_ar = 'نجم نيوتروني (بعد مستعر أعظم لانهيار اللب)'
  } else {
    endpoint = 'Black hole (after core-collapse)'
    endpoint_ar = 'ثقب أسود (بعد انهيار اللب)'
  }

  return {
    ok: true as const,
    mass_solar,
    lifetime_gyr,
    endpoint,
    endpoint_ar,
    explanation_ar:
      'نستخدم تقريباً تعليمياً لعمر النسق الأساسي: t ≈ 10 مليار سنة × (M/M☉)^(-2.5). ثم نخمّن المصير النهائي حسب نطاقات كتلة شائعة في الكتب (تقريب).',
    explanation_en:
      'Educational main-sequence lifetime approximation: t ≈ 10 Gyr × (M/M☉)^(-2.5). Endpoint is estimated using common mass ranges (approximate).',
  }
}

export function orbitalPeriodFromMassAndDistance(mCentralSolarInput: number, semiMajorAxisAuInput: number) {
  const M = mCentralSolarInput
  const a = semiMajorAxisAuInput
  if (!Number.isFinite(M) || M <= 0 || !Number.isFinite(a) || a <= 0) {
    return {
      ok: false as const,
      error_ar: 'الرجاء إدخال قيم موجبة: الكتلة (M☉) والمسافة/نصف المحور الأكبر (AU).',
      error_en: 'Please enter positive values: mass (M☉) and distance/semi-major axis (AU).',
    }
  }

  // In convenient units (AU, years, solar masses): P^2 = a^3 / (M_total)
  const period_years = Math.sqrt(Math.pow(a, 3) / M)
  const period_days = period_years * 365.25

  return {
    ok: true as const,
    M_solar: M,
    a_AU: a,
    period_years,
    period_days,
    explanation_ar:
      'نستخدم صيغة كبلر (بوحدات AU وسنوات وكتلة الشمس): P^2 = a^3 / M. هذا يفترض أن كتلة الجسم المداري صغيرة مقارنة بكتلة المركز.',
    explanation_en:
      'Kepler in convenient units (AU, years, solar masses): P^2 = a^3 / M. Assumes the orbiting body mass is negligible vs the central mass.',
  }
}

