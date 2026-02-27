export type UniverseEntityType = 'era' | 'object' | 'method' | 'mission' | 'constant'
export type UniverseRelationType = 'explains' | 'depends_on' | 'measured_by' | 'observed_by'

export type LearningLevel = 'Beginner' | 'Intermediate' | 'Expert'

export type UniverseEntity = {
  id: string
  type: UniverseEntityType
  name: string
  name_ar?: string
  summary: string
  summary_ar?: string
  tags?: string[]
  recommended_for?: LearningLevel[]
}

export type UniverseRelation = {
  from: string
  to: string
  type: UniverseRelationType
  note?: string
}

export type UniverseModel = {
  schema_version: string
  id_namespace?: string
  title?: string
  title_ar?: string
  entities: UniverseEntity[]
  relations: UniverseRelation[]
}

export type UniverseModelIndex = {
  byId: Map<string, UniverseEntity>
  outgoing: Map<string, UniverseRelation[]>
  incoming: Map<string, UniverseRelation[]>
}

export function indexUniverseModel(model: UniverseModel): UniverseModelIndex {
  const byId = new Map<string, UniverseEntity>()
  for (const e of model.entities) byId.set(e.id, e)

  const outgoing = new Map<string, UniverseRelation[]>()
  const incoming = new Map<string, UniverseRelation[]>()

  for (const r of model.relations) {
    outgoing.set(r.from, [...(outgoing.get(r.from) ?? []), r])
    incoming.set(r.to, [...(incoming.get(r.to) ?? []), r])
  }

  return { byId, outgoing, incoming }
}

export function entityLabel(e: UniverseEntity, lang: 'ar' | 'en' = 'ar') {
  if (lang === 'ar') return e.name_ar ?? e.name
  return e.name
}

export function entitySummary(e: UniverseEntity, lang: 'ar' | 'en' = 'ar') {
  if (lang === 'ar') return e.summary_ar ?? e.summary
  return e.summary
}

export function normalizeText(s: string) {
  return s.toLowerCase().trim()
}

export function entityMatchesQuery(e: UniverseEntity, query: string) {
  const q = normalizeText(query)
  if (!q) return true
  const hay = [
    e.id,
    e.name,
    e.name_ar ?? '',
    e.summary,
    e.summary_ar ?? '',
    ...(e.tags ?? []),
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

const RELATION_PRIORITY: UniverseRelationType[] = ['depends_on', 'explains', 'measured_by', 'observed_by']

export function suggestNextEntityId(
  selectedId: string,
  idx: UniverseModelIndex,
  opts?: { excludeIds?: Set<string> }
): string | null {
  const exclude = opts?.excludeIds ?? new Set<string>()
  const out = idx.outgoing.get(selectedId) ?? []
  const inc = idx.incoming.get(selectedId) ?? []

  // Prefer actionable “next” nodes: dependencies + explanatory chain.
  const candidates: UniverseRelation[] = []
  for (const t of RELATION_PRIORITY) {
    for (const r of out) if (r.type === t) candidates.push(r)
    for (const r of inc) if (r.type === t) candidates.push({ ...r, from: r.to, to: r.from })
  }

  for (const r of candidates) {
    if (!exclude.has(r.to) && idx.byId.has(r.to)) return r.to
  }

  // Fallback: pick something related by tag overlap (if any).
  const selected = idx.byId.get(selectedId)
  if (!selected) return null
  const tags = new Set(selected.tags ?? [])
  if (tags.size === 0) return null

  let best: { id: string; score: number } | null = null
  for (const e of idx.byId.values()) {
    if (e.id === selectedId) continue
    if (exclude.has(e.id)) continue
    const eTags = e.tags ?? []
    let score = 0
    for (const t of eTags) if (tags.has(t)) score += 1
    if (!best || score > best.score) best = { id: e.id, score }
  }
  if (best && best.score > 0) return best.id
  return null
}

