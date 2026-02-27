# Space Engine Pro (Additions Only)

New additive layer that keeps the existing search/encyclopedia flows untouched while delivering a unified index, BM25-lite ranking, related-content rails, and optional static page generation.

## What was added
- `utils/indexer/spaceEnginePro.ts` — BM25-lite scorer over the existing `SpaceIndexEntry` dataset with highlight helpers, facets, quick picks, and related suggestions that blend tags + keywords.
- `components/SpaceEnginePro/ProSearchPanel.tsx` — Advanced search UI (type filters, quick picks, highlights, live scores).
- `components/SpaceEnginePro/RelatedRail.tsx` — Drop-in related content rail powered by the unified indexer.
- `app/space/engine-pro/page.tsx` — Showcase page that wires the Pro search + related rail without changing legacy pages.
- `scripts/generate-space-pages.js` — Optional generator that emits static HTML stubs for every indexed entry.

## Build or refresh the index
1) Generate the JSON index (PowerShell-friendly):
```
npm run build:space-index
```
This creates/refreshes `data/spaceIndex.generated.json` (used by both the runtime indexer and the static-page generator).

## Run the Pro search UI
```
npm run dev
# open http://localhost:3000/space/engine-pro
```
- Type queries to see BM25-lite ranked hits, highlight marks, and per-type filters.
- Quick picks appear when the box is empty for instant navigation.
- Selecting a result drives the related-content rail beneath the search box.

## Generate static pages (optional strong)
```
npm run build:space-index
node scripts/generate-space-pages.js
```
- Outputs HTML files to `public/space-pages`.
- Each file includes title, summary, content, tags, and primary route.
- Serve directly from `public` or via your CDN/edge cache.

## Add new content to the index
- Drop new dataset entries into the existing JSON files under `data/` (articles, terms, missions, facts, gallery, timeline eras).
- Regenerate the index (`npm run build:space-index`) to ingest new items.
- The Pro engine reads the same `SpaceIndexEntry` shape, so no extra wiring is required for new content types already covered by the indexer.

## Test the search layer quickly
- Smoke: `npm run lint` (ensures components and scripts import cleanly).
- UX: run dev server and exercise `/space/engine-pro` with queries (e.g., “black hole”, “Voyager”, “infrared”, “nebula”).
- Static gen: after running the generator, open any file under `public/space-pages` directly in the browser to confirm layout + metadata.

## Notes
- All changes are additive—no legacy components or routes were modified.
- The Pro engine reuses the existing `SpaceIndexEntry` pipeline; if the generated JSON is absent, fallback runtime building still works via the existing indexer.
