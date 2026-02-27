import fs from 'node:fs'

const path = new URL('../../../../data/space/universe-model.json', import.meta.url)
const filePath = path.pathname.startsWith('/') && process.platform === 'win32' ? path.pathname.slice(1) : path.pathname

const s = fs.readFileSync(filePath, 'utf8')

let i = 0
let depth = 0
let inStr = false
let esc = false

for (; i < s.length; i++) {
  const ch = s[i]
  if (inStr) {
    if (esc) {
      esc = false
      continue
    }
    if (ch === '\\') {
      esc = true
      continue
    }
    if (ch === '"') {
      inStr = false
      continue
    }
    continue
  }

  if (ch === '"') {
    inStr = true
    continue
  }
  if (ch === '{') depth++
  else if (ch === '}') {
    depth--
    if (depth === 0) {
      i++
      break
    }
  }
}

const first = s.slice(0, i).trim()
const obj = JSON.parse(first)
fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8')

// eslint-disable-next-line no-console
console.log('Cleaned universe-model.json →', fs.statSync(filePath).size, 'bytes')

