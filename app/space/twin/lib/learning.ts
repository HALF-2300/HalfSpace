import type { UniverseIndex } from './model'
import { entityLabel, relationLabel } from './model'
import type { LearningLevel, LearningPath, UniverseEntity, UniverseEntityType, UniverseModel, UniverseRelation } from '../types'

const TYPE_LABEL_AR: Record<UniverseEntityType, string> = {
  era: 'حقبة',
  object: 'جسم/كيان فلكي',
  method: 'طريقة/منهج',
  mission: 'مهمة/مرصد',
  constant: 'ثابت/معامل',
}

const LEVEL_STEP_COUNTS: Record<LearningLevel, number> = {
  Beginner: 10,
  Intermediate: 15,
  Expert: 20,
}

function stepPlan(level: LearningLevel): UniverseEntityType[] {
  // A deterministic type schedule that mixes concepts and keeps it readable.
  // If the model grows, this still produces stable paths.
  if (level === 'Beginner') {
    return ['method', 'constant', 'era', 'object', 'method', 'mission', 'object', 'era', 'constant', 'mission']
  }
  if (level === 'Intermediate') {
    return [
      'method',
      'constant',
      'era',
      'object',
      'method',
      'object',
      'mission',
      'era',
      'object',
      'method',
      'constant',
      'mission',
      'object',
      'era',
      'method',
    ]
  }
  return [
    'constant',
    'method',
    'era',
    'object',
    'method',
    'constant',
    'object',
    'era',
    'mission',
    'method',
    'object',
    'constant',
    'method',
    'era',
    'object',
    'mission',
    'method',
    'constant',
    'object',
    'era',
  ]
}

function preferredSeeds(level: LearningLevel): string[] {
  // Ordered, stable seeds. The generator will skip ids that don't exist.
  if (level === 'Beginner') {
    return [
      'method.redshift',
      'constant.h0',
      'era.big-bang',
      'object.sun',
      'method.spectroscopy',
      'mission.jwst',
      'object.exoplanet',
    ]
  }
  if (level === 'Intermediate') {
    return [
      'era.recombination',
      'object.cosmic-microwave-background',
      'mission.planck',
      'method.standard-candle',
      'mission.hubble',
      'object.milky-way',
      'mission.gaia',
      'method.parallax',
    ]
  }
  return [
    'constant.omega_m',
    'constant.omega_lambda',
    'constant.h0',
    'method.orbital-dynamics',
    'constant.g',
    'object.black-hole',
    'object.neutron-star',
  ]
}

function chooseSeed(index: UniverseIndex, level: LearningLevel): UniverseEntity {
  for (const id of preferredSeeds(level)) {
    const e = index.byId.get(id)
    if (e) return e
  }
  // Fallback: pick the most connected entity in the model (stable tie-break by label).
  const all = Array.from(index.byId.values())
  all.sort((a, b) => {
    const degA = (index.relationsFrom.get(a.id)?.length ?? 0) + (index.relationsTo.get(a.id)?.length ?? 0)
    const degB = (index.relationsFrom.get(b.id)?.length ?? 0) + (index.relationsTo.get(b.id)?.length ?? 0)
    return degB - degA || entityLabel(a).localeCompare(entityLabel(b))
  })
  return all[0]
}

type Pick = { entity: UniverseEntity; via?: { rel: UniverseRelation; prev: UniverseEntity } }

