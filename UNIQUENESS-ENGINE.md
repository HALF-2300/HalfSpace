# Uniqueness Engine

A complete personalization system that makes every user's journey through space feel unique, yet deterministic and shareable.

## Overview

The Uniqueness Engine sits above Timeline + Graph + Missions to create a "crafted" experience that's unique at every level while remaining fully reproducible through share links.

## The 5 Levels of Uniqueness

### Level 1: Identity — Cosmic Signature

On first visit, every user gets:
- **Unique User ID**: Generated UUID for identity
- **Cosmic Seed**: Deterministic seed derived from UUID
- **Visual Tone**: Personalized visual preferences (nebula density, starfield drift, glow, colors)

```typescript
import { getCosmicSignature } from '@/lib/personalization'

const signature = getCosmicSignature()
// Uses localStorage: 'halfspace_cosmic_signature'
```

**Result**: Two users opening the same page feel different immediately.

---

### Level 2: Time — Personalized Timeline Drift

Same 12 epochs, but each user sees:
- **Different Featured Nodes**: Selected from constrained pools per epoch
- **Personal Causal Paths**: "Next Consequence" links adapt to behavior
- **Adjusted Visuals**: Background presets influenced by visual tone

```typescript
import { loadPersonalizedTimeline } from '@/lib/timelinePersonalizer'

const timeline = loadPersonalizedTimeline('cosmic') // or 'session', 'daily', 'share'
// Returns: 12 epochs with personalized featuredNodes
```

**Result**: Timeline isn't a static museum; it's *their* universe timeline.

---

### Level 3: Space — Graph as Living Constellation

Graph becomes unique through:
- **Personal Layout**: Node clustering pulls toward user interests
- **Traversal Lines**: Constellation lines drawn from *their* exploration order
- **Emphasis Weights**: Important nodes sized/highlighted based on preferences
- **Suggested Nodes**: Personalized recommendations

```typescript
import { generatePersonalizedLayout, generateConstellationLines } from '@/lib/space/graph/graphPersonalizer'

const layout = generatePersonalizedLayout(nodes, edges, 'cosmic')
const lines = generateConstellationLines(visitedNodes, layout.nodes)
// Returns: unique node positions + user's personal constellation
```

**Result**: Their map is shaped like their thinking.

---

### Level 4: Challenge — Adaptive Mission Control

Missions adapt through:
- **Skill Score Tracking**: Based on completion rate, speed, skips
- **Difficulty Ramping**: Auto-adjusts easy → medium → hard
- **Personalized Route Stops**: Selected from mission template pools
- **Guaranteed Mind-Blows**: Every mission has a "wow" moment

```typescript
import { generateAdaptiveMission, getSkillScore } from '@/lib/missionAdapter'

const mission = generateAdaptiveMission('black-hole-run', 'session')
const skill = getSkillScore() // 0-100 score
// Returns: mission with personalized stops based on skill + preferences
```

**Result**: "Mission: Black Hole Run (10 min)" stays recognizable but never identical.

---

### Level 5: Meaning — Debrief as Personal Artifact

Every session ends with:
- **Constellation Thumbnail**: Visual representation of path taken
- **3 Insights Discovered**: Templated from visited nodes
- **2 Next Jumps**: Graph-based recommendations
- **Daily Relic**: Optional auto-saved "today's discovery"

```typescript
import { generateDebriefCard, saveDailyRelic } from '@/lib/debriefCard'

const debrief = generateDebriefCard(visitedNodes, layoutNodes, allNodes, duration, signature, preferences)
const relic = saveDailyRelic(debrief) // Save as today's relic
// Returns: shareable debrief card with unique share code
```

**Result**: Every session produces a collectible identity object.

---

## The 3 Core Engines

### 1. Seed Engine (Deterministic Uniqueness)

Generates seeds based on mode:

```typescript
import { generateSeed, createPersonalizationContext } from '@/lib/personalization'

const ctx = createPersonalizationContext('cosmic') // or 'session', 'daily', 'share'
const seed = generateSeed(ctx)
```

**Modes**:
- `cosmic`: Fixed to user's cosmic signature (same always)
- `session`: Changes per session (use `performance.now`)
- `daily`: Changes daily (UTC-based, same for all users)
- `share`: Fixed from share link code (reproducible)

**Formula**: `seed = cosmicSeed XOR modeSalt XOR variant`

---

### 2. Preference Vector (Behavior Tracking)

Tracks lightweight signals:

```typescript
import { 
  recordCategoryInteraction, 
  recordDifficultyPreference,
  recordExplainLevel,
  recordMicroModuleLaunch
} from '@/lib/personalization'

// Track user behavior
recordCategoryInteraction('phenomena', 120) // category, dwellTime in seconds
recordDifficultyPreference('intermediate')
recordExplainLevel('college')
recordMicroModuleLaunch('micro-bigbang-simulation')
```

