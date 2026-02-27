import type { LearningLevel, UniverseEntity, UniverseModel, UniverseModelIndex, UniverseRelationType } from './universeModel'
import { indexUniverseModel } from './universeModel'

export type LearningStep = {
  step: number
  entityId: string
  reason_ar: string
  reason_en: string
}

export type LearningPath = {
  level: LearningLevel
  steps: LearningStep[]
}

const PATH_LENGTH: Record<LearningLevel, number> = {
  Beginner: 10,
  Intermediate: 15,
  Expert: 20,
}

const TYPE_ORDER: Record<UniverseEntity['type'], number> = {
  constant: 0,
  method: 1,
  object: 2,
  mission: 3,
  era: 4,
}

function scoreEntityForLevel(e: UniverseEntity, level: LearningLevel) {
  const rec = e.recommended_for ?? []
  let score = 0
  if (rec.includes(level)) score += 10
  // Allow “earlier” levels to reuse foundations.
  if (level === 'Intermediate' && rec.includes('Beginner')) score += 3
  if (level === 'Expert' && (rec.includes('Beginner') || rec.includes('Intermediate'))) score += 2
  score += Math.max(0, 5 - TYPE_ORDER[e.type]) // bias towards constants/methods early
  score += (e.tags?.length ?? 0) * 0.1
  return score
}

function relationBoost(idx: UniverseModelIndex, candidateId: string, chosen: Set<string>) {
  const out = idx.outgoing.get(candidateId) ?? []
  const inc = idx.incoming.get(candidateId) ?? []
  let boost = 0
  for (const r of out) if (chosen.has(r.to)) boost += 1
  for (const r of inc) if (chosen.has(r.from)) boost += 1
  return boost
}

function findRelationToChosen(
  idx: UniverseModelIndex,
  entityId: string,
  chosenOrdered: string[]
): { type: UniverseRelationType; otherId: string; dir: 'to' | 'from' } | null {
  const out = idx.outgoing.get(entityId) ?? []
  const inc = idx.incoming.get(entityId) ?? []

  const chosenSet = new Set(chosenOrdered)
  for (const r of out) {
    if (chosenSet.has(r.to)) return { type: r.type, otherId: r.to, dir: 'to' }
  }
  for (const r of inc) {
    if (chosenSet.has(r.from)) return { type: r.type, otherId: r.from, dir: 'from' }
  }
  return null
}

function explainReason(
  idx: UniverseModelIndex,
  e: UniverseEntity,
  chosenOrdered: string[],
  level: LearningLevel
): { ar: string; en: string } {
  const rel = findRelationToChosen(idx, e.id, chosenOrdered)
  if (!rel) {
    const tag = (e.tags ?? [])[0]
    const tagChunk = tag ? ` (محور: ${tag})` : ''
    return {
      ar: `خطوة لبناء الأساس لـ${level}.${tagChunk}`,
      en: `Foundation step for ${level}.${tag ? ` (topic: ${tag})` : ''}`,
    }
  }

  const other = idx.byId.get(rel.otherId)
  const otherName = other?.name_ar ?? other?.name ?? rel.otherId

  if (rel.type === 'depends_on') {
    return {
      ar: `مهم لأن فهمه يعتمد على ${otherName}.`,
      en: `Important because it depends on ${other?.name ?? rel.otherId}.`,
    }
  }
  if (rel.type === 'explains') {
    return {
      ar: `يربط الفكرة الحالية بسياق أشمل ويشرح ${otherName}.`,
      en: `Connects the current idea and explains ${other?.name ?? rel.otherId}.`,
    }
  }
  if (rel.type === 'measured_by') {
    return {
      ar: `يُظهر كيف نقيس/نستنتج هذا المفهوم عملياً (عبر ${otherName}).`,
      en: `Shows how we measure/infer it in practice (via ${other?.name ?? rel.otherId}).`,
    }
  }
  return {
    ar: `يعطي ربطاً رصدياً/تطبيقياً عبر ${otherName}.`,
    en: `Provides an observational/practical link via ${other?.name ?? rel.otherId}.`,
  }
}

function pickSeedIds(level: LearningLevel) {
  if (level === 'Beginner') {
    return ['constant-c', 'constant-g', 'method-redshift', 'method-kepler-third-law', 'object-star']
  }
  if (level === 'Intermediate') {
    return ['constant-h0', 'method-hubble-law', 'method-spectroscopy', 'method-stellar-evolution-models', 'object-galaxy']
  }
  return ['era-recombination', 'era-first-stars', 'method-distance-ladder', 'mission-jwst', 'object-exoplanet']
}

function ensureTypeCoverage(level: LearningLevel, idx: UniverseModelIndex, chosen: Set<string>, ordered: string[]) {
  const need: UniverseEntity['type'][] = ['constant', 'method', 'object', 'mission', 'era']
  const have = new Set<UniverseEntity['type']>()
  for (const id of ordered) {
    const e = idx.byId.get(id)
    if (e) have.add(e.type)
  }

  for (const t of need) {
    if (have.has(t)) continue
    const candidates = [...idx.byId.values()]
      .filter((e) => e.type === t && !chosen.has(e.id))
      .sort((a, b) => scoreEntityForLevel(b, level) - scoreEntityForLevel(a, level))
    if (candidates[0]) {
      chosen.add(candidates[0].id)
      ordered.push(candidates[0].id)
      have.add(t)
    }
  }
}

export function generateLearningPaths(model: UniverseModel): Record<LearningLevel, LearningPath> {
  const idx = indexUniverseModel(model)

  const out: Record<LearningLevel, LearningPath> = {
    Beginner: { level: 'Beginner', steps: [] },
    Intermediate: { level: 'Intermediate', steps: [] },
    Expert: { level: 'Expert', steps: [] },
  }

  for (const level of Object.keys(PATH_LENGTH) as LearningLevel[]) {
    const length = PATH_LENGTH[level]
    const chosen = new Set<string>()
    const ordered: string[] = []

    // Seed with a curated set to keep paths stable and meaningful.
    for (const id of pickSeedIds(level)) {
      if (idx.byId.has(id) && !chosen.has(id)) {
        chosen.add(id)
        ordered.push(id)
      }
    }

    ensureTypeCoverage(level, idx, chosen, ordered)

    // Fill remaining steps by score + relation proximity to already chosen.
    while (ordered.length < length) {
      let best: { id: string; score: number } | null = null
      for (const e of idx.byId.values()) {
        if (chosen.has(e.id)) continue
        const score = scoreEntityForLevel(e, level) + relationBoost(idx, e.id, chosen) * 2
        if (!best || score > best.score) best = { id: e.id, score }
      }
      if (!best) break
      chosen.add(best.id)
      ordered.push(best.id)
    }

    // Materialize steps with reasons.
    out[level].steps = ordered.slice(0, length).map((entityId, i) => {
      const e = idx.byId.get(entityId)
      const reason = e ? explainReason(idx, e, ordered.slice(0, i), level) : { ar: 'خطوة مقترحة.', en: 'Suggested step.' }
      return { step: i + 1, entityId, reason_ar: reason.ar, reason_en: reason.en }
    })
  }

  return out
}

