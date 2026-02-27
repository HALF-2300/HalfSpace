import type { UniverseEntity, UniverseEntityType, UniverseModel, UniverseRelation, UniverseRelationType } from '../types'

export type UniverseIndex = {
  byId: Map<string, UniverseEntity>
  relationsFrom: Map<string, UniverseRelation[]>
  relationsTo: Map<string, UniverseRelation[]>
  entitiesByType: Map<UniverseEntityType, UniverseEntity[]>
}

export function indexUniverseModel(model: UniverseModel): UniverseIndex {
  const byId = new Map<string, UniverseEntity>()
  const relationsFrom = new Map<string, UniverseRelation[]>()
  const relationsTo = new Map<string, UniverseRelation[]>()
  const entitiesByType = new Map<UniverseEntityType, UniverseEntity[]>()

  for (const e of model.entities) {
    byId.set(e.id, e)
    const list = entitiesByType.get(e.type) ?? []
    list.push(e)
    entitiesByType.set(e.type, list)
  }

  for (const type of ['era', 'object', 'method', 'mission', 'constant'] as UniverseEntityType[]) {
    const list = entitiesByType.get(type) ?? []
    list.sort((a, b) => (a.name_ar ?? a.name).localeCompare(b.name_ar ?? b.name))
    entitiesByType.set(type, list)
  }

  for (const r of model.relations) {
    const out = relationsFrom.get(r.from) ?? []
    out.push(r)
    relationsFrom.set(r.from, out)

    const inc = relationsTo.get(r.to) ?? []
    inc.push(r)
    relationsTo.set(r.to, inc)
  }

  const order: Record<UniverseRelationType, number> = {
    explains: 1,
    depends_on: 2,
    measured_by: 3,
    observed_by: 4,
  }

  const sortRelations = (a: UniverseRelation, b: UniverseRelation) =>
    order[a.type] - order[b.type] || (a.note ?? '').localeCompare(b.note ?? '')

  for (const [k, v] of relationsFrom.entries()) v.sort(sortRelations)
  for (const [k, v] of relationsTo.entries()) v.sort(sortRelations)

  return { byId, relationsFrom, relationsTo, entitiesByType }
}

export function entityLabel(entity: UniverseEntity): string {
  return entity.name_ar ?? entity.name
}

export function relationLabel(type: UniverseRelationType): string {
  switch (type) {
    case 'explains':
      return 'يشرح / يؤدي إلى'
    case 'depends_on':
      return 'يعتمد على'
    case 'measured_by':
      return 'يُقاس بواسطة'
    case 'observed_by':
      return 'يُرصد بواسطة'
  }
}

export function filterEntities(
  model: UniverseModel,
  query: string,
  allowedTypes: Set<UniverseEntityType>,
): UniverseEntity[] {
  const q = query.trim().toLowerCase()

  const result = model.entities.filter((e) => {
    if (!allowedTypes.has(e.type)) return false
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
  })

  result.sort((a, b) => entityLabel(a).localeCompare(entityLabel(b)))
  return result
}

export function getRelationsForEntity(index: UniverseIndex, entityId: string): {
  outgoing: UniverseRelation[]
  incoming: UniverseRelation[]
} {
  return {
    outgoing: index.relationsFrom.get(entityId) ?? [],
    incoming: index.relationsTo.get(entityId) ?? [],
  }
}

export function suggestNextEntityId(index: UniverseIndex, entityId: string): string | null {
  const outgoing = index.relationsFrom.get(entityId) ?? []
  if (outgoing.length === 0) return null

  const priority: UniverseRelationType[] = ['explains', 'depends_on', 'measured_by', 'observed_by']
  for (const t of priority) {
    const match = outgoing.find((r) => r.type === t && index.byId.has(r.to))
    if (match) return match.to
  }

  return outgoing.find((r) => index.byId.has(r.to))?.to ?? null
}

