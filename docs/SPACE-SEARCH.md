# Space Search Index & UI

This agent adds a unified search index plus UI for handbook sections, glossary terms, missions, facts, gallery images, encyclopedia articles, and timeline eras.

## Generate or refresh the index

- Run `npm run build:space-index` (PowerShell-friendly)  
  - Builds `data/spaceIndex.generated.json` with all entries (currently ~445).
  - Source data: `data/handbook.json`, `data/glossary.json`, `data/missions.json`, `data/facts.json`, `data/observatoryGallery.json`, `data/timeline.json`, and all files under `data/encyclopedia`.

The runtime indexer in `utils/indexer/spaceIndexer.ts` loads the generated file first; if it is missing, it rebuilds in-memory from the raw data.

## Components

- `components/SpaceSearch/SpaceSearch.tsx` — unified search UI with type filters, grouped results, and match highlighting. Wired into `app/space/encyclopedia/page.tsx`.
- `components/SpaceSearch/RelatedContent.tsx` — tag/keyword–based related suggestions (used on encyclopedia articles and glossary term modal).

## Utilities

- `utils/indexer/spaceIndexer.ts` — builds normalized index entries and exposes `getSpaceIndexEntries`, `getRelatedEntries`, and `slugify`.
- `utils/indexer/spaceSearchEngine.ts` — thin wrapper around the existing search index to score, highlight, and group results.

## Notes

- Additions only: no existing search flows were removed. The legacy encyclopedia search box remains in place.
- When adding new datasets, extend the indexer and regenerate the JSON file to keep the UI in sync.
