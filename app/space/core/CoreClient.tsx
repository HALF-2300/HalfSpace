'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import CuratorConsole from './components/CuratorConsole';
import JourneyPanel from './components/JourneyPanel';
import ArtifactsPanel from './components/ArtifactsPanel';
import NodeDetailView from './components/NodeDetailView';
import { KnowledgeNode, graphStats } from './lib/knowledge-graph';
import { 
  Journey, 
  JourneyProgress 
} from './lib/journey-engine';
import { 
  Artifact, 
  createArtifactFromJourney,
  saveArtifact,
  decodeShareLink 
} from './lib/artifacts';
import './cosmic-core.css';

type ActivePanel = 'curator' | 'journey' | 'artifacts';

/**
 * Cosmic Core Client - الواجهة الرئيسية للعقل الكوني
 */
export default function CoreClient() {
  const searchParams = useSearchParams();
  
  // الحالة الرئيسية
  const [activePanel, setActivePanel] = useState<ActivePanel>('curator');
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [pendingNodeId, setPendingNodeId] = useState<string | undefined>();
  const [importedArtifact, setImportedArtifact] = useState<Artifact | null>(null);

  // معالجة رابط المشاركة
  useEffect(() => {
    const artifactParam = searchParams.get('artifact');
    if (artifactParam) {
      const decoded = decodeShareLink(artifactParam);
      if (decoded) {
        setImportedArtifact(decoded);
        setActivePanel('artifacts');
      }
    }
  }, [searchParams]);

  // اختيار عقدة
  const handleNodeSelect = useCallback((node: KnowledgeNode) => {
    setSelectedNode(node);
  }, []);

  // إضافة عقدة للحزمة
  const handleAddToArtifact = useCallback((nodeId: string) => {
    setPendingNodeId(nodeId);
    setActivePanel('artifacts');
  }, []);

  // إنشاء حزمة من رحلة
  const handleCreateArtifactFromJourney = useCallback((journey: Journey, progress: JourneyProgress) => {
    const artifact = createArtifactFromJourney(journey, progress);
    saveArtifact(artifact);
    setImportedArtifact(artifact);
    setActivePanel('artifacts');
  }, []);

  // إحصائيات الشبكة المعرفية
  const stats = useMemo(() => ({
    nodes: graphStats.totalNodes,
    edges: graphStats.totalEdges,
    nodeTypes: graphStats.nodeTypes.length,
    edgeTypes: graphStats.edgeTypes.length
  }), []);

  // توليد عقد الشبكة العصبية للخلفية
  const neuralNodes = useMemo(() => {
    const nodes = [];
    for (let i = 0; i < 30; i++) {
      nodes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3
      });
    }
    return nodes;
  }, []);

  return (
    <div className="cosmic-core-page min-h-screen relative">
      {/* الخلفية المتحركة */}
      <div className="cosmic-core-bg">
        <div className="neural-network">
          {neuralNodes.map(node => (
            <div
              key={node.id}
              className="neural-node"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                animationDelay: `${node.delay}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 px-4 py-8">
        {/* العنوان */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-6xl">🧠</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold cosmic-core-title mb-4">
            العقل الكوني
          </h1>
          <p className="text-xl md:text-2xl cosmic-core-subtitle mb-2">
            Cosmic Mind
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            نظام المعرفة الكونية المترابط - استكشف، تعلم، وابنِ رحلتك الشخصية عبر الكون
          </p>
        </header>

        {/* إحصائيات الشبكة */}
        <div className="max-w-4xl mx-auto mb-8 animate-slide-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stats-card">
              <div className="stats-number">{stats.nodes}</div>
              <div className="stats-label">Nodes</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{stats.edges}</div>
              <div className="stats-label">Edges</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{stats.nodeTypes}</div>
              <div className="stats-label">Types</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{stats.edgeTypes}</div>
              <div className="stats-label">Relations</div>
            </div>
          </div>
        </div>

        {/* أزرار التنقل */}
        <div className="max-w-4xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { id: 'curator', label: 'Curator Console', labelAr: 'وحدة الاستكشاف', icon: '🔮' },
              { id: 'journey', label: 'Journey Engine', labelAr: 'محرك الرحلات', icon: '🧭' },
              { id: 'artifacts', label: 'Artifacts', labelAr: 'الحزم', icon: '📦' }
            ].map(panel => (
              <button
                key={panel.id}
                onClick={() => setActivePanel(panel.id as ActivePanel)}
                className={`
                  cosmic-tab px-6 py-3 rounded-xl font-medium transition-all
                  ${activePanel === panel.id
                    ? 'bg-purple-500/30 border-2 border-purple-500/60 text-white glow-purple'
                    : 'bg-white/5 border-2 border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <span className="text-xl mr-2">{panel.icon}</span>
                <span className="hidden md:inline">{panel.labelAr}</span>
                <span className="md:hidden">{panel.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* المحتوى */}
        <div className="max-w-7xl mx-auto animate-scale-in">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* اللوحة النشطة */}
            <div className="lg:col-span-1">
              {activePanel === 'curator' && (
                <CuratorConsole
                  onNodeSelect={handleNodeSelect}
                  onAddToArtifact={handleAddToArtifact}
                  selectedNodeId={selectedNode?.id}
                />
              )}
              {activePanel === 'journey' && (
                <JourneyPanel
                  onStepSelect={(node) => handleNodeSelect(node)}
                  onCreateArtifact={handleCreateArtifactFromJourney}
                />
              )}
              {activePanel === 'artifacts' && (
                <ArtifactsPanel
                  pendingNodeId={pendingNodeId}
                  onPendingHandled={() => setPendingNodeId(undefined)}
                  onNodeSelect={handleNodeSelect}
                  importedArtifact={importedArtifact}
                  onImportHandled={() => setImportedArtifact(null)}
                />
              )}
            </div>

            {/* عرض التفاصيل */}
            <div className="lg:col-span-1">
              {selectedNode ? (
                <NodeDetailView
                  node={selectedNode}
                  onRelatedClick={handleNodeSelect}
                  onAddToArtifact={handleAddToArtifact}
                />
              ) : (
                <div className="h-full min-h-[400px] flex items-center justify-center bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/20">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">🌌</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      اختر عنصراً للاستكشاف
                    </h3>
                    <p className="text-gray-400">
                      Select an item to explore its details and connections
                    </p>
                    <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-purple-500/10 rounded-lg">
                        <div className="text-2xl mb-1">🔮</div>
                        <div className="text-purple-300">ابحث</div>
                      </div>
                      <div className="p-3 bg-cyan-500/10 rounded-lg">
                        <div className="text-2xl mb-1">🧭</div>
                        <div className="text-cyan-300">ارحل</div>
                      </div>
                      <div className="p-3 bg-amber-500/10 rounded-lg">
                        <div className="text-2xl mb-1">📦</div>
                        <div className="text-amber-300">اجمع</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>العقل الكوني • Cosmic Mind System</p>
          <p className="mt-1">
            {stats.nodes} nodes • {stats.edges} edges • ∞ possibilities
          </p>
        </footer>
      </div>
    </div>
  );
}