function pickNext(
  model: UniverseModel,
  index: UniverseIndex,
  prev: UniverseEntity,
  desiredType: UniverseEntityType,
  used: Set<string>,
): Pick {
  const priority: Array<UniverseRelation['type']> = ['explains', 'depends_on', 'measured_by', 'observed_by']
  const outgoing = index.relationsFrom.get(prev.id) ?? []

  const relatedEntities: UniverseEntity[] = outgoing
    .filter((r) => index.byId.has(r.to))
    .map((r) => index.byId.get(r.to)!)
    .filter((e) => !used.has(e.id))

  // 1) Prefer related entities matching desired type and relation priority
  for (const t of priority) {
    const rel = outgoing.find((r) => r.type === t && index.byId.has(r.to) && !used.has(r.to))
    if (rel) {
      const candidate = index.byId.get(rel.to)!
      if (candidate.type === desiredType) return { entity: candidate, via: { rel, prev } }
    }
  }

  // 2) Any related entity of desired type
  const relatedOfType = relatedEntities.filter((e) => e.type === desiredType)
  if (relatedOfType.length > 0) {
    relatedOfType.sort((a, b) => entityLabel(a).localeCompare(entityLabel(b)))
    const chosen = relatedOfType[0]
    const rel = outgoing.find((r) => r.to === chosen.id)!
    return { entity: chosen, via: { rel, prev } }
  }

  // 3) Any related entity
  if (relatedEntities.length > 0) {
    relatedEntities.sort((a, b) => entityLabel(a).localeCompare(entityLabel(b)))
    const chosen = relatedEntities[0]
    const rel = outgoing.find((r) => r.to === chosen.id)!
    return { entity: chosen, via: { rel, prev } }
  }

  // 4) Next unused entity of desired type (stable)
  const byType = model.entities
    .filter((e) => e.type === desiredType && !used.has(e.id))
    .sort((a, b) => entityLabel(a).localeCompare(entityLabel(b)))
  if (byType.length > 0) return { entity: byType[0] }

  // 5) Any unused entity (stable)
  const any = model.entities
    .filter((e) => !used.has(e.id))
    .sort((a, b) => entityLabel(a).localeCompare(entityLabel(b)))
  return { entity: any[0] }
}

function reasonForPick(pick: Pick, desiredType: UniverseEntityType, stepIdx: number): string {
  if (!pick.via) {
    if (stepIdx === 0) {
      return 'نقطة دخول مقصودة: نبدأ بمفهوم مركزي يربط أجزاء النموذج بالمحاكيات والمسار.'
    }
    return `لتحقيق توازن في المسار: هذه خطوة من نوع "${TYPE_LABEL_AR[desiredType]}" تكمّل الصورة قبل الانتقال للخطوة التالية.`
  }

  const prev = entityLabel(pick.via.prev)
  const next = entityLabel(pick.entity)
  const rel = relationLabel(pick.via.rel.type)
  const note = pick.via.rel.note ? ` — ${pick.via.rel.note}` : ''
  return `لأن (${prev}) ${rel} (${next})${note}`
}

export function generateLearningPath(model: UniverseModel, index: UniverseIndex, level: LearningLevel): LearningPath {
  const types = stepPlan(level)
  const targetCount = LEVEL_STEP_COUNTS[level]
  const used = new Set<string>()

  const steps: LearningPath['steps'] = []

  const seed = chooseSeed(index, level)
  used.add(seed.id)
  steps.push({
    index: 0,
    entityId: seed.id,
    title: entityLabel(seed),
    type: seed.type,
    reason: reasonForPick({ entity: seed }, types[0] ?? seed.type, 0),
  })

  let prev = seed
  for (let i = 1; i < targetCount; i++) {
    const desiredType = types[i] ?? types[types.length - 1] ?? 'object'
    const pick = pickNext(model, index, prev, desiredType, used)
    used.add(pick.entity.id)
    steps.push({
      index: i,
      entityId: pick.entity.id,
      title: entityLabel(pick.entity),
      type: pick.entity.type,
      reason: reasonForPick(pick, desiredType, i),
    })
    prev = pick.entity
  }

  return { level, steps }
}

export function generateAllLearningPaths(model: UniverseModel, index: UniverseIndex): LearningPath[] {
  const levels: LearningLevel[] = ['Beginner', 'Intermediate', 'Expert']
  return levels.map((level) => generateLearningPath(model, index, level))
}

export function levelLabelAr(level: LearningLevel): string {
  switch (level) {
    case 'Beginner':
      return 'مبتدئ'
    case 'Intermediate':
      return 'متوسط'
    case 'Expert':
      return 'خبير'
  }
}

