'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Artifact,
  createArtifact,
  addItemToArtifact,
  removeItemFromArtifact,
  saveArtifact,
  loadAllArtifacts,
  deleteArtifact,
  exportArtifact,
  importArtifact,
  createShareLink,
  getArtifactNodes,
  getArtifactStats
} from '../lib/artifacts';
import { KnowledgeNode, getNodeById } from '../lib/knowledge-graph';

interface ArtifactsPanelProps {
  pendingNodeId?: string; // عقدة في الانتظار للإضافة
  onPendingHandled?: () => void;
  onNodeSelect?: (node: KnowledgeNode) => void;
  importedArtifact?: Artifact | null;
  onImportHandled?: () => void;
}

/**
 * Artifacts Panel - لوحة الحزم والمجموعات
 */
export default function ArtifactsPanel({
  pendingNodeId,
  onPendingHandled,
  onNodeSelect,
  importedArtifact,
  onImportHandled
}: ArtifactsPanelProps) {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [view, setView] = useState<'list' | 'edit' | 'create'>('list');
  const [newTitle, setNewTitle] = useState('');
  const [newTitleAr, setNewTitleAr] = useState('');
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJson, setImportJson] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // تحميل الحزم المحفوظة
  useEffect(() => {
    const saved = loadAllArtifacts();
    setArtifacts(saved);
  }, []);

  // معالجة العقدة المعلقة
  useEffect(() => {
    if (pendingNodeId && activeArtifact) {
      const updated = addItemToArtifact(activeArtifact, pendingNodeId);
      setActiveArtifact(updated);
      saveArtifact(updated);
      setArtifacts(prev => prev.map(a => a.id === updated.id ? updated : a));
      onPendingHandled?.();
    }
  }, [pendingNodeId, activeArtifact, onPendingHandled]);

  // معالجة الحزمة المستوردة
  useEffect(() => {
    if (importedArtifact) {
      saveArtifact(importedArtifact);
      setArtifacts(prev => [importedArtifact, ...prev]);
      setActiveArtifact(importedArtifact);
      setView('edit');
      onImportHandled?.();
    }
  }, [importedArtifact, onImportHandled]);

  // إنشاء حزمة جديدة
  const handleCreate = useCallback(() => {
    if (!newTitle.trim()) return;
    
    const artifact = createArtifact(
      newTitle.trim(),
      newTitleAr.trim() || newTitle.trim(),
      '📦'
    );
    
    saveArtifact(artifact);
    setArtifacts(prev => [artifact, ...prev]);
    setActiveArtifact(artifact);
    setNewTitle('');
    setNewTitleAr('');
    setView('edit');
  }, [newTitle, newTitleAr]);

  // حذف عنصر من الحزمة
  const handleRemoveItem = useCallback((itemId: string) => {
    if (!activeArtifact) return;
    
    const updated = removeItemFromArtifact(activeArtifact, itemId);
    setActiveArtifact(updated);
    saveArtifact(updated);
    setArtifacts(prev => prev.map(a => a.id === updated.id ? updated : a));
  }, [activeArtifact]);

  // حذف حزمة
  const handleDeleteArtifact = useCallback((artifactId: string) => {
    deleteArtifact(artifactId);
    setArtifacts(prev => prev.filter(a => a.id !== artifactId));
    if (activeArtifact?.id === artifactId) {
      setActiveArtifact(null);
      setView('list');
    }
  }, [activeArtifact]);

  // تصدير حزمة
  const handleExport = useCallback(() => {
    if (!activeArtifact) return;
    
    const json = exportArtifact(activeArtifact);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cosmic-artifact-${activeArtifact.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeArtifact]);

  // إنشاء رابط مشاركة
  const handleShare = useCallback(() => {
    if (!activeArtifact) return;
    const link = createShareLink(activeArtifact);
    setShareLink(link);
  }, [activeArtifact]);

  // استيراد من JSON
  const handleImport = useCallback(() => {
    const imported = importArtifact(importJson);
    if (imported) {
      saveArtifact(imported);
      setArtifacts(prev => [imported, ...prev]);
      setActiveArtifact(imported);
      setView('edit');
      setShowImportModal(false);
      setImportJson('');
    } else {
      alert('فشل الاستيراد - تأكد من صحة الملف');
    }
  }, [importJson]);

  // استيراد من ملف
  const handleFileImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importArtifact(content);
      if (imported) {
        saveArtifact(imported);
        setArtifacts(prev => [imported, ...prev]);
        setActiveArtifact(imported);
        setView('edit');
      } else {
        alert('فشل الاستيراد - تأكد من صحة الملف');
      }
    };
    reader.readAsText(file);
  }, []);

  return (
    <div className="artifacts-panel bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-amber-500/20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <span>Artifacts</span>
          </h2>
          <div className="flex gap-2">
            {view !== 'list' && (
              <button
                onClick={() => { setView('list'); setActiveArtifact(null); setShareLink(null); }}
                className="text-sm text-amber-400 hover:text-amber-300"
              >
                ← القائمة
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[500px] overflow-y-auto">
        {/* List View */}
        {view === 'list' && (
          <div className="p-4">
            {/* Actions */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setView('create')}
                className="flex-1 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-amber-200 text-sm transition-colors"
              >
                + إنشاء حزمة
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-sm transition-colors"
              >
                📥 استيراد
              </button>
            </div>

            {/* Artifacts List */}
            {artifacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📦</div>
                <p>لا توجد حزم بعد</p>
                <p className="text-sm">No artifacts yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {artifacts.map(artifact => {
                  const stats = getArtifactStats(artifact);
                  return (
                    <div
                      key={artifact.id}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-amber-500/20 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          onClick={() => { setActiveArtifact(artifact); setView('edit'); }}
                          className="flex-1 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{artifact.icon}</span>
                            <div>
                              <h3 className="text-white font-medium">{artifact.title_ar}</h3>
                              <p className="text-gray-400 text-sm">{artifact.title}</p>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            {stats.totalItems} عنصر • {new Date(artifact.updatedAt).toLocaleDateString('ar')}
                          </div>
                        </button>
                        <button
                          onClick={() => handleDeleteArtifact(artifact.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 px-2 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Create View */}
        {view === 'create' && (
          <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-4">إنشاء حزمة جديدة</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">العنوان (English)</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="My Space Collection"
                  className="w-full px-4 py-2 bg-white/5 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">العنوان (عربي)</label>
                <input
                  type="text"
                  value={newTitleAr}
                  onChange={(e) => setNewTitleAr(e.target.value)}
                  placeholder="مجموعتي الفضائية"
                  className="w-full px-4 py-2 bg-white/5 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  disabled={!newTitle.trim()}
                  className="flex-1 px-4 py-2 bg-amber-500/30 hover:bg-amber-500/50 disabled:bg-gray-500/20 disabled:cursor-not-allowed rounded-lg text-amber-200 transition-colors"
                >
                  إنشاء
                </button>
                <button
                  onClick={() => { setView('list'); setNewTitle(''); setNewTitleAr(''); }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit View */}
        {view === 'edit' && activeArtifact && (
          <div className="p-4">
            {/* Artifact Header */}
            <div className="p-4 bg-amber-500/20 rounded-xl border border-amber-500/30 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeArtifact.icon}</span>
                <div>
                  <h3 className="text-white font-bold">{activeArtifact.title_ar}</h3>
                  <p className="text-amber-300 text-sm">{activeArtifact.title}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={handleExport}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-gray-300 transition-colors"
                >
                  📤 تصدير
                </button>
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-gray-300 transition-colors"
                >
                  🔗 مشاركة
                </button>
              </div>

              {/* Share Link */}
              {shareLink && (
                <div className="mt-3 p-2 bg-black/30 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">رابط المشاركة:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 px-2 py-1 bg-black/50 rounded text-xs text-gray-300"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareLink);
                        alert('تم نسخ الرابط!');
                      }}
                      className="px-2 py-1 bg-amber-500/30 rounded text-xs text-amber-200"
                    >
                      نسخ
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-400">
                العناصر ({activeArtifact.items.length})
              </h4>
              
              {activeArtifact.items.length === 0 ? (
                <div className="text-center py-6 text-gray-500 bg-white/5 rounded-xl">
                  <p className="text-sm">لا توجد عناصر</p>
                  <p className="text-xs">أضف عناصر من Curator Console</p>
                </div>
              ) : (
                getArtifactNodes(activeArtifact).map(({ item, node }) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white/5 rounded-xl border border-amber-500/20 group"
                  >
                    {node ? (
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{node.icon}</span>
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => onNodeSelect?.(node)}
                            className="text-left"
                          >
                            <h4 className="text-white font-medium truncate">
                              {node.title_ar}
                            </h4>
                            <p className="text-gray-400 text-sm truncate">
                              {node.title}
                            </p>
                          </button>
                          {item.note && (
                            <p className="text-xs text-gray-500 mt-1">{item.note}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-gray-500">
                        <span className="text-sm">عنصر غير موجود: {item.nodeId}</span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-amber-500/30 p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-white mb-4">استيراد حزمة</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">من ملف:</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500/20 file:text-amber-200 hover:file:bg-amber-500/30"
                />
              </div>
              
              <div className="text-center text-gray-500 text-sm">أو</div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">من JSON:</label>
                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder='{"type": "cosmic-artifact", ...}'
                  className="w-full h-32 px-4 py-2 bg-white/5 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60 text-sm font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleImport}
                  disabled={!importJson.trim()}
                  className="flex-1 px-4 py-2 bg-amber-500/30 hover:bg-amber-500/50 disabled:bg-gray-500/20 disabled:cursor-not-allowed rounded-lg text-amber-200 transition-colors"
                >
                  استيراد
                </button>
                <button
                  onClick={() => { setShowImportModal(false); setImportJson(''); }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
