# HalfSPACE – Nav Routes & Production Readiness

## 1) Nav routes – all locales (ar / en / es / zh)

Navbar links come from `data/sitemap.ts` (NAVBAR_SLUGS). Resolved routes:

| Nav label (EN) | href | / (en) | /ar | /es | /zh |
|----------------|------|--------|-----|-----|-----|
| Space Journey | /space-journey | ✅ app/space-journey | ✅ Coming Soon | ✅ Coming Soon | ✅ Coming Soon |
| Solar System | /solar-system | ✅ | ✅ | ✅ | ✅ |
| Planets | /planets | ✅ | ✅ | ✅ | ✅ |
| Stars | /stars | ✅ | ✅ | ✅ | ✅ |
| Galaxies | /galaxies | ✅ | ✅ | ✅ | ✅ |
| Black Holes | /black-holes | ✅ | ✅ | ✅ | ✅ |
| Nebulae | /nebulae | ✅ | ✅ | ✅ | ✅ |
| Missions | /missions | ✅ | ✅ | ✅ | ✅ |
| Telescopes | /telescopes | ✅ | ✅ | ✅ | ✅ |
| Exoplanets | /exoplanets | ✅ | ✅ | ✅ | ✅ |
| Glossary | /glossary | ✅ | ✅ | ✅ | ✅ |
| Today in Space | /today | ✅ app/today | ✅ Coming Soon | ✅ Coming Soon | ✅ Coming Soon |

- **EN:** All 12 routes have real pages under `app/<slug>/page.tsx` (or `app/space-journey`, `app/today`).
- **ar / es / zh:** Solar System through Glossary have real pages under `app/<locale>/<slug>/page.tsx`. **Space Journey** and **Today** had no locale pages; they now show a **Coming Soon** page (no 404):
  - `app/ar/space-journey/page.tsx`, `app/ar/today/page.tsx`
  - `app/es/space-journey/page.tsx`, `app/es/today/page.tsx`
  - `app/zh/space-journey/page.tsx`, `app/zh/today/page.tsx`

So: **no 404s from normal navbar navigation** in any locale.

---

## 2) Account / Sign in entry in header

- **AuthNav** always shows in the header (top-right).
  - When **Clerk is not configured:** "Sign in" and "Create account" link to `/sign-in` and `/sign-up`.
  - When **Clerk is configured:** same links when signed out; when signed in, "Profile" + UserButton.
- Label used in the UI: **"Create account"** (replacing "Sign up") as requested.
- Implemented in `components/AuthNav.tsx` (no `return null` when Clerk is missing).

---

## 3) Language switch in center section

- **LanguageSwitcher** was in the top-right with account.
- It is now in the **center section** of the navbar (same row as nav links):
  - Order: **Logo | [Language] [AmbientAudio] [Nav links…] [More ▼] | [Account]**
- Top-right now has **only** account (Sign in / Create account or Profile).
- Implemented in `components/NavbarInner.tsx`: `LanguageSwitcher` moved into the scrollable center block; removed from the right-hand block.

---

## 4) No broken links; no 404s from normal navigation

- All navbar hrefs resolve to either a real page or the **Coming Soon** page.
- Locale paths are consistent: `/ar/space-journey`, `/es/today`, `/zh/glossary`, etc. No broken locale paths.
- **Coming Soon** (`components/ComingSoon.tsx`) is localized (ar/es/zh/en), includes a title derived from the slug, and links to locale home and “Explore other topics” (e.g. Solar System).

---

## 5) Build note

- `npm run build` **compiles successfully**.
- The only remaining error is: **"Server Actions are not supported with static export"** (from Clerk + `output: 'export'` in `next.config.js`). That is unchanged by these edits. To get a full static export build, you’d need to either remove `output: 'export'` or adjust auth (e.g. client-only Clerk or different auth for static deploy).

---

## Files touched

- `components/ComingSoon.tsx` – new
- `components/AuthNav.tsx` – always show Sign in / Create account; "Create account" label
- `components/NavbarInner.tsx` – language in center, account only on right
- `app/ar/space-journey/page.tsx`, `app/ar/today/page.tsx` – new (Coming Soon)
- `app/es/space-journey/page.tsx`, `app/es/today/page.tsx` – new (Coming Soon)
- `app/zh/space-journey/page.tsx`, `app/zh/today/page.tsx` – new (Coming Soon)
