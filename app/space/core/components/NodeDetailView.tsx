'use client';

import { useMemo } from 'react';
import { KnowledgeNode, getRelatedNodes, getNodeConnectivity } from '../lib/knowledge-graph';

interface NodeDetailViewProps {
  node: KnowledgeNode;
  onRelatedClick?: (node: KnowledgeNode) => void;
  onAddToArtifact?: (nodeId: string) => void;
}

/**
 * Node Detail View - عرض تفاصيل عقدة
 */
export default function NodeDetailView({
  node,
  onRelatedClick,
  onAddToArtifact
}: NodeDetailViewProps) {
  const relatedNodes = useMemo(() => getRelatedNodes(node.id), [node.id]);
  const connectivity = useMemo(() => getNodeConnectivity(node.id), [node.id]);

  // تقسيم العلاقات حسب الاتجاه
  const { incoming, outgoing } = useMemo(() => {
    const incoming = relatedNodes.filter(r => r.direction === 'from');
    const outgoing = relatedNodes.filter(r => r.direction === 'to');
    return { incoming, outgoing };
  }, [relatedNodes]);

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      concept: 'مفهوم',
      object: 'جرم سماوي',
      mission: 'مهمة فضائية',
      fact: 'حقيقة',
      term: 'مصطلح',
      era: 'حقبة زمنية',
      phenomenon: 'ظاهرة كونية',
      technology: 'تقنية رصد'
    };
    return labels[type] || type;
  };

  const getEdgeTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      depends_on: 'يعتمد على',
      explains: 'يشرح',
      observed_by: 'رُصد بواسطة',
      part_of: 'جزء من',
      leads_to: 'يؤدي إلى',
      contrast_with: 'للمقارنة',
      evolved_from: 'تطور من',
      contains: 'يحتوي'
    };
    return labels[type] || type;
  };

  const getDifficultyStars = (difficulty: number = 3): string => {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
  };

  return (
    <div className="node-detail-view bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-b border-purple-500/20">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-black/30 rounded-xl flex items-center justify-center text-4xl">
            {node.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">{node.title_ar}</h1>
            <p className="text-lg text-purple-300">{node.title}</p>
            <div className="flex items-center gap-3 mt-2 text-sm">
              <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded">
                {getTypeLabel(node.type)}
              </span>
              <span className="text-gray-400">
                {connectivity} ترابطات
              </span>
            </div>
          </div>
          {onAddToArtifact && (
            <button
              onClick={() => onAddToArtifact(node.id)}
              className="px-4 py-2 bg-amber-500/30 hover:bg-amber-500/50 rounded-lg text-amber-200 text-sm transition-colors"
            >
              + حزمة
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Description */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">الوصف</h3>
          <p className="text-white leading-relaxed">{node.description_ar}</p>
          <p className="text-gray-400 mt-2">{node.description}</p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          {node.difficulty && (
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">الصعوبة</div>
              <div className="text-amber-400">{getDifficultyStars(node.difficulty)}</div>
            </div>
          )}
          {node.importance && (
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">الأهمية</div>
              <div className="text-cyan-400">{getDifficultyStars(node.importance)}</div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">الوسوم</h3>
          <div className="flex flex-wrap gap-2">
            {node.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Link */}
        {node.link && (
          <a
            href={node.link}
            className="block p-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-white">استكشف المزيد</span>
              <span className="text-purple-400">→</span>
            </div>
            <span className="text-sm text-gray-400">{node.link}</span>
          </a>
        )}

        {/* Relationships */}
        {relatedNodes.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              الترابطات ({relatedNodes.length})
            </h3>

            {/* Outgoing (What this leads to) */}
            {outgoing.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs text-cyan-400 mb-2 flex items-center gap-2">
                  <span>←</span>
                  <span>ما يسبقه / يعتمد عليه</span>
                </h4>
                <div className="space-y-2">
                  {outgoing.slice(0, 5).map(({ node: relNode, edge }) => (
                    <button
                      key={`${edge.id}-${relNode.id}`}
                      onClick={() => onRelatedClick?.(relNode)}
                      className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{relNode.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate group-hover:text-cyan-300">
                            {relNode.title_ar}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getEdgeTypeLabel(edge.type)}
                            {edge.reason_ar && ` — ${edge.reason_ar}`}
                          </div>
                        </div>
                        <div className="text-gray-600 group-hover:text-cyan-400">→</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Incoming (What leads to this) */}
            {incoming.length > 0 && (
              <div>
                <h4 className="text-xs text-purple-400 mb-2 flex items-center gap-2">
                  <span>→</span>
                  <span>ما يؤدي إليه / يتبعه</span>
                </h4>
                <div className="space-y-2">
                  {incoming.slice(0, 5).map(({ node: relNode, edge }) => (
                    <button
                      key={`${edge.id}-${relNode.id}`}
                      onClick={() => onRelatedClick?.(relNode)}
                      className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{relNode.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate group-hover:text-purple-300">
                            {relNode.title_ar}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getEdgeTypeLabel(edge.type)}
                            {edge.reason_ar && ` — ${edge.reason_ar}`}
                          </div>
                        </div>
                        <div className="text-gray-600 group-hover:text-purple-400">→</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
