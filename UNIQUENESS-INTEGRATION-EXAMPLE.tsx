/**
 * INTEGRATION EXAMPLE
 * How to integrate the Uniqueness Engine into your Space app
 */

'use client'

import { useEffect, useState } from 'react'

// ============================================================================
// EXAMPLE 1: Timeline Page with Personalization
// ============================================================================

import { loadPersonalizedTimeline, type TimelineEpoch } from '@/lib/timelinePersonalizer'
import { trackPageVisit, trackCategory } from '@/lib/userProfile'

export function PersonalizedTimelinePage() {
  const [timeline, setTimeline] = useState<TimelineEpoch[]>([])
  const [loading, setLoading] = useState(true)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    // Track page visit
    trackPageVisit(
      'timeline-page',
      'Cosmic Timeline',
      '/timeline',
      'timeline',
      '🌌',
      0
    )

    // Load personalized timeline (cosmic mode = consistent per user)
    const personalizedTimeline = loadPersonalizedTimeline('cosmic')
    setTimeline(personalizedTimeline.epochs)
    setLoading(false)

    // Track time on page when leaving
    return () => {
      const dwellTime = Math.floor((Date.now() - startTime) / 1000)
      trackCategory('timeline', dwellTime)
    }
  }, [])

  if (loading) return <div>Loading your cosmic timeline...</div>

  return (
    <div className="timeline-container">
      <h1>Your Cosmic Timeline</h1>
      {timeline.map((epoch, index) => (
        <EpochCard
          key={epoch.id}
          epoch={epoch}
          index={index}
          // These featured nodes are personalized to this user!
          featuredNodes={epoch.featuredNodes}
        />
      ))}
    </div>
  )
}

