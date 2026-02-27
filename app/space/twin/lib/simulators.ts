import type { UniverseIndex } from './model'

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function isFiniteNumber(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n)
}

function getConstantNumber(index: UniverseIndex, id: string, fallback: number): number {
  const e = index.byId.get(id)
  if (!e) return fallback
  return isFiniteNumber(e.value) ? e.value : fallback
}

// Hubble time in Gyr (approx): t_H = 9.778 / (H0 / 100)
function hubbleTimeGyr(H0_km_s_Mpc: number): number {
  return 9.778 / (H0_km_s_Mpc / 100)
}

// Flat ΛCDM lookback time:
// t_L(z) = t_H * ∫_0^z [ 1 / ((1+z') E(z')) ] dz' , where E(z)=sqrt(Ωm(1+z)^3+ΩΛ)
export function cosmologyLookbackGyr(
  index: UniverseIndex,
  zInput: number,
): { z: number; lookbackGyr: number; scaleFactor: number; explanationAr: string } {
  const z = clamp(zInput, 0, 30)
  const H0 = getConstantNumber(index, 'constant.h0', 70)
  const Om = getConstantNumber(index, 'constant.omega_m', 0.3)
  const Ol = getConstantNumber(index, 'constant.omega_lambda', 0.7)

  const tH = hubbleTimeGyr(H0)
  const nSteps = Math.max(400, Math.min(4000, Math.floor(200 * z + 400)))
  const dz = z / nSteps

  let integral = 0
  for (let i = 0; i <= nSteps; i++) {
    const zp = i * dz
    const E = Math.sqrt(Om * Math.pow(1 + zp, 3) + Ol)
    const f = 1 / ((1 + zp) * E)
    const w = i === 0 || i === nSteps ? 0.5 : 1 // trapezoid
    integral += w * f
  }
  integral *= dz

  const lookbackGyr = tH * integral
  const a = 1 / (1 + z)

  return {
    z,
    lookbackGyr,
    scaleFactor: a,
    explanationAr:
      'تقريب مبني على نموذج مسطّح ΛCDM: نحسب زمن الرجوع للخلف عبر تكامل عددي من z=0 إلى z، باستخدام H0 و Ωm و ΩΛ من نموذج الكون. النتيجة تقديرية وليست بديلاً عن حاسبات كونية دقيقة.',
  }
}

export function starLifecycleFromMass(
  massSolarInput: number,
): { massSolar: number; lifetimeGyr: number; endpointAr: string; explanationAr: string } {
  const massSolar = clamp(massSolarInput, 0.08, 120)

  // Rough scaling: lifetime ~ 10 Gyr * M^-2.5 (valid-ish for ~0.5..50 M☉)
  const lifetimeGyr = 10 * Math.pow(massSolar, -2.5)

  let endpointAr = 'غير محدد'
  if (massSolar < 0.5) endpointAr = 'قزم أحمر طويل العمر (قد لا يصل لنهاية مرصودة خلال عمر الكون الحالي)'
  else if (massSolar < 8) endpointAr = 'عملاق أحمر → سديم كوكبي → قزم أبيض'
  else if (massSolar < 25) endpointAr = 'مستعر أعظم (انهياري) → نجم نيوتروني'
  else endpointAr = 'انهيار نجمي → ثقب أسود (مرجّح)'

  return {
    massSolar,
    lifetimeGyr,
    endpointAr,
    explanationAr:
      'التقريب المستخدم: عمر النسق الرئيسي يتناقص بشدة مع الكتلة (تقريباً \(t \\propto M^{-2.5}\\)). كما أن “نهاية النجم” تُقدّر بحدود كتلة تقريبية شائعة في كتب الفلك.',
  }
}

export function orbitalPeriodFromKepler(
  centralMassSolarInput: number,
  semiMajorAxisAuInput: number,
): { centralMassSolar: number; semiMajorAxisAu: number; periodYears: number; periodDays: number; explanationAr: string } {
  const centralMassSolar = clamp(centralMassSolarInput, 0.01, 1000)
  const semiMajorAxisAu = clamp(semiMajorAxisAuInput, 0.0001, 1_000_000)

  // In convenient units: P(years) = sqrt(a^3 / M) (M in solar masses, a in AU)
  const periodYears = Math.sqrt(Math.pow(semiMajorAxisAu, 3) / centralMassSolar)
  const periodDays = periodYears * 365.25

  return {
    centralMassSolar,
    semiMajorAxisAu,
    periodYears,
    periodDays,
    explanationAr:
      'قانون كبلر الثالث في وحدات فلكية مبسطة: إذا كانت \(a\\) بالوحدة الفلكية (AU) وكتلة النجم \(M\\) بكتل شمسية، فالفترة المدارية \(P\\) بالسنوات هي \(P = \\sqrt{a^3 / M}\\).',
  }
}

