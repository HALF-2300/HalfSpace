# HalfSpace implementation plan

**Goal:** Give HalfSpace a clear identity within Half and a reliable bilingual gateway into its existing science and experiences.
**Architecture:** Shared hub for /space and /space/home; typed curated route data; pure science and filtering helpers; scoped CSS. Preserve current route structure and original home.
**Tech stack:** Existing Next.js 14, React 18, TypeScript; no new dependencies.
**Spec:** docs/halfspace-sector.md

## Constraints
- Preserve existing experiences, company identity, and deployment destination.
- Label creative work, simulations, dated catalog values, and distance approximations honestly.
- Support Arabic RTL and English LTR and unavailable browser storage.

## Review focus
- Invalid/nonfinite distances, impossible horizon inputs: reject rather than invent results.
- Stored junk, obsolete route IDs, and denied storage: recover without crashing.
- Empty searches and combined category filters: show useful empty state and reset.
- Mobile, keyboard and reduced-motion visitors: readable, operable controls.
- Old links and SpaceSitemapGuard: keep existing routes reachable.

## Tasks
- [x] Add meaningful failing science, bilingual search, and progress-state tests, then implement pure helpers.
- [x] Implement the shared exploration hub, audience paths, route filters, light lab, source policy and scoped responsive visual design.
- [x] Wire the existing gateways/home/brand; remove competing gateway overlays only on the two hub routes.
- [x] Repair the archive feed and misleading freshness labels; clarify calculator assumptions.
- [x] Run existing and new tests, TypeScript, build and browser checks; review diff and record evidence.
