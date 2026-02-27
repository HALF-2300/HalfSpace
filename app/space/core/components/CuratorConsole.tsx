'use client';

import { useState, useMemo, useCallback } from 'react';
import { 
  searchNodes, 
  getRelatedNodes, 
  getAllTags, 
  getNodesByType,
  getNodeById,
  KnowledgeNode,
  NodeType,
  graphStats 
} from '../lib/knowledge-graph';

interface CuratorConsoleProps {
  onNodeSelect?: (node: KnowledgeNode) => void;
  onAddToArtifact?: (nodeId: string) => void;
  selectedNodeId?: string;
}

/**
 * Curator Console - واجهة البحث والاستكشاف الموحدة
 */
export default function CuratorConsole({
  onNodeSelect,
  onAddToArtifact,
  selectedNodeId
}: CuratorConsoleProps) {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<NodeType | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<'search' | 'browse' | 'related'>('search');

  const allTags = useMemo(() => getAllTags(), []);
  
  const nodeTypes: Array<{ type: NodeType; label: string; icon: string }> = [
    { type: 'concept', label: 'Concepts', icon: '💡' },
    { type: 'object', label: 'Objects', icon: '🌟' },
    { type: 'phenomenon', label: 'Phenomena', icon: '✨' },
    { type: 'mission', label: 'Missions', icon: '🚀' },
    { type: 'technology', label: 'Technology', icon: '🔭' },
    { type: 'term', label: 'Terms', icon: '📖' },
    { type: 'era', label: 'Eras', icon: '⏳' }
  ];

  // نتائج البحث
  const searchResults = useMemo(() => {
    let results = query.trim() ? searchNodes(query) : [];
    
    if (selectedType !== 'all') {
      results = results.filter(n => n.type === selectedType);
    }
    if (selectedTag !== 'all') {
      results = results.filter(n => n.tags.includes(selectedTag));
    }
    
    return results.slice(0, 20);
  }, [query, selectedType, selectedTag]);

  // التصفح حسب النوع
  const browseResults = useMemo(() => {
    if (selectedType === 'all') return [];
    let results = getNodesByType(selectedType);
    
    if (selectedTag !== 'all') {
      results = results.filter(n => n.tags.includes(selectedTag));
    }
    
    return results;
  }, [selectedType, selectedTag]);

  // العناصر المرتبطة
  const relatedItems = useMemo(() => {
    if (!selectedNodeId) return [];
    return getRelatedNodes(selectedNodeId);
  }, [selectedNodeId]);

  const selectedNode = selectedNodeId ? getNodeById(selectedNodeId) : null;

  const handleNodeClick = useCallback((node: KnowledgeNode) => {
    onNodeSelect?.(node);
  }, [onNodeSelect]);

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

  return (
    <div className="curator-console bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <span>Curator Console</span>
          </h2>
          <div className="text-xs text-gray-400">
            {graphStats.totalNodes} nodes • {graphStats.totalEdges} edges
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { mode: 'search', label: 'Search', icon: '🔍' },
            { mode: 'browse', label: 'Browse', icon: '📂' },
            { mode: 'related', label: 'Related', icon: '🔗' }
          ].map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as typeof viewMode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === mode
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
              }`}
            >
              <span className="mr-1">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        {viewMode === 'search' && (
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في المعرفة الكونية... Search cosmic knowledge..."
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/60"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as NodeType | 'all')}
            className="px-3 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none"
          >
            <option value="all">All Types</option>
            {nodeTypes.map(({ type, label, icon }) => (
              <option key={type} value={type}>{icon} {label}</option>
            ))}
          </select>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none"
          >
            <option value="all">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Area */}
      <div className="max-h-[500px] overflow-y-auto">
        {/* Search Results */}
        {viewMode === 'search' && (
          <div className="p-4">
            {query.trim() === '' ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🔭</div>
                <p>ابدأ البحث لاستكشاف المعرفة الكونية</p>
                <p className="text-sm">Start searching to explore cosmic knowledge</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🌌</div>
                <p>لا توجد نتائج</p>
                <p className="text-sm">No results found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map(node => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    isSelected={node.id === selectedNodeId}
                    onClick={() => handleNodeClick(node)}
                    onAddToArtifact={onAddToArtifact}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Browse Results */}
        {viewMode === 'browse' && (
          <div className="p-4">
            {selectedType === 'all' ? (
              <div className="grid grid-cols-2 gap-3">
                {nodeTypes.map(({ type, label, icon }) => {
                  const count = getNodesByType(type).length;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-purple-500/20 text-left transition-all"
                    >
                      <div className="text-2xl mb-1">{icon}</div>
                      <div className="text-white font-medium">{label}</div>
                      <div className="text-xs text-gray-500">{count} items</div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className="text-purple-400 text-sm hover:underline mb-2"
                >
                  ← العودة للأنواع
                </button>
                {browseResults.map(node => (
                  <NodeCard
                    key={node.id}
                    node={node}
                    isSelected={node.id === selectedNodeId}
                    onClick={() => handleNodeClick(node)}
                    onAddToArtifact={onAddToArtifact}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Related Items */}
        {viewMode === 'related' && (
          <div className="p-4">
            {!selectedNode ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🔗</div>
                <p>اختر عنصراً لرؤية الترابطات</p>
                <p className="text-sm">Select an item to see relationships</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Selected Node */}
                <div className="p-4 bg-purple-500/20 rounded-xl border border-purple-500/40">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{selectedNode.icon}</span>
                    <div>
                      <h3 className="text-white font-bold">{selectedNode.title}</h3>
                      <p className="text-purple-200 text-sm">{selectedNode.title_ar}</p>
                    </div>
                  </div>
                </div>

                {/* Related Nodes */}
                {relatedItems.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <p>لا توجد ترابطات</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      الترابطات ({relatedItems.length})
                    </h4>
                    {relatedItems.map(({ node, edge, direction }) => (
                      <div
                        key={`${edge.id}-${node.id}`}
                        className="group"
                      >
                        <div className="flex items-center gap-2 mb-1 text-xs text-purple-400">
                          {direction === 'to' ? (
                            <span>← {getEdgeTypeLabel(edge.type)}</span>
                          ) : (
                            <span>{getEdgeTypeLabel(edge.type)} →</span>
                          )}
                          {edge.reason_ar && (
                            <span className="text-gray-500">({edge.reason_ar})</span>
                          )}
                        </div>
                        <NodeCard
                          node={node}
                          isSelected={false}
                          onClick={() => handleNodeClick(node)}
                          onAddToArtifact={onAddToArtifact}
                          compact
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * بطاقة العقدة
 */
function NodeCard({
  node,
  isSelected,
  onClick,
  onAddToArtifact,
  compact = false
}: {
  node: KnowledgeNode;
  isSelected: boolean;
  onClick: () => void;
  onAddToArtifact?: (nodeId: string) => void;
  compact?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        p-3 rounded-xl border cursor-pointer transition-all group
        ${isSelected 
          ? 'bg-purple-500/30 border-purple-500/60' 
          : 'bg-white/5 border-purple-500/20 hover:bg-white/10 hover:border-purple-500/40'
        }
        ${compact ? 'p-2' : 'p-3'}
      `}
    >
      <div className="flex items-start gap-3">
        <span className={compact ? 'text-xl' : 'text-2xl'}>{node.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`text-white font-medium truncate ${compact ? 'text-sm' : ''}`}>
              {node.title}
            </h3>
            {onAddToArtifact && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToArtifact(node.id);
                }}
                className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-purple-500/30 hover:bg-purple-500/50 rounded text-xs text-purple-200 transition-all"
              >
                + حزمة
              </button>
            )}
          </div>
          <p className={`text-gray-400 truncate ${compact ? 'text-xs' : 'text-sm'}`}>
            {node.title_ar}
          </p>
          {!compact && (
            <>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                {node.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {node.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {node.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{node.tags.length - 3}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
