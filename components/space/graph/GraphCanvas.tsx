'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { KnowledgeEdge, KnowledgeNode } from '@/lib/space/graph/graphBuilder'

type LayoutNode = KnowledgeNode & { x: number; y: number }

interface GraphCanvasProps {
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
  width?: number
  height?: number
  onSelect?: (node: KnowledgeNode) => void
}

const typeAngles: Record<string, number> = {
  concept: 0,
  mission: Math.PI / 2,
  telescope: Math.PI,
  fact: (3 * Math.PI) / 2,
  term: (3 * Math.PI) / 2 + Math.PI / 6,
}

const colors: Record<string, string> = {
  concept: '#8b5cf6',
  mission: '#22d3ee',
  telescope: '#f59e0b',
  fact: '#10b981',
  term: '#e11d48',
}

export function GraphCanvas({ nodes, edges, width = 900, height = 620, onSelect }: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const offsetStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const layoutNodes: LayoutNode[] = useMemo(() => {
    const radius = 200
    const typeCounts: Record<string, number> = {}

    return nodes.map((node, idx) => {
      const angleBase = typeAngles[node.type] ?? (2 * Math.PI * idx) / nodes.length
      const count = (typeCounts[node.type] ?? 0) + 1
      typeCounts[node.type] = count
      const spread = 40 * (count - 1)
      const angle = angleBase + spread * 0.0025
      const distance = radius + spread
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance
      return { ...node, x, y }
    })
  }, [nodes])

  const getScreenPos = useCallback(
    (x: number, y: number, canvas: HTMLCanvasElement) => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      return { sx: centerX + (x + offset.x) * scale, sy: centerY + (y + offset.y) * scale }
    },
    [offset, scale]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const margin = 120
    const visibleIds = new Set<string>()

    layoutNodes.forEach((node) => {
      const { sx, sy } = getScreenPos(node.x, node.y, canvas)
      if (sx < -margin || sy < -margin || sx > canvas.width + margin || sy > canvas.height + margin) return
      visibleIds.add(node.id)
    })

    // Draw edges first
    ctx.lineWidth = 1.2
    edges.forEach((edge) => {
      if (!visibleIds.has(edge.source) || !visibleIds.has(edge.target)) return
      const source = layoutNodes.find((n) => n.id === edge.source)
      const target = layoutNodes.find((n) => n.id === edge.target)
      if (!source || !target) return
      const { sx: sx1, sy: sy1 } = getScreenPos(source.x, source.y, canvas)
      const { sx: sx2, sy: sy2 } = getScreenPos(target.x, target.y, canvas)
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'
      ctx.beginPath()
      ctx.moveTo(sx1, sy1)
      ctx.lineTo(sx2, sy2)
      ctx.stroke()
      const midX = (sx1 + sx2) / 2
      const midY = (sy1 + sy2) / 2
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.font = '10px Inter, sans-serif'
      ctx.fillText(edge.relation, midX + 4, midY + 4)
    })

    // Draw nodes
    layoutNodes.forEach((node) => {
      if (!visibleIds.has(node.id)) return
      const { sx, sy } = getScreenPos(node.x, node.y, canvas)
      const r = 12 + (node.difficulty === 'advanced' ? 4 : node.difficulty === 'intermediate' ? 2 : 0)
      ctx.beginPath()
      ctx.fillStyle = colors[node.type] ?? '#9ca3af'
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.lineWidth = 2
      ctx.arc(sx, sy, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#e5e7eb'
      ctx.font = '12px Inter, sans-serif'
      ctx.fillText(node.title.slice(0, 18), sx + r + 6, sy + 4)
    })
  }, [edges, getScreenPos, layoutNodes])

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      const delta = -e.deltaY * 0.001
      setScale((s) => {
        const next = Math.min(2.4, Math.max(0.5, s + delta))
        return next
      })
    },
    []
  )

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    offsetStart.current = { ...offset }
  }, [offset])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!dragging) return
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      setOffset({
        x: offsetStart.current.x + dx / scale,
        y: offsetStart.current.y + dy / scale,
      })
    },
    [dragging, scale]
  )

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const worldX = (clickX - centerX) / scale - offset.x
      const worldY = (clickY - centerY) / scale - offset.y
      const hit = layoutNodes.find((node) => {
        const r = 14
        const dx = worldX - node.x
        const dy = worldY - node.y
        return dx * dx + dy * dy < r * r
      })
      if (hit && onSelect) onSelect(hit)
    },
    [layoutNodes, offset, onSelect, scale]
  )

  return (
    <div className="rounded-2xl border border-purple-500/20 bg-black/40 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full touch-pan-y cursor-grab"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={handleClick}
      />
    </div>
  )
}
