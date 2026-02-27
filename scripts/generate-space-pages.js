/* eslint-disable @typescript-eslint/no-var-requires */
// Build-time generator: emits static HTML pages for every Space index entry.
// Uses the generated index (data/spaceIndex.generated.json) to avoid TypeScript imports.
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const indexPath = path.join(root, 'data', 'spaceIndex.generated.json')
const outputDir = path.join(root, 'public', 'space-pages')

if (!fs.existsSync(indexPath)) {
  console.error('Missing data/spaceIndex.generated.json. Run "npm run build:space-index" first.')
  process.exit(1)
}

/** @type {{ generatedAt: string; entries: Array<{ id: string; title: string; summary: string; content: string; href: string; type: string; category?: string; tags: string[]; image?: string; }> }} */
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'))

fs.mkdirSync(outputDir, { recursive: true })

const sanitize = value => String(value || '').replace(/[^a-z0-9\-]+/gi, '-').replace(/-+/g, '-').toLowerCase()

const template = entry => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${entry.title} | Space Engine Pro</title>
  <meta name="description" content="${entry.summary || entry.content?.slice(0, 160) || ''}" />
  <meta name="keywords" content="${(entry.tags || []).join(', ')}" />
  <style>
    body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #020617; color: #e2e8f0; padding: 2rem; max-width: 960px; margin: 0 auto; }
    .card { background: rgba(148, 163, 184, 0.08); border: 1px solid rgba(168, 85, 247, 0.4); border-radius: 18px; padding: 24px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25); }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 999px; background: rgba(168, 85, 247, 0.15); color: #c084fc; font-size: 12px; border: 1px solid rgba(168, 85, 247, 0.4); }
    .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .tag { padding: 4px 8px; border-radius: 10px; background: rgba(14, 165, 233, 0.15); color: #7dd3fc; border: 1px solid rgba(14, 165, 233, 0.3); font-size: 12px; }
    h1 { margin: 0 0 12px; font-size: 32px; }
    p { line-height: 1.6; color: #cbd5e1; }
    a { color: #a855f7; }
  </style>
</head>
<body>
  <article class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
      <div class="badge">${entry.type}${entry.category ? ` · ${entry.category}` : ''}</div>
      <small>Indexed: ${index.generatedAt}</small>
    </div>
    <h1>${entry.title}</h1>
    <p>${entry.summary || ''}</p>
    ${entry.image ? `<img src="${entry.image}" alt="${entry.title}" style="width:100%;max-height:360px;object-fit:cover;border-radius:14px;margin:16px 0;border:1px solid rgba(148,163,184,0.3);" />` : ''}
    <div>${(entry.content || '').split('\n').map(para => `<p>${para.trim()}</p>`).join('')}</div>
    ${entry.href ? `<p>Primary route: <a href="${entry.href}">${entry.href}</a></p>` : ''}
    <div class="tags">
      ${(entry.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
  </article>
</body>
</html>
`

let written = 0
index.entries.forEach(entry => {
  const fileName = sanitize(entry.id || entry.title || 'space-entry')
  const filePath = path.join(outputDir, `${fileName}.html`)
  fs.writeFileSync(filePath, template(entry), 'utf8')
  written += 1
})

console.log(`Generated ${written} static pages to ${outputDir}`)