**Stored Data** (in `localStorage`):
```json
{
  "categoryWeights": { "phenomena": 0.4, "objects": 0.3, "concepts": 0.3 },
  "difficultyPreference": "intermediate",
  "averageDwellTime": 95,
  "depthPreference": 0.65,
  "explainLevelUsage": { "college": 12, "12": 3 },
  "microModuleLaunches": { "micro-bigbang": 2 }
}
```

---

### 3. Constraint Router (Bounded Variability)

Ensures quality while personalizing:

```typescript
import { selectWithConstraints } from '@/lib/personalization'

const constraints = {
  allowedPool: ['node1', 'node2', 'node3', 'node4', 'node5'],
  minDiversity: 3, // At least 3 different categories
  maxRepeats: 2, // Max 2 from same category
  guaranteedTypes: ['concept'], // Must include at least one
  excludeIds: ['node-exclude']
}

const selection = selectWithConstraints(items, 3, constraints, ctx)
// Returns: 3 items that satisfy all constraints + preference weighting
```

**Rules**:
- Only choose from allowed pools per epoch/mission
- Enforce diversity (don't repeat same category 3x)
- Guarantee a "mind-blow" stop per mission
- Weight by user preferences within constraints

---

## Share System (Reproducibility)

Share links encode the entire experience:

```typescript
import { 
  createTimelineShare,
  createConstellationShare,
  createMissionShare,
  createDebriefShare,
  loadSharedContent,
  createContextFromShare
} from '@/lib/shareSystem'

// Create share
const shareResult = createConstellationShare(visitedNodes, layoutData, duration, seed, userId)
// Returns: { shareCode, shortUrl, fullUrl, qrCodeUrl }

// Load shared content
const sharedData = loadSharedContent(shareCode)
const ctx = createContextFromShare(shareCode)
// Returns: PersonalizationContext that reproduces exact experience
```

**Share Codes**: Base36 encoded, 7 characters (e.g., `A3F9K2L`)

**Share URLs**:
- Timeline: `/share/timeline/{code}`
- Constellation: `/share/constellation/{code}`
- Mission: `/share/missions/{code}`
- Debrief: `/share/debrief/{code}`
- Short: `/s/{code}` (auto-redirects)

---

## Integration Guide

### 1. Initialize on App Mount

```typescript
// app/layout.tsx or root component
import { initUserProfile } from '@/lib/userProfile'
import { useEffect } from 'react'

export default function RootLayout() {
  useEffect(() => {
    // Initialize user profile + cosmic signature
    const profile = initUserProfile()
    console.log('Cosmic ID:', profile.cosmicSignature.userId.slice(0, 8))
  }, [])
  
  return <html>...</html>
}
```

### 2. Use Personalized Timeline

```typescript
// app/timeline/page.tsx
import { loadPersonalizedTimeline } from '@/lib/timelinePersonalizer'

export default function TimelinePage() {
  const timeline = loadPersonalizedTimeline('cosmic')
  
  return (
    <div>
      {timeline.epochs.map(epoch => (
        <EpochCard 
          key={epoch.id}
          epoch={epoch}
          featuredNodes={epoch.featuredNodes} // ← Personalized!
        />
      ))}
    </div>
  )
}
```

### 3. Use Personalized Graph

```typescript
// app/constellation/page.tsx
import { generatePersonalizedLayout } from '@/lib/space/graph/graphPersonalizer'

export default function ConstellationPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  
  const layout = generatePersonalizedLayout(nodes, edges, 'cosmic', {
    width: 1200,
    height: 800
  })
  
  return (
    <GraphCanvas 
      layoutNodes={layout.nodes} // ← Personalized positions!
      emphasisWeights={layout.emphasisWeights}
      suggestedNodes={layout.suggestedNodes}
    />
  )
}
```

### 4. Use Adaptive Missions

```typescript
// app/missions/page.tsx
import { generateAdaptiveMission, getAvailableMissions } from '@/lib/missionAdapter'

export default function MissionsPage() {
  const missions = getAvailableMissions() // Sorted by recommended difficulty
  
  const handleStart = (templateId: string) => {
    const mission = generateAdaptiveMission(templateId, 'session')
    // mission.stops are personalized based on skill + preferences
    startMission(mission)
  }
  
  return <MissionList missions={missions} onStart={handleStart} />
}
```

### 5. Generate Debrief Card

```typescript
// At end of exploration session
import { generateDebriefCard, saveDebriefCard } from '@/lib/debriefCard'
import { getUserProfile } from '@/lib/userProfile'

function endSession(visitedNodes, layoutNodes, allNodes, duration) {
  const profile = getUserProfile()
  
  const debrief = generateDebriefCard(
    visitedNodes,
    layoutNodes,
    allNodes,
    duration,
    profile.cosmicSignature,
    profile.preferences
  )
  
  saveDebriefCard(debrief)
  
  // Show debrief to user
  showDebriefModal(debrief)
}
```

### 6. Track User Behavior

```typescript
// Track page visits
import { trackPageVisit, trackCategory, trackMicroModule } from '@/lib/userProfile'

function onPageEnter(pageId, title, url, category, icon) {
  trackPageVisit(pageId, title, url, category, icon, 0)
}

function onPageExit(dwellTime) {
  trackCategory(currentCategory, dwellTime)
}

function onMicroModuleLaunch(moduleId) {
  trackMicroModule(moduleId)
}
```

---

## File Structure

```
lib/
├── personalization.ts          # Core: Seed engine, preference vector, constraint router
├── userProfile.ts              # Unified user profile system
├── timelinePersonalizer.ts     # Timeline personalization
├── missionAdapter.ts           # Adaptive mission control
├── debriefCard.ts             # Debrief card generation
├── shareSystem.ts             # Share link creation/loading
├── space/
│   └── graph/
│       ├── graphPersonalizer.ts    # Graph layout personalization
│       ├── constellation.types.ts  # Type definitions
│       └── constellationEngine.ts  # Session recording
├── seed.ts                    # PRNG utilities (already existed)
├── storage.ts                 # localStorage helpers (already existed)
└── explorerProfile.ts         # Explorer journey tracking (already existed)
```

---

## Data Flow

```
┌─────────────────────┐
│   First Visit       │
│  Generate Cosmic    │
│    Signature        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Load Timeline/     │
│  Graph/Mission      │
│  with Personalized  │
│     Context         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  User Explores      │
│  Track Behavior:    │
│  - Category visits  │
│  - Dwell time       │
│  - Difficulty       │
│  - Micro-modules    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Update Preference  │
│      Vector         │
│  (in localStorage)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  End Session:       │
│  Generate Debrief   │
│  Create Share Link  │
└─────────────────────┘
```

---

## localStorage Keys

| Key | Purpose |
|-----|---------|
| `halfspace_cosmic_signature` | User's cosmic identity + visual tone |
| `halfspace_preference_vector` | Behavioral preferences |
| `halfspace_explorer_profile` | Journey tracking (visits, bookmarks) |
| `halfspace_skill_score` | Mission skill score |
| `halfspace_mission_history` | Completed missions |
| `halfspace_debrief_history` | Past debrief cards |
| `halfspace_daily_relics` | Daily saved discoveries |
| `halfspace_share_cache` | Cached share links |

---

## Performance Notes

- **No API calls required**: All personalization runs client-side
- **Minimal storage**: ~50KB average per user (localStorage)
- **Fast seed generation**: <1ms using Mulberry32 PRNG
- **Lazy loading**: Only personalize when needed
- **SSR-safe**: All localStorage access is wrapped with safety checks

---

## Testing Personalization

### Test Different Seeds

```typescript
// Force specific modes
loadPersonalizedTimeline('cosmic')   // Same every time for this user
loadPersonalizedTimeline('session')  // Different per session
loadPersonalizedTimeline('daily')    // Changes daily
loadPersonalizedTimeline('share', { shareCode: 'A3F9K2L' }) // Exact reproduction
```

### Reset User Identity

```typescript
import { resetCosmicSignature } from '@/lib/personalization'
import { resetProfile } from '@/lib/explorerProfile'

resetCosmicSignature() // New cosmic identity
resetProfile() // Clear history
```

### View Current State

```typescript
import { exportPersonalizationState } from '@/lib/personalization'
import { getProfileSummary } from '@/lib/userProfile'

const state = exportPersonalizationState()
console.log('Cosmic Seed:', state.signature.cosmicSeed)
console.log('Share Code:', state.shareCode)

const summary = getProfileSummary()
console.log('Explorer Level:', summary.explorerLevel)
console.log('Favorite Category:', summary.favoriteCategory)
```

---

## Future Enhancements

1. **Backend Sync** (optional): Sync profile across devices
2. **Social Features**: View friends' constellations
3. **Leaderboards**: Mission completion times
4. **Collections**: Curated sets of discoveries
5. **Challenges**: Time-limited missions
6. **Achievements**: Extended achievement system
7. **Export/Import**: Profile backup/transfer

---

## Key Design Principles

1. ✅ **Deterministic**: Same seed = same experience (shareable)
2. ✅ **Bounded**: All randomness is constrained to quality pools
3. ✅ **Lightweight**: No heavy computation, no API calls
4. ✅ **Privacy-first**: All data stays in localStorage
5. ✅ **Progressive**: Works without account, enhances with usage
6. ✅ **Unique**: Every user feels different immediately
7. ✅ **Reproducible**: Share links recreate exact experience

---

## Questions?

- Check types in `lib/personalization.ts`
- Read inline comments in each file
- Test with different seed modes
- Inspect localStorage to see data structure

**The site is now software—a personal discovery machine, not a content site.** 🚀
