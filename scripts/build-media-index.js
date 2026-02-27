#!/usr/bin/env node
/**
 * Rebuilds data/media/index.json from files inside public/space/media.
 * Minimal, zero-dependency helper that keeps any existing descriptions/credits when present.
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const MEDIA_ROOT = path.join(ROOT, 'public', 'space', 'media')
const OUTPUT = path.join(ROOT, 'data', 'media', 'index.json')

const TYPE_BY_DIR = {
  images: 'image',
  image: 'image',
  video: 'video',
  videos: 'video',
}

const CATEGORY_HINTS = [
  { key: 'nebula', category: 'Nebula' },
  { key: 'galaxy', category: 'Galaxy' },
  { key: 'planet', category: 'Planet' },
  { key: 'mission', category: 'Mission' },
  { key: 'telescope', category: 'Telescope' },
  { key: 'earth', category: 'Earth from space' },
]

const DEFAULT_TAGS = {
  Nebula: ['Nebula', 'Deep sky'],
  Galaxy: ['Galaxy', 'Survey'],
  Planet: ['Planet', 'Atmosphere'],
  Mission: ['Mission', 'Ops'],
  Telescope: ['Telescope', 'Array'],
  'Earth from space': ['Earth', 'Orbit'],
}

function toTitle(name) {
  return name
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function inferCategory(name) {
  const lower = name.toLowerCase()
  const hint = CATEGORY_HINTS.find((entry) => lower.includes(entry.key))
  return hint ? hint.category : 'Mission'
}

function guessThumbnail(itemPath) {
  const base = path.basename(itemPath, path.extname(itemPath))
  const candidate = path.join(MEDIA_ROOT, 'images', `${base}.png`)
  if (fs.existsSync(candidate)) {
    return `/space/media/images/${base}.png`
  }
  return undefined
}

function loadPrevious() {
  if (!fs.existsSync(OUTPUT)) return { items: [], categories: [] }
  try {
    return JSON.parse(fs.readFileSync(OUTPUT, 'utf8'))
  } catch (error) {
    console.warn('⚠️  Failed to read existing index, continuing fresh.', error)
    return { items: [], categories: [] }
  }
}

function collectFiles() {
  if (!fs.existsSync(MEDIA_ROOT)) return []
  const entries = fs.readdirSync(MEDIA_ROOT, { withFileTypes: true })
  const items = []

  for (const dirent of entries) {
    if (!dirent.isDirectory()) continue
    const dirName = dirent.name
    const type = TYPE_BY_DIR[dirName]
    if (!type) continue

    const folder = path.join(MEDIA_ROOT, dirName)
    const files = fs.readdirSync(folder).filter((file) => !file.startsWith('.'))
    for (const file of files) {
      const ext = path.extname(file).toLowerCase()
      if (!ext) continue
      const id = path.basename(file, ext).toLowerCase().replace(/[^a-z0-9]+/g, '-')

      items.push({
        id,
        file,
        path: `/space/media/${dirName}/${file}`,
        type,
        category: inferCategory(file),
        thumbnail: type === 'video' ? guessThumbnail(file) : `/space/media/${dirName}/${file}`,
      })
    }
  }

  return items
}

function buildIndex() {
  const previous = loadPrevious()
  const previousMap = new Map(previous.items.map((item) => [item.id, item]))

  const rawFiles = collectFiles()

  const items = rawFiles.map((entry) => {
    const prev = previousMap.get(entry.id) ?? {}
    const category = prev.category || entry.category || 'Mission'

    return {
      id: entry.id,
      title: prev.title || toTitle(entry.id),
      type: entry.type,
      category,
      src: entry.path,
      thumbnail: prev.thumbnail || entry.thumbnail,
      description: prev.description || '',
      tags: prev.tags || DEFAULT_TAGS[category] || [],
      credit: prev.credit || 'Local asset',
      duration: prev.duration,
      resolution: prev.resolution,
    }
  })

  const categories = Array.from(
    new Set([
      ...previous.categories,
      ...items.map((item) => item.category),
      'Nebula',
      'Galaxy',
      'Planet',
      'Mission',
      'Telescope',
      'Earth from space',
    ])
  )

  const index = {
    updated: new Date().toISOString(),
    categories,
    items,
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(index, null, 2))
  console.log(`✅ media index written: ${items.length} items -> ${path.relative(ROOT, OUTPUT)}`)
}

buildIndex()
