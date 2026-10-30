# HalfSpace development direction

HalfSpace is Half's space exploration and science education sector. Its existing strength is the combination of a large learning library, interactive physics, cinematic exploration, Arabic/English content, and reflective creative experiences. It serves curious visitors, students, and educators. Existing implementation mixes several gateways, unlabelled imaginative experiences and dated static metrics called live. Preserve every existing route and experience.

Chosen approach: upgrade the existing /space and /space/home gateways with one shared, bilingual, accessible exploration hub; connect it from the current home and brand. Reuse Next 14/React 18, existing routes and local assets, without new dependencies or a new hosting destination. Retain the current homepage content and archive.

Alternatives considered: a full rebuild risks losing existing features; cosmetic changes alone do not address discovery or scientific trust.

Deliver: Half sector identity, three audience-based paths, searchable categorized destinations, browser-local exploration checklist with resilient storage, interactive light travel lab with explicit reference frames/units/assumptions and NASA sources, and transparent scientific/creative content labels. Fix the existing broken data feed (nonexistent public JSON) by using curated dated records with source URLs, no live claims. Correct the archive's live-update assertions. Keep original calculators, clarify their physical assumptions, and validate their core formula.

Visual direction: deep navy, cyan, restrained purple, orbital geometry, readable typography, responsive cards. Native controls, keyboard focus, reduced motion, no required WebGL or remote image on the new hub.

Verification: science unit tests including invalid inputs; bilingual search/filter and stored-state tests; existing sim-lab tests; TypeScript baseline comparison; production build; desktop/mobile browser checks and route HTTP checks. Local repository is linked to GitHub and Netlify, with no matching Sites project: do not create a replacement production site. Record any deployment limitation honestly.
