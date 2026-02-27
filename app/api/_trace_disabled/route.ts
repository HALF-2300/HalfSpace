import { NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'

type SourceRow = {
  source_id: string
  title?: string
  url?: string
  chunks?: string[]
}

type Chunk = {
  citationId: string
  sourceId: string
  chunkIndex: number
  text: string
  title?: string
  url?: string
}

type ChunkStoreRow = {
  citation_id: string
  text: string
  title?: string
  url?: string
}

const REGISTRY_PATH = path.join(process.cwd(), 'data', 'registries', 'sources.jsonl')
const CHUNK_STORE_PATH = path.join(process.cwd(), 'data', 'registries', 'chunks.jsonl')

let cachedChunks: Chunk[] | null = null
let cachedChunkStore: Map<string, ChunkStoreRow> | null = null

function readJsonlRows<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return []
  const content = fs.readFileSync(filePath, 'utf8')
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => JSON.parse(line) as T)
}

function loadChunks(): Chunk[] {
  if (cachedChunks) return cachedChunks

  const rows = readJsonlRows<SourceRow>(REGISTRY_PATH)
  const flatChunks: Chunk[] = []

  rows.forEach(row => {
    row.chunks?.forEach((text, idx) => {
      flatChunks.push({
        citationId: `${row.source_id}#${idx}`,
        sourceId: row.source_id,
        chunkIndex: idx,
        text,
        title: row.title,
        url: row.url,
      })
    })
  })

  cachedChunks = flatChunks
  return flatChunks
}

function loadChunkStore(): Map<string, ChunkStoreRow> {
  if (cachedChunkStore) return cachedChunkStore
  const map = new Map<string, ChunkStoreRow>()
  const rows = readJsonlRows<ChunkStoreRow>(CHUNK_STORE_PATH)
  rows.forEach(row => {
    map.set(row.citation_id, row)
  })
  cachedChunkStore = map
  return map
}

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/\b[\p{L}\p{N}]+\b/gu) || [])
}

function bm25Search(query: string, chunks: Chunk[], k: number): Chunk[] {
  const queryTokens = new Set(tokenize(query))

  const scored = chunks.map(chunk => {
    const tokens = tokenize(chunk.text)
    const overlap = tokens.reduce((acc, token) => acc + (queryTokens.has(token) ? 1 : 0), 0)
    const normalized = overlap / Math.sqrt(tokens.length + 1)
    return { chunk, score: normalized }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(entry => entry.chunk)
}

// Dense search is a deterministic stub for now that reuses the same scoring.
function denseSearch(query: string, chunks: Chunk[], k: number): Chunk[] {
  return bm25Search(query, chunks, k)
}

function fetchChunkById(citationId: string): Chunk | null {
  const chunkStore = loadChunkStore()
  const fromStore = chunkStore.get(citationId)
  if (fromStore) {
    const [sourceId, idxRaw] = citationId.split('#')
    const chunkIndex = Number(idxRaw)
    return {
      citationId,
      sourceId,
      chunkIndex: Number.isFinite(chunkIndex) ? chunkIndex : 0,
      text: fromStore.text,
      title: fromStore.title,
      url: fromStore.url,
    }
  }

  const chunks = loadChunks()
  return chunks.find(chunk => chunk.citationId === citationId) || null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''
  const k = Number(searchParams.get('k') || '5')
  const includeText = (searchParams.get('include_text') || '').toLowerCase() === '1' ||
    (searchParams.get('include_text') || '').toLowerCase() === 'true'

  if (!query.trim()) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 })
  }

  const chunks = loadChunks()
  const candidateResults = bm25Search(query, chunks, Number.isFinite(k) && k > 0 ? k : 5)
  const denseResults = denseSearch(query, chunks, Number.isFinite(k) && k > 0 ? k : 5)

  // Merge unique results preserving order by bm25 then dense fallback.
  const merged: Chunk[] = []
  const seen = new Set<string>()
  const pushUnique = (list: Chunk[]) => {
    list.forEach(chunk => {
      if (seen.has(chunk.citationId)) return
      seen.add(chunk.citationId)
      merged.push(chunk)
    })
  }
  pushUnique(candidateResults)
  pushUnique(denseResults)

  const finalResults = merged.slice(0, Number.isFinite(k) && k > 0 ? k : 5)
  const resolved = finalResults.map(item => fetchChunkById(item.citationId) || item)

  return NextResponse.json({
    query,
    k: resolved.length,
    results: resolved.map(item => ({
      citation_id: item.citationId,
      source_id: item.sourceId,
      chunk_index: item.chunkIndex,
      title: item.title,
      url: item.url,
      text: includeText ? item.text : undefined,
    })),
  })
}
