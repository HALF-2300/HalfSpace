# 🎯 HalfSpace - Next Orders Specification

**Status:** Ready to implement (after Surprise Core verification)  
**Priority Order:** A → B → C → D

---

## 📦 ORDER A — Jump Presets (Universe Navigation)

**Goal:** Transform random jump into **controlled exploration**

### Implementation

**Add to Console Panel:**
```tsx
// components/console/ConsolePanel.tsx

<div className="space-y-2">
  <h3 className="text-xs font-semibold text-gray-400 uppercase">
    Quick Jump
  </h3>
  <div className="grid grid-cols-2 gap-2">
    <JumpButton category="objects" label="🪐 Objects" />
    <JumpButton category="phenomena" label="💫 Phenomena" />
    <JumpButton category="missions" label="🚀 Missions" />
    <JumpButton category="learning" label="📚 Learn" />
    <JumpButton category="experiences" label="✨ Experience" />
    <JumpButton category="tools" label="🔭 Tools" />
  </div>
</div>
```

**Update Jump Handler:**
```typescript
const handleCategoryJump = (category: string) => {
  const destination = getRandomJump({ category, exclude: [currentId] })
  // ... rest of jump logic
}
```

**Estimated Time:** 30 minutes  
**Impact:** High - Makes randomness feel intentional

---

## 🗺️ ORDER B — Station Map Overlay (Place Metaphor)

**Goal:** Make the "rooms" concept **visible and navigable**

### Implementation

**Create Station Map Component:**
```tsx
// components/station/StationMap.tsx

const ROOMS = [
  { id: 'observation', name: 'Observation Deck', icon: '🔭', url: '/space/gallery' },
  { id: 'control', name: 'Mission Control', icon: '🎮', url: '/missions' },
  { id: 'archive', name: 'Archive', icon: '📚', url: '/space/guide' },
  { id: 'lab', name: 'Lab', icon: '🧪', url: '/space/black-hole-lab' },
  { id: 'terminal', name: 'Today Terminal', icon: '📅', url: '/today' }
]
```

**Add to Console:**
- New button: "🗺️ Station Map"
- Opens fullscreen overlay
- Animated room cards with hover effects
- Click room → navigate + close map

**Visual Design:**
- Dark overlay (blur backdrop)
- Hexagonal grid layout
- Glowing borders on hover
- Room icons pulse subtly

**Estimated Time:** 1.5 hours  
**Impact:** Very High - Core identity feature

---

## 🖼️ ORDER C — Cinematic Gallery (Biggest Upgrade)

**Goal:** Turn gallery into an **immersive story mode**

### Implementation

**Create Gallery Viewer:**
```tsx
// components/gallery/CinematicViewer.tsx

Features:
- Fullscreen mode (Escape to exit)
- Keyboard arrows (prev/next)
- Preload next 2 images
- Image metadata overlay (fade on hover)
- "Save to Collection" button
- "Jump from Here" (related items)
- Smooth transitions (300ms)
```

**Data Structure:**
```json
// data/gallery.json (enhance existing)
{
  "items": [
    {
      "id": "pillars-of-creation",
      "title": "Pillars of Creation",
      "url": "...",
      "description": "...",
      "related": ["nebulae", "stars", "telescopes"],
      "tags": ["nebula", "hubble", "star-formation"]
    }
  ]
}
```

**Entry Points:**
- `/space/gallery` → Grid view with "Cinematic Mode" toggle
- Click any image → Opens viewer
- Console → "🖼️ Gallery" quick action

**Estimated Time:** 2.5 hours  
**Impact:** Very High - "This is not normal" moment

---

## 🔍 ORDER D — Search v1 (Fulfill Promise)

**Goal:** Make `Ctrl+K` hint **actually work**

### Current State
- `GlobalSearch` component exists
- `SearchModal` exists
- Ctrl+K listener works
- **Missing:** Actual search implementation

### Implementation

**Enhance SearchModal:**
```tsx
// components/search/SearchModal.tsx

import { searchItems } from '@/lib/jumpEngine'

const [query, setQuery] = useState('')
const [results, setResults] = useState<JumpDestination[]>([])

useEffect(() => {
  if (query.length < 2) {
    setResults([])
    return
  }
  
  const matches = searchItems(query)
  setResults(matches.slice(0, 10)) // Top 10 results
}, [query])
```

**UI Features:**
- Grouped results by category
- Keyboard navigation (↑↓ arrows)
- Enter to navigate
- Escape to close
- Recent searches (localStorage)
- Empty state: "Try: black holes, mars, missions"

**Estimated Time:** 1.5 hours  
**Impact:** Critical - Broken hints kill trust

---

## 🎯 RECOMMENDED ORDER

### Week 1: Foundation
1. **Order D** (Search v1) - Fix broken promise
2. **Order A** (Jump Presets) - Quick win

### Week 2: Identity
3. **Order B** (Station Map) - Core differentiation
4. **Order C** (Cinematic Gallery) - Wow factor

---

## 📊 EFFORT vs IMPACT MATRIX

```
High Impact │ B (Station Map)    C (Gallery)
            │
            │ A (Jump Presets)   D (Search)
Low Impact  │
            └─────────────────────────────
              Low Effort        High Effort
```

**Recommendation:** Start with **D + A** (both low effort, fix trust + add value), then **B** (identity), then **C** (polish).

---

## 🚨 CRITICAL: Search Must Work

**Why Order D is urgent:**

The console header says:
```
"Press C"  ← Works ✅
```

The console panel shows:
```
"Ctrl+K"   ← Must work ✅
```

**If Ctrl+K opens an empty modal, users will think:**
- "This is broken"
- "They promised features they didn't build"
- "Is the rest of the site this unfinished?"

**Fix:** Implement basic search (even simple string matching) BEFORE adding new features.

---

## 🎬 IMPLEMENTATION CHECKLIST

### Before Starting Any Order:
- [ ] Verify Surprise Core works in production
- [ ] Run Lighthouse baseline
- [ ] Commit current state to git

### After Each Order:
- [ ] Test on mobile + desktop
- [ ] Check reduced motion support
- [ ] Verify no console errors
- [ ] Update this checklist

### Before Marking Complete:
- [ ] User testing (5 people minimum)
- [ ] Performance check (no regression)
- [ ] Accessibility audit
- [ ] Update main README

---

## 💡 BONUS: Quick Wins (< 30 min each)

1. **Toast Sounds** - Subtle "whoosh" on jump (optional, off by default)
2. **Jump Counter** - "You've explored 12 places today"
3. **Breadcrumb Trail** - Show last 3 visited pages
4. **Surprise Me** - Random jump from homepage hero
5. **Share Jump** - "Share this discovery" button in toast

---

**Ready to implement?** Start with **Order D** (Search v1) to fulfill the Ctrl+K promise, then move to **Order A** (Jump Presets) for quick impact.
