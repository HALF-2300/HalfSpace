'use client'

import type { BundleCompact, BundlePayloadV1 } from '../types'

function base64UrlEncode(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  const b64 = btoa(bin)
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlDecodeToBytes(s: string): Uint8Array {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')
  const bin = atob(padded)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

export function compactFromPayload(payload: BundlePayloadV1): BundleCompact {
  return {
    v: 1,
    t: payload.title,
    a: payload.articleIds,
    f: payload.factIds,
    i: payload.imageIds,
    m: payload.missionIds,
    c: payload.createdAt,
  }
}

export function payloadFromCompact(compact: BundleCompact): BundlePayloadV1 {
  return {
    version: 1,
    title: compact.t ?? '',
    articleIds: Array.isArray(compact.a) ? compact.a : [],
    factIds: Array.isArray(compact.f) ? compact.f : [],
    imageIds: Array.isArray(compact.i) ? compact.i : [],
    missionIds: Array.isArray(compact.m) ? compact.m : [],
    createdAt: typeof compact.c === 'string' && compact.c ? compact.c : new Date().toISOString(),
  }
}

export function encodeCompactToIdsParam(compact: BundleCompact): string {
  const json = JSON.stringify(compact)
  const bytes = new TextEncoder().encode(json)
  return base64UrlEncode(bytes)
}

export function decodeIdsParamToCompact(idsParam: string): BundleCompact | null {
  try {
    const bytes = base64UrlDecodeToBytes(idsParam)
    const json = new TextDecoder().decode(bytes)
    const parsed = JSON.parse(json) as Partial<BundleCompact>
    if (parsed.v !== 1) return null
    return {
      v: 1,
      t: typeof parsed.t === 'string' ? parsed.t : '',
      a: Array.isArray(parsed.a) ? (parsed.a as string[]) : [],
      f: Array.isArray(parsed.f) ? (parsed.f as string[]) : [],
      i: Array.isArray(parsed.i) ? (parsed.i as string[]) : [],
      m: Array.isArray(parsed.m) ? (parsed.m as string[]) : [],
      c: typeof parsed.c === 'string' ? parsed.c : undefined,
    }
  } catch {
    return null
  }
}

