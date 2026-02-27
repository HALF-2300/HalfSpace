# Uniqueness Engine - Implementation Checklist

Use this checklist to integrate the Uniqueness Engine into your Space app.

---

## ✅ Phase 1: Core Setup (30 minutes)

### Files Created (Already Done)
- [x] `lib/personalization.ts` - Core engine
- [x] `lib/userProfile.ts` - Identity system
- [x] `lib/timelinePersonalizer.ts` - Timeline personalization
- [x] `lib/space/graph/graphPersonalizer.ts` - Graph personalization
- [x] `lib/missionAdapter.ts` - Adaptive missions
- [x] `lib/debriefCard.ts` - Debrief cards
- [x] `lib/shareSystem.ts` - Share links
- [x] `UNIQUENESS-ENGINE.md` - Documentation
- [x] `UNIQUENESS-INTEGRATION-EXAMPLE.tsx` - Examples
- [x] `UNIQUENESS-ENGINE-SUMMARY.md` - Summary
- [x] `UNIQUENESS-ENGINE-ARCHITECTURE.md` - Architecture

### Verify Installation
```bash
# Check that all files exist
ls lib/personalization.ts
ls lib/userProfile.ts
ls lib/timelinePersonalizer.ts
ls lib/space/graph/graphPersonalizer.ts
ls lib/missionAdapter.ts
ls lib/debriefCard.ts
ls lib/shareSystem.ts
```

---

## ✅ Phase 2: Root Integration (15 minutes)

### Step 1: Update Root Layout

```tsx
// app/layout.tsx
'use client'

import { useEffect } from 'react'
import { initUserProfile } from '@/lib/userProfile'

export default function RootLayout({ children }) {
  useEffect(() => {
    // Initialize on mount
    const profile = initUserProfile()
    
    console.log('👤 Cosmic ID:', profile.cosmicSignature.userId.slice(0, 8))
    console.log('🎨 Visual Tone:', profile.cosmicSignature.visualTone)
    
    // Optional: Apply visual tone to CSS
    const tone = profile.cosmicSignature.visualTone
    document.documentElement.style.setProperty('--nebula-density', `${tone.nebulaDensity}`)
    document.documentElement.style.setProperty('--starfield-drift', `${tone.starfieldDrift}`)
    document.documentElement.style.setProperty('--glow-strength', `${tone.glowStrength}`)
    document.documentElement.style.setProperty('--dominant-hue', `${tone.dominantHue}`)
    document.documentElement.style.setProperty('--secondary-hue', `${tone.secondaryHue}`)
  }, [])
  
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

**Test**:
- [ ] Open browser console
- [ ] See "👤 Cosmic ID: XXXXXXXX"
- [ ] Check localStorage for `halfspace_cosmic_signature`

---

## ✅ Phase 3: Timeline Integration (20 minutes)

### Step 2: Update Timeline Page

Find your existing timeline page and replace the data loading:

```tsx
// Before:
import timelineData from '@/data/timeline.json'
const epochs = timelineData.epochs

// After:
import { loadPersonalizedTimeline } from '@/lib/timelinePersonalizer'
const timeline = loadPersonalizedTimeline('cosmic')
const epochs = timeline.epochs
```

**Full example**:
```tsx
// app/timeline/page.tsx (or wherever timeline is)
'use client'

import { useState, useEffect } from 'react'
import { loadPersonalizedTimeline } from '@/lib/timelinePersonalizer'
import { trackPageVisit } from '@/lib/userProfile'

