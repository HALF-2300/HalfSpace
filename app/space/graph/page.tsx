'use client'

import { useEffect, useMemo, useState } from 'react'
import { buildKnowledgeGraph, type KnowledgeDifficulty, type KnowledgeNodeType } from '@/lib/space/graph/graphBuilder'
import { GraphCanvas } from '@/components/space/graph/GraphCanvas'
import { GraphListFallback } from '@/components/space/graph/GraphListFallback'
import '@/app/space/space-page.css'

export default function SpaceGraphPage() {
  const { nodes, edges, suggestions } = useMemo(() => buildKnowledgeGraph(), [])
  const [selectedType, setSelectedType] = useState<KnowledgeNodeType | 'all'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<KnowledgeDifficulty | 'all'>('all')
  const [selectedNode, setSelectedNode] = useState(nodes[0] ?? null)
  const [weakDevice, setWeakDevice] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowThreads = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 2
    setWeakDevice(reducedMotion || lowThreads)
  }, [])

  const filteredNodes = useMemo(
    () =>
      nodes.filter(
        (node) =>
          (selectedType === 'all' || node.type === selectedType) &&
          (selectedDifficulty === 'all' || node.difficulty === selectedDifficulty)
      ),
    [nodes, selectedDifficulty, selectedType]
  )

  const filteredEdges = useMemo(
    () => edges.filter((edge) => filteredNodes.some((n) => n.id === edge.source) && filteredNodes.some((n) => n.id === edge.target)),
    [edges, filteredNodes]
  )

  const neighbors = useMemo(() => {
    if (!selectedNode) return []
    const relatedIds = filteredEdges
      .filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id)
      .map((edge) => (edge.source === selectedNode.id ? edge.target : edge.source))
    return filteredNodes.filter((node) => relatedIds.includes(node.id))
  }, [filteredEdges, filteredNodes, selectedNode])

  const nextRecommended = neighbors[0] ?? filteredNodes.find((n) => n.id === suggestions.beginnerPath[0])

  return (
    <div className="min-h-screen bg-space-deep text-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300">Knowledge Graph</p>
          <h1 className="text-5xl md:text-6xl font-black text-gradient space-heading-glow">
            رسم ترابط معرفي حي
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            Graph يربط المفاهيم، المهام، التلسكوبات، والحقائق مع علاقات explains / depends_on / example_of / observed_by،
            ويقترح مسارات تعلم للمبتدئين والتعمق.
          </p>
        </header>

        <section className="glass rounded-2xl border border-purple-500/20 p-5 flex flex-wrap gap-4 items-center">
          <div className="space-y-1">
            <p className="text-xs text-gray-400">النوع</p>
            <div className="flex flex-wrap gap-2">
              {(['all', 'concept', 'mission', 'telescope', 'fact', 'term'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type === 'all' ? 'all' : type)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    selectedType === type ? 'bg-purple-600 text-white border-purple-400' : 'bg-black/30 border-purple-500/30'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-400">الصعوبة</p>
            <div className="flex gap-2">
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level === 'all' ? 'all' : level)}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    selectedDifficulty === level ? 'bg-blue-600 text-white border-blue-400' : 'bg-black/30 border-blue-500/30'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Nodes: {filteredNodes.length} · Edges: {filteredEdges.length} {weakDevice && '(fallback)'}
          </div>
        </section>

        <section className="space-y-4">
          {!weakDevice ? (
            <GraphCanvas nodes={filteredNodes} edges={filteredEdges} onSelect={setSelectedNode} />
          ) : (
            <GraphListFallback nodes={filteredNodes} edges={filteredEdges} onSelect={setSelectedNode} />
          )}
        </section>

        {selectedNode && (
          <section className="glass rounded-2xl border border-purple-500/20 p-6 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-purple-300">{selectedNode.type}</p>
                <h3 className="text-2xl font-semibold text-white">{selectedNode.title}</h3>
              </div>
              <span className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm">
                Difficulty: {selectedNode.difficulty}
              </span>
            </div>
            <p className="text-gray-200">{selectedNode.summary}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              {selectedNode.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 rounded bg-purple-600/30 border border-purple-500/30 text-purple-100">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              {selectedNode.link && (
                <a
                  href={selectedNode.link}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm border border-blue-400 transition"
                >
                  افتح الصفحة الأصلية
                </a>
              )}
              {nextRecommended && (
                <div className="text-sm text-gray-200">
                  Next recommended: <span className="font-semibold text-white">{nextRecommended.title}</span>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="grid md:grid-cols-2 gap-4">
          <div className="glass rounded-2xl border border-purple-500/20 p-5 space-y-3">
            <h3 className="text-xl font-semibold text-white">Beginner path</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-200">
              {suggestions.beginnerPath.map((id) => {
                const node = nodes.find((n) => n.id === id)
                return (
                  <li key={id} className="cursor-pointer hover:text-white" onClick={() => node && setSelectedNode(node)}>
                    {node?.title ?? id}
                  </li>
                )
              })}
            </ol>
          </div>
          <div className="glass rounded-2xl border border-purple-500/20 p-5 space-y-3">
            <h3 className="text-xl font-semibold text-white">Deep dive path</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-200">
              {suggestions.deepDivePath.map((id) => {
                const node = nodes.find((n) => n.id === id)
                return (
                  <li key={id} className="cursor-pointer hover:text-white" onClick={() => node && setSelectedNode(node)}>
                    {node?.title ?? id}
                  </li>
                )
              })}
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
