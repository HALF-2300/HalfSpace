'use client'

import type { KnowledgeEdge, KnowledgeNode } from '@/lib/space/graph/graphBuilder'

interface GraphListFallbackProps {
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
  onSelect?: (node: KnowledgeNode) => void
}

export function GraphListFallback({ nodes, edges, onSelect }: GraphListFallbackProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Nodes</h3>
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2">
          {nodes.map((node) => (
            <button
              key={node.id}
              onClick={() => onSelect?.(node)}
              className="w-full text-left p-3 rounded-xl border border-purple-500/30 bg-white/5 hover:bg-white/10 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{node.title}</span>
                <span className="text-xs px-2 py-1 rounded-lg bg-purple-600/30 border border-purple-500/30">
                  {node.type}
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-1 line-clamp-2">{node.summary}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Relations</h3>
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2">
          {edges.map((edge, idx) => (
            <div
              key={`${edge.source}-${edge.target}-${idx}`}
              className="p-3 rounded-xl border border-purple-500/30 bg-white/5"
            >
              <p className="text-sm text-gray-200">
                <span className="font-semibold text-white">{edge.source}</span> —{' '}
                <span className="text-purple-300">{edge.relation}</span> →{' '}
                <span className="font-semibold text-white">{edge.target}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