export default function TimelinePage() {
  const [timeline, setTimeline] = useState<any>(null)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    // Track visit
    trackPageVisit('timeline-page', 'Cosmic Timeline', '/timeline', 'timeline', '🌌', 0)
    
    // Load personalized timeline
    const personalizedTimeline = loadPersonalizedTimeline('cosmic')
    setTimeline(personalizedTimeline)
    
    return () => {
      // Track time on exit
      const dwellTime = Math.floor((Date.now() - startTime) / 1000)
      console.log('Time on timeline:', dwellTime, 'seconds')
    }
  }, [])

  if (!timeline) return <div>Loading...</div>

  return (
    <div>
      <h1>{timeline.metadata.title}</h1>
      {timeline.epochs.map(epoch => (
        <div key={epoch.id}>
          <h2>{epoch.title}</h2>
          <p>{epoch.hook}</p>
          <div>
            <strong>Featured Nodes (personalized):</strong>
            <ul>
              {epoch.featuredNodes.map(nodeId => (
                <li key={nodeId}>{nodeId}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
```

**Test**:
- [ ] Refresh page multiple times (should see same nodes)
- [ ] Clear localStorage and refresh (should see different nodes)
- [ ] Check console for tracking messages

---

## ✅ Phase 4: Graph Integration (30 minutes)

### Step 3: Update Graph/Constellation Page

```tsx
// app/constellation/page.tsx (or space/graph/page.tsx)
'use client'

import { useState, useEffect } from 'react'
import { generatePersonalizedLayout } from '@/lib/space/graph/graphPersonalizer'
import type { GraphNode, GraphEdge } from '@/lib/space/graph/constellation.types'

export default function GraphPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [layout, setLayout] = useState<any>(null)

  useEffect(() => {
    // Load your graph data
    // const loadedNodes = ... (from your data source)
    // const loadedEdges = ... (from your data source)
    
    // For now, test with dummy data
    const dummyNodes: GraphNode[] = [
      { id: 'node1', category: 'concept', title: 'Black Holes', tags: [], difficulty: 'medium', connections: ['node2'] },
      { id: 'node2', category: 'phenomena', title: 'Gravity', tags: [], difficulty: 'easy', connections: ['node1'] },
      // ... add more nodes
    ]
    
    const dummyEdges: GraphEdge[] = [
      { id: 'edge1', source: 'node1', target: 'node2', relation: 'explains' }
    ]
    
    setNodes(dummyNodes)
    setEdges(dummyEdges)
    
    // Generate personalized layout
    const personalizedLayout = generatePersonalizedLayout(
      dummyNodes,
      dummyEdges,
      'cosmic',
      { width: 1200, height: 800 }
    )
    
    setLayout(personalizedLayout)
    
    console.log('📍 Layout nodes:', personalizedLayout.nodes.length)
    console.log('✨ Suggested nodes:', personalizedLayout.suggestedNodes)
  }, [])

  if (!layout) return <div>Generating your constellation...</div>

  return (
    <div>
      <h1>Your Personal Constellation</h1>
      <div>Suggested for you: {layout.suggestedNodes.join(', ')}</div>
      
      <svg width="1200" height="800" style={{ border: '1px solid #333' }}>
        {/* Render nodes */}
        {layout.nodes.map(node => {
          const size = 10 * (0.7 + (layout.emphasisWeights.get(node.id) || 0.5) * 0.6)
          return (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={size}
              fill="#8B5CF6"
              opacity={0.5 + (layout.emphasisWeights.get(node.id) || 0.5) * 0.5}
            />
          )
        })}
      </svg>
    </div>
  )
}
```

**Test**:
- [ ] See nodes positioned on canvas
- [ ] Check console for suggested nodes
- [ ] Verify different sizes based on emphasis

---

## ✅ Phase 5: Missions Integration (20 minutes)

### Step 4: Create/Update Missions Page

```tsx
// app/missions/page.tsx
'use client'

import { useState } from 'react'
import { generateAdaptiveMission, getAvailableMissions, getSkillScore } from '@/lib/missionAdapter'

export default function MissionsPage() {
  const [missions] = useState(getAvailableMissions())
  const [activeMission, setActiveMission] = useState<any>(null)
  const skill = getSkillScore()

  const handleStart = (templateId: string) => {
    const mission = generateAdaptiveMission(templateId, 'session')
    console.log('🚀 Mission generated:', mission)
    setActiveMission(mission)
  }

  if (activeMission) {
    return (
      <div>
        <h1>{activeMission.name}</h1>
        <p>{activeMission.description}</p>
        <div>Difficulty: {activeMission.adaptedDifficulty}</div>
        <div>Stops: {activeMission.stops.length}</div>
        <div>Duration: ~{activeMission.estimatedDuration}min</div>
        
        <h2>Mission Stops:</h2>
        <ol>
          {activeMission.stops.map((stop, i) => (
            <li key={i}>
              {stop.title} {stop.isMindBlow && '🤯'}
            </li>
          ))}
        </ol>
        
        <button onClick={() => setActiveMission(null)}>Close</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Space Missions</h1>
      <div>Your Skill Level: {Math.round(skill.overall)}/100</div>
      
      {missions.map(mission => (
        <div key={mission.id} style={{ border: '1px solid #333', padding: '1rem', margin: '1rem 0' }}>
          <h2>{mission.name}</h2>
          <p>{mission.description}</p>
          <div>Difficulty: {mission.difficulty}</div>
          <div>Duration: ~{mission.estimatedDuration}min</div>
          <button onClick={() => handleStart(mission.id)}>Start Mission</button>
        </div>
      ))}
    </div>
  )
}
```

**Test**:
- [ ] Click "Start Mission"
- [ ] See personalized stops
- [ ] Verify mind-blow stop is included
- [ ] Try different missions

---

## ✅ Phase 6: Tracking Integration (15 minutes)

### Step 5: Add Tracking to Existing Pages

Add to any content page:

```tsx
// Example: app/planets/mars/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { trackPageVisit, trackCategory } from '@/lib/userProfile'

export default function MarsPage() {
  const [startTime] = useState(Date.now())

  useEffect(() => {
    // Track page visit
    trackPageVisit(
      'planet-mars',
      'Mars - The Red Planet',
      '/planets/mars',
      'objects',
      '♂️',
      0
    )

    // Track on exit
    return () => {
      const dwellTime = Math.floor((Date.now() - startTime) / 1000)
      trackCategory('objects', dwellTime)
      console.log('📊 Tracked visit to Mars:', dwellTime, 'seconds')
    }
  }, [])

  return <div>Mars content...</div>
}
```

**Test**:
- [ ] Visit page for 10+ seconds
- [ ] Navigate away
- [ ] Check localStorage `halfspace_preference_vector`
- [ ] Verify `categoryWeights.objects` increased

---

## ✅ Phase 7: Debrief System (30 minutes)

### Step 6: Add End Session Button

```tsx
// In your graph/constellation page
import { generateDebriefCard, saveDebriefCard } from '@/lib/debriefCard'
import { getUserProfile } from '@/lib/userProfile'

function YourGraphComponent() {
  const [visitedNodes, setVisitedNodes] = useState<string[]>([])
  const [showDebrief, setShowDebrief] = useState(false)
  const [debrief, setDebrief] = useState<any>(null)
  const [sessionStart] = useState(Date.now())

  const handleEndSession = () => {
    const profile = getUserProfile()
    const duration = Math.floor((Date.now() - sessionStart) / 1000)
    
    // Generate debrief
    const debriefCard = generateDebriefCard(
      visitedNodes,
      layoutNodes, // from your graph layout
      allNodes,    // all available nodes
      duration,
      profile.cosmicSignature,
      profile.preferences
    )
    
    saveDebriefCard(debriefCard)
    setDebrief(debriefCard)
    setShowDebrief(true)
    
    console.log('📋 Debrief generated:', debriefCard)
  }

  if (showDebrief && debrief) {
    return (
      <div style={{ padding: '2rem', background: '#111', color: '#fff' }}>
        <h1>Exploration Complete! 🎉</h1>
        
        <div>
          <h2>Stats</h2>
          <p>Nodes: {debrief.nodesVisited}</p>
          <p>Duration: {Math.floor(debrief.duration / 60)}m {debrief.duration % 60}s</p>
        </div>

        <div>
          <h2>What You Discovered</h2>
          {debrief.insights.map((insight, i) => (
            <div key={i}>
              <h3>{insight.title}</h3>
              <p>{insight.description}</p>
            </div>
          ))}
        </div>

        <div>
          <h2>Next Jumps</h2>
          {debrief.nextJumps.map((jump, i) => (
            <div key={i}>
              <strong>{jump.title}</strong>
              <p>{jump.reason}</p>
            </div>
          ))}
        </div>

        <div>
          <h2>Share</h2>
          <p>Share URL: {debrief.shareUrl}</p>
          <button onClick={() => navigator.clipboard.writeText(debrief.shareUrl)}>
            Copy Link
          </button>
        </div>

        <button onClick={() => setShowDebrief(false)}>Close</button>
      </div>
    )
  }

  return (
    <div>
      {/* Your graph UI */}
      <button onClick={handleEndSession}>End Session & Get Debrief</button>
    </div>
  )
}
```

**Test**:
- [ ] Click "End Session"
- [ ] See debrief modal with insights
- [ ] Copy share link
- [ ] Check localStorage for saved debrief

---

## ✅ Phase 8: Share Pages (45 minutes)

### Step 7: Create Share Route

```tsx
// app/share/constellation/[code]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { loadSharedContent, createContextFromShare } from '@/lib/shareSystem'
import { generatePersonalizedLayout } from '@/lib/space/graph/graphPersonalizer'

export default function SharedConstellationPage({ params }: { params: { code: string } }) {
  const [shareData, setShareData] = useState<any>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const data = loadSharedContent(params.code)
    
    if (!data) {
      setError(true)
      return
    }
    
    setShareData(data)
    console.log('📨 Loaded shared content:', data)
  }, [params.code])

  if (error) {
    return (
      <div>
        <h1>Share Not Found</h1>
        <p>Code: {params.code}</p>
      </div>
    )
  }

  if (!shareData) {
    return <div>Loading shared experience...</div>
  }

  return (
    <div>
      <h1>{shareData.metadata.title}</h1>
      <p>Shared by Explorer {shareData.metadata.creatorId}</p>
      <p>Share Code: {params.code}</p>
      
      {/* Render the shared content */}
      {shareData.type === 'constellation' && (
        <div>
          <p>Nodes visited: {shareData.content.visitedNodes.length}</p>
          <p>Duration: {Math.floor(shareData.content.sessionDuration / 60)}m</p>
          {/* Render graph with same seed */}
        </div>
      )}
    </div>
  )
}
```

**Test**:
- [ ] Create a share link from debrief
- [ ] Visit `/share/constellation/[code]`
- [ ] Verify content loads
- [ ] Try invalid code (should show error)

---

## ✅ Phase 9: Profile Page (Optional, 30 minutes)

### Step 8: Create Profile Page

```tsx
// app/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { getProfileSummary, getFavoriteCategories, getExplorationStyle } from '@/lib/userProfile'
import { getCosmicSignature } from '@/lib/personalization'
import { getMissionStats } from '@/lib/missionAdapter'
import { getDebriefHistory, getAllDailyRelics } from '@/lib/debriefCard'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const signature = getCosmicSignature()
    const summary = getProfileSummary()
    const favorites = getFavoriteCategories()
    const style = getExplorationStyle()
    const missionStats = getMissionStats()
    const debriefs = getDebriefHistory()
    const relics = getAllDailyRelics()

    setProfile({
      signature,
      summary,
      favorites,
      style,
      missionStats,
      debriefs,
      relics
    })
  }, [])

  if (!profile) return <div>Loading profile...</div>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Explorer Profile</h1>
      
      <div>
        <h2>Cosmic Identity</h2>
        <p>Cosmic ID: {profile.summary.cosmicId}</p>
        <p>Level: {profile.summary.explorerLevel}</p>
        <p>Pages Explored: {profile.summary.pagesExplored}</p>
        <p>Time Explored: {profile.summary.timeExplored}</p>
        <p>Favorite Category: {profile.summary.favoriteCategory}</p>
        <p>Exploration Style: {profile.style}</p>
      </div>

      <div>
        <h2>Visual Tone</h2>
        <p>Nebula Density: {profile.signature.visualTone.nebulaDensity.toFixed(2)}</p>
        <p>Glow Strength: {profile.signature.visualTone.glowStrength.toFixed(2)}</p>
        <p>Dominant Hue: {profile.signature.visualTone.dominantHue}°</p>
      </div>

      <div>
        <h2>Mission Stats</h2>
        <p>Missions Completed: {profile.missionStats.totalCompleted}</p>
        <p>Average Score: {Math.round(profile.missionStats.averageScore)}/100</p>
        <p>Favorite Difficulty: {profile.missionStats.favoriteDifficulty}</p>
      </div>

      <div>
        <h2>Recent Debriefs</h2>
        {profile.debriefs.slice(0, 5).map((debrief: any) => (
          <div key={debrief.id}>
            <p>{debrief.nodesVisited} nodes in {Math.floor(debrief.duration / 60)}m</p>
            <a href={debrief.shareUrl}>Share</a>
          </div>
        ))}
      </div>

      <div>
        <h2>Daily Relics</h2>
        {profile.relics.slice(0, 7).map((relic: any) => (
          <div key={relic.date}>
            <p>{relic.badge} {relic.date}</p>
            {relic.achievement && <p>Achievement: {relic.achievement}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Test**:
- [ ] Visit `/profile`
- [ ] See all stats
- [ ] Verify mission stats update after completing a mission

---

## ✅ Phase 10: Testing & Verification (30 minutes)

### Final Checks

#### Test 1: Determinism
```bash
# Browser Console
localStorage.clear()
location.reload()
# Note first 3 timeline nodes

localStorage.clear()
location.reload()
# Should see DIFFERENT 3 nodes (new cosmic seed)

# But visiting same page again should show SAME 3 nodes
```
- [ ] Same seed = same content

#### Test 2: Preference Learning
```bash
# Visit 5 pages in "phenomena" category
# Check localStorage
localStorage.getItem('halfspace_preference_vector')
# Should see phenomena weight increase
```
- [ ] Category weights update

#### Test 3: Share Links
```bash
# Generate debrief card
# Copy share link
# Open in incognito window
# Should see identical constellation
```
- [ ] Share links reproduce experience

#### Test 4: Skill Adaptation
```bash
# Complete 3 easy missions quickly
# Check skill score
localStorage.getItem('halfspace_skill_score')
# Should see score increase

# Start new mission
# Should offer higher difficulty
```
- [ ] Missions adapt to skill

#### Test 5: Daily Relics
```bash
# Complete session
# Save as daily relic
# Check localStorage
localStorage.getItem('halfspace_daily_relics')
# Should see today's date
```
- [ ] Daily relics save correctly

---

## 🎉 Completion Checklist

- [ ] Root layout initializes profile
- [ ] Timeline shows personalized nodes
- [ ] Graph has personalized layout
- [ ] Missions adapt to skill
- [ ] Tracking updates preferences
- [ ] Debrief cards generate
- [ ] Share links work
- [ ] Profile page displays data
- [ ] All tests pass

---

## 📊 Success Metrics

After integration, you should see:

1. **localStorage Usage**: ~50KB per user
2. **First Visit**: <100ms to generate identity
3. **Timeline Load**: <10ms personalization
4. **Graph Layout**: <200ms for 100 nodes
5. **Mission Generation**: <5ms
6. **Debrief Generation**: <10ms
7. **Share Link Creation**: <5ms

Check browser DevTools → Application → Local Storage to verify data is being saved.

---

## 🐛 Troubleshooting

### Issue: "localStorage is not defined"
**Fix**: Make sure components are client-side (`'use client'`)

### Issue: "Same nodes every time (even after clearing)"
**Check**: Seed mode - use 'session' or 'daily' for variety

### Issue: "Share link shows 'not found'"
**Check**: Share data only cached locally - need backend for cross-device

### Issue: "Preferences not updating"
**Check**: Are you calling `trackCategory()` on page exit?

### Issue: "Graph layout looks weird"
**Check**: Make sure width/height are reasonable (e.g., 1200x800)

---

## 📚 Reference

- Full docs: `UNIQUENESS-ENGINE.md`
- Examples: `UNIQUENESS-INTEGRATION-EXAMPLE.tsx`
- Architecture: `UNIQUENESS-ENGINE-ARCHITECTURE.md`
- Summary: `UNIQUENESS-ENGINE-SUMMARY.md`

---

**Estimated Total Time**: 4-5 hours for complete integration

**Next Steps**: Start with Phase 1-2, test thoroughly, then proceed to Phase 3-4.

Good luck! 🚀