function EpochCard({ epoch, index, featuredNodes }: any) {
  return (
    <div 
      className="epoch-card"
      style={{
        background: epoch.backgroundPreset.primaryColor,
        opacity: epoch.backgroundPreset.density
      }}
    >
      <h2>{epoch.title}</h2>
      <p>{epoch.timeRangeLabel}</p>
      <p>{epoch.hook}</p>
      
      <div className="featured-nodes">
        <h3>Explore:</h3>
        {featuredNodes.map((nodeId: string) => (
          <NodeLink key={nodeId} nodeId={nodeId} />
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// EXAMPLE 2: Missions Page with Adaptive Difficulty
// ============================================================================

import { 
  generateAdaptiveMission, 
  getAvailableMissions,
  recordMissionCompletion,
  getSkillScore,
  type AdaptiveMission 
} from '@/lib/missionAdapter'

export function AdaptiveMissionsPage() {
  const [missions, setMissions] = useState(getAvailableMissions())
  const [activeMission, setActiveMission] = useState<AdaptiveMission | null>(null)
  const [currentStop, setCurrentStop] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [skipped, setSkipped] = useState(0)
  const skill = getSkillScore()

  const handleStartMission = (templateId: string) => {
    // Generate personalized mission (session mode = different each time)
    const mission = generateAdaptiveMission(templateId, 'session')
    if (!mission) return

    setActiveMission(mission)
    setCurrentStop(0)
    setStartTime(Date.now())
    setSkipped(0)
  }

  const handleCompleteStop = () => {
    if (!activeMission) return
    
    if (currentStop < activeMission.stops.length - 1) {
      setCurrentStop(currentStop + 1)
    } else {
      // Mission complete!
      handleCompleteMission()
    }
  }

  const handleSkipStop = () => {
    setSkipped(skipped + 1)
    handleCompleteStop()
  }

  const handleCompleteMission = () => {
    if (!activeMission) return

    const duration = Math.floor((Date.now() - startTime) / 1000)
    const avgTimePerStop = duration / activeMission.stops.length

    // Record completion (updates skill score automatically)
    recordMissionCompletion({
      missionId: `mission-${Date.now()}`,
      templateId: activeMission.templateId,
      completedAt: new Date().toISOString(),
      duration,
      stopsCompleted: activeMission.stops.length - skipped,
      totalStops: activeMission.stops.length,
      skipped,
      averageTimePerStop,
      difficulty: activeMission.adaptedDifficulty
    })

    setActiveMission(null)
  }

  if (activeMission) {
    const currentStopData = activeMission.stops[currentStop]
    
    return (
      <div className="mission-active">
        <h2>{activeMission.name}</h2>
        <div className="mission-progress">
          {currentStop + 1} / {activeMission.stops.length}
        </div>
        
        <div className="stop-content">
          <h3>{currentStopData.title}</h3>
          <p>{currentStopData.description}</p>
          {currentStopData.isMindBlow && <span className="mind-blow">🤯 Mind-Blow!</span>}
        </div>

        <div className="stop-actions">
          <button onClick={handleCompleteStop}>Complete</button>
          <button onClick={handleSkipStop}>Skip</button>
        </div>
      </div>
    )
  }

  return (
    <div className="missions-list">
      <div className="skill-banner">
        Your Skill Level: {Math.round(skill.overall)}/100
        <span className="recommended">Recommended: {getRecommendedDifficulty()}</span>
      </div>

      <h1>Space Missions</h1>
      {missions.map(mission => (
        <div key={mission.id} className="mission-card">
          <h3>{mission.name}</h3>
          <p>{mission.description}</p>
          <div className="mission-meta">
            <span className={`difficulty ${mission.difficulty}`}>{mission.difficulty}</span>
            <span className="duration">~{mission.estimatedDuration} min</span>
          </div>
          <button onClick={() => handleStartMission(mission.id)}>
            Start Mission
          </button>
        </div>
      ))}
    </div>
  )
}

function getRecommendedDifficulty() {
  const score = getSkillScore()
  if (score.overall < 40) return 'Easy'
  if (score.overall < 70) return 'Medium'
  return 'Hard'
}

// ============================================================================
// EXAMPLE 3: Constellation Graph with Debrief
// ============================================================================

import { generatePersonalizedLayout, generateConstellationLines } from '@/lib/space/graph/graphPersonalizer'
import { generateDebriefCard, saveDebriefCard } from '@/lib/debriefCard'
import { createConstellationShare } from '@/lib/shareSystem'
import { getUserProfile } from '@/lib/userProfile'
import type { GraphNode, GraphEdge, LayoutNode } from '@/lib/space/graph/constellation.types'

export function PersonalizedConstellationPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [visitedNodes, setVisitedNodes] = useState<string[]>([])
  const [sessionStart] = useState(Date.now())
  const [showDebrief, setShowDebrief] = useState(false)
  const [debriefCard, setDebriefCard] = useState<any>(null)

  // Generate personalized layout
  const layout = generatePersonalizedLayout(nodes, edges, 'cosmic', {
    width: 1200,
    height: 800
  })

  // Generate constellation lines from user's path
  const constellationLines = generateConstellationLines(visitedNodes, layout.nodes)

  const handleNodeClick = (nodeId: string) => {
    if (!visitedNodes.includes(nodeId)) {
      setVisitedNodes([...visitedNodes, nodeId])
    }
  }

  const handleEndSession = () => {
    const duration = Math.floor((Date.now() - sessionStart) / 1000)
    const profile = getUserProfile()

    // Generate debrief card
    const debrief = generateDebriefCard(
      visitedNodes,
      layout.nodes,
      nodes,
      duration,
      profile.cosmicSignature,
      profile.preferences
    )

    saveDebriefCard(debrief)
    setDebriefCard(debrief)
    setShowDebrief(true)
  }

  const handleShareConstellation = () => {
    if (!debriefCard) return

    const layoutData = JSON.stringify(layout.nodes.map(n => ({ id: n.id, x: n.x, y: n.y })))
    const profile = getUserProfile()
    
    const shareResult = createConstellationShare(
      visitedNodes,
      layoutData,
      Math.floor((Date.now() - sessionStart) / 1000),
      profile.cosmicSignature.cosmicSeed,
      profile.cosmicSignature.userId.slice(0, 8),
      'My Space Exploration'
    )

    // Copy to clipboard
    navigator.clipboard.writeText(shareResult.shortUrl)
    alert(`Share link copied: ${shareResult.shortUrl}`)
  }

  if (showDebrief && debriefCard) {
    return (
      <div className="debrief-modal">
        <h2>Exploration Complete!</h2>
        
        <div className="debrief-stats">
          <div>Nodes Explored: {debriefCard.nodesVisited}</div>
          <div>Duration: {Math.floor(debriefCard.duration / 60)}m {debriefCard.duration % 60}s</div>
        </div>

        <div className="constellation-thumbnail">
          {/* Render mini constellation */}
          <svg width="200" height="200" viewBox="0 0 100 100">
            {debriefCard.constellationData.lines.map((line: any, i: number) => (
              <line
                key={i}
                x1={line.from.x}
                y1={line.from.y}
                x2={line.to.x}
                y2={line.to.y}
                stroke={debriefCard.constellationData.dominantColor}
                strokeWidth="0.5"
              />
            ))}
            {debriefCard.constellationData.nodes.map((node: any, i: number) => (
              <circle
                key={i}
                cx={node.x}
                cy={node.y}
                r="2"
                fill={debriefCard.constellationData.dominantColor}
              />
            ))}
          </svg>
        </div>

        <div className="insights">
          <h3>What You Discovered:</h3>
          {debriefCard.insights.map((insight: any, i: number) => (
            <div key={i} className="insight">
              <h4>{insight.title}</h4>
              <p>{insight.description}</p>
            </div>
          ))}
        </div>

        <div className="next-jumps">
          <h3>Next Jumps:</h3>
          {debriefCard.nextJumps.map((jump: any, i: number) => (
            <div key={i} className="next-jump">
              <strong>{jump.title}</strong>
              <span>{jump.reason}</span>
            </div>
          ))}
        </div>

        <div className="debrief-actions">
          <button onClick={handleShareConstellation}>Share My Constellation</button>
          <button onClick={() => setShowDebrief(false)}>Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="constellation-view">
      <div className="graph-canvas">
        {/* Render graph with personalized layout */}
        <svg width="1200" height="800">
          {/* Edges */}
          {edges.map((edge) => {
            const source = layout.nodes.find(n => n.id === edge.source)
            const target = layout.nodes.find(n => n.id === edge.target)
            if (!source || !target) return null

            return (
              <line
                key={edge.id}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="#444"
                strokeWidth="1"
              />
            )
          })}

          {/* Constellation lines (user's path) */}
          {constellationLines.map((line, i) => {
            const from = layout.nodes.find(n => n.id === line.from)
            const to = layout.nodes.find(n => n.id === line.to)
            if (!from || !to) return null

            return (
              <line
                key={`constellation-${i}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#FFD700"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )
          })}

          {/* Nodes */}
          {layout.nodes.map((node) => {
            const emphasis = layout.emphasisWeights.get(node.id) || 0.5
            const size = 10 * (0.7 + emphasis * 0.6)
            const opacity = 0.5 + emphasis * 0.5
            const isVisited = visitedNodes.includes(node.id)
            const isSuggested = layout.suggestedNodes.includes(node.id)

            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={size}
                  fill={isVisited ? '#FFD700' : isSuggested ? '#00FF00' : '#8B5CF6'}
                  opacity={opacity}
                  onClick={() => handleNodeClick(node.id)}
                  style={{ cursor: 'pointer' }}
                />
                {isSuggested && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size + 3}
                    fill="none"
                    stroke="#00FF00"
                    strokeWidth="2"
                  />
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="session-controls">
        <div>Nodes Visited: {visitedNodes.length}</div>
        <div>Duration: {Math.floor((Date.now() - sessionStart) / 60000)}m</div>
        <button onClick={handleEndSession}>End Session & Get Debrief</button>
      </div>

      <div className="suggested-nodes">
        <h3>Suggested for You:</h3>
        {layout.suggestedNodes.map(nodeId => {
          const node = nodes.find(n => n.id === nodeId)
          return node ? (
            <button key={nodeId} onClick={() => handleNodeClick(nodeId)}>
              {node.title}
            </button>
          ) : null
        })}
      </div>
    </div>
  )
}

// ============================================================================
// EXAMPLE 4: Root Layout - Initialize Profile
// ============================================================================

import { initUserProfile } from '@/lib/userProfile'
import { getCosmicSignature } from '@/lib/personalization'

export function RootLayoutWithPersonalization({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize user profile on app mount
    const profile = initUserProfile()
    
    console.log('🌌 Cosmic Signature:', {
      userId: profile.cosmicSignature.userId.slice(0, 8),
      visualTone: profile.cosmicSignature.visualTone,
      explorerLevel: profile.stats.uniquePagesVisited >= 50 ? 'Master' : 'Explorer'
    })

    // Apply visual tone to CSS variables
    const tone = profile.cosmicSignature.visualTone
    document.documentElement.style.setProperty('--nebula-density', `${tone.nebulaDensity}`)
    document.documentElement.style.setProperty('--starfield-drift', `${tone.starfieldDrift}`)
    document.documentElement.style.setProperty('--glow-strength', `${tone.glowStrength}`)
    document.documentElement.style.setProperty('--dominant-hue', `${tone.dominantHue}`)
  }, [])

  return <>{children}</>
}

// ============================================================================
// EXAMPLE 5: Share Page - Load Shared Content
// ============================================================================

import { loadSharedContent, createContextFromShare } from '@/lib/shareSystem'

export function SharedConstellationPage({ shareCode }: { shareCode: string }) {
  const [sharedData, setSharedData] = useState<any>(null)
  const [layout, setLayout] = useState<any>(null)

  useEffect(() => {
    // Load shared content
    const data = loadSharedContent(shareCode)
    if (!data) {
      console.error('Share not found')
      return
    }

    setSharedData(data)

    if (data.type === 'constellation') {
      // Recreate the exact same experience
      const ctx = createContextFromShare(shareCode)
      
      // Load nodes/edges (from your data source)
      const nodes = [] // Load from your data
      const edges = [] // Load from your data
      
      // Generate layout with SAME seed
      const recreatedLayout = generatePersonalizedLayout(nodes, edges, 'share', {
        shareCode,
        width: 1200,
        height: 800
      })
      
      setLayout(recreatedLayout)
    }
  }, [shareCode])

  if (!sharedData) return <div>Loading shared constellation...</div>

  return (
    <div className="shared-view">
      <div className="share-header">
        <h2>{sharedData.metadata.title}</h2>
        <p>Shared by Explorer {sharedData.metadata.creatorId}</p>
        <p className="share-code">Code: {shareCode}</p>
      </div>

      {/* Render the exact same constellation */}
      {layout && (
        <div className="constellation-replay">
          {/* Same rendering as PersonalizedConstellationPage */}
          <svg width="1200" height="800">
            {/* ... render nodes and lines ... */}
          </svg>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Dummy components for example
// ============================================================================

function NodeLink({ nodeId }: { nodeId: string }) {
  return <a href={`/node/${nodeId}`}>{nodeId}</a>
}
