// Core approximations used by Space Challenges (educational).

const MPC_IN_METERS = 3.085677581491367e22
const SEC_PER_YEAR = 365.25 * 24 * 60 * 60
const SEC_PER_GYR = 1e9 * SEC_PER_YEAR

const AU_KM = 149_597_870.7
const LY_KM = 9.4607e12

const G_SI = 6.6743e-11 // m^3 kg^-1 s^-2
const C_SI = 299_792_458 // m/s
const M_SUN_KG = 1.98847e30

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

type CosmologyParams = {
  H0_km_s_Mpc: number
  OmegaM: number
  OmegaLambda: number
}

const DEFAULT_COSMOLOGY: CosmologyParams = { H0_km_s_Mpc: 70, OmegaM: 0.3, OmegaLambda: 0.7 }

function E(z: number, p: CosmologyParams) {
  return Math.sqrt(p.OmegaM * Math.pow(1 + z, 3) + p.OmegaLambda)
}

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
  const H0_s = (p.H0_km_s_Mpc * 1000) / MPC_IN_METERS
  const invH0_s = 1 / H0_s
  const integral = simpsonIntegrate((zp) => 1 / ((1 + zp) * E(zp, p)), 0, z, 1200)
  const t_s = invH0_s * integral
  const t_gyr = t_s / SEC_PER_GYR
  return { z, lookback_gyr: t_gyr, params: p }
}

export function stellarLifetimeGyr(massSolar: number) {
  // t ≈ 10 Gyr * (M/M☉)^(-2.5)
  return 10 * Math.pow(massSolar, -2.5)
}

export function stellarEndpointAr(massSolar: number) {
  if (massSolar < 0.08) return 'قزم بني'
  if (massSolar < 8) return 'قزم أبيض'
  if (massSolar < 20) return 'نجم نيوتروني'
  return 'ثقب أسود'
}

export function orbitalPeriodYears(M_solar: number, a_AU: number) {
  // P^2 = a^3 / M
  return Math.sqrt(Math.pow(a_AU, 3) / M_solar)
}

export function orbitalVelocityKmS(a_AU: number, periodYears: number) {
  // v = 2πa / P
  const v_AU_per_year = (2 * Math.PI * a_AU) / periodYears
  const v_km_s = (v_AU_per_year * AU_KM) / SEC_PER_YEAR
  return v_km_s
}

export function schwarzschildRadiusKm(massSolar: number) {
  const M = massSolar * M_SUN_KG
  const Rs_m = (2 * G_SI * M) / (C_SI * C_SI)
  return Rs_m / 1000
}

export function timeDilationFactorAtMultiple(k: number) {
  // dτ/dt = sqrt(1 - Rs/r) where r = k*Rs => sqrt(1 - 1/k)
  if (k <= 1) return NaN
  return Math.sqrt(1 - 1 / k)
}

export function auToKm(au: number) {
  return au * AU_KM
}

export function kmToAu(km: number) {
  return km / AU_KM
}

export function kmToLy(km: number) {
  return km / LY_KM
}

export function lyToKm(ly: number) {
  return ly * LY_KM
}

