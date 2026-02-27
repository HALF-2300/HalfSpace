import type { BundlePayloadV1, Catalog } from '../types'

export const BUNDLE_LIMITS = {
  articles: 5,
  facts: 5,
  images: 5,
  missions: 3,
} as const

function uniq(list: string[]) {
  return Array.from(new Set(list.filter((x) => typeof x === 'string' && x.trim().length > 0)))
}

export type BundleValidationResult = {
  payload: BundlePayloadV1
  removedInvalidIds: string[]
  removedDuplicates: string[]
  truncated: Array<{ type: keyof typeof BUNDLE_LIMITS; removedCount: number }>
}

export function validateBundlePayload(catalog: Catalog, raw: BundlePayloadV1): BundleValidationResult {
  const removedInvalidIds: string[] = []
  const removedDuplicates: string[] = []
  const truncated: Array<{ type: keyof typeof BUNDLE_LIMITS; removedCount: number }> = []

  function normalize(list: string[], typeKey: keyof typeof BUNDLE_LIMITS): string[] {
    const before = list.slice()
    const deduped = uniq(before)
    if (deduped.length !== before.length) {
      const set = new Set<string>()
      for (const id of before) {
        if (!id || set.has(id)) removedDuplicates.push(id)
        set.add(id)
      }
    }

    const valid = deduped.filter((id) => {
      const ok = Boolean(catalog.byId[id])
      if (!ok) removedInvalidIds.push(id)
      return ok
    })

    const limit = BUNDLE_LIMITS[typeKey]
    if (valid.length > limit) {
      const removed = valid.length - limit
      truncated.push({ type: typeKey, removedCount: removed })
      return valid.slice(0, limit)
    }
    return valid
  }

  const payload: BundlePayloadV1 = {
    version: 1,
    title: typeof raw.title === 'string' ? raw.title : '',
    articleIds: normalize(Array.isArray(raw.articleIds) ? raw.articleIds : [], 'articles'),
    factIds: normalize(Array.isArray(raw.factIds) ? raw.factIds : [], 'facts'),
    imageIds: normalize(Array.isArray(raw.imageIds) ? raw.imageIds : [], 'images'),
    missionIds: normalize(Array.isArray(raw.missionIds) ? raw.missionIds : [], 'missions'),
    createdAt: typeof raw.createdAt === 'string' && raw.createdAt ? raw.createdAt : new Date().toISOString(),
  }

  return { payload, removedInvalidIds, removedDuplicates, truncated }
}

