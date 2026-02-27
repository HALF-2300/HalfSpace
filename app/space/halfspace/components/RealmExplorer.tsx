'use client';

import { useState } from 'react';
import { REALMS, getNodesByRealm, getNodesByLevel } from '../architecture/knowledgeGraph';
import { getArticlesByRealm } from '../content/cosmicWonders';

interface RealmExplorerProps {
  realmId: string;
  onArticleSelect: (articleId: string) => void;
  onNodeSelect: (nodeId: string) => void;
  onBack: () => void;
}

export default function RealmExplorer({ realmId, onArticleSelect, onNodeSelect, onBack }: RealmExplorerProps) {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'articles' | 'nodes'>('articles');

  const realm = REALMS.find(r => r.id === realmId);
  if (!realm) return null;

  const articles = getArticlesByRealm(realmId);
  const nodes = getNodesByLevel(realmId, selectedLevel);

  return (
    <div className="realm-explorer">
      {/* Realm Header */}
      <div className="realm-header" style={{ borderColor: realm.color }}>
        <div className="realm-icon-large" style={{ color: realm.color }}>
          {realm.icon}
        </div>
        <div className="realm-info">
          <h1 className="realm-title">{realm.name}</h1>
          <p className="realm-title-ar">{realm.nameAr}</p>
          <p className="realm-desc">{realm.description}</p>
          <p className="realm-desc-ar whisper">{realm.descriptionAr}</p>
        </div>
      </div>

      {/* Level Selector */}
      <div className="level-selector">
        <div className="selector-label">Choose Level:</div>
        {realm.levels.map(level => (
          <button
            key={level.level}
            className={`level-btn ${selectedLevel === level.level ? 'active' : ''}`}
            style={{
              borderColor: selectedLevel === level.level ? realm.color : 'rgba(255,255,255,0.2)',
              backgroundColor: selectedLevel === level.level ? `${realm.color}20` : 'transparent'
            }}
            onClick={() => setSelectedLevel(level.level)}
          >
            <div className="level-num">{level.level}</div>
            <div className="level-info">
              <div className="level-name">{level.name}</div>
              <div className="level-name-ar">{level.nameAr}</div>
            </div>
          </button>
        ))}
      </div>

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button
          className={`mode-btn ${viewMode === 'articles' ? 'active' : ''}`}
          onClick={() => setViewMode('articles')}
        >
          📚 Articles
        </button>
        <button
          className={`mode-btn ${viewMode === 'nodes' ? 'active' : ''}`}
          onClick={() => setViewMode('nodes')}
        >
          🔗 Nodes
        </button>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {viewMode === 'articles' && (
          <>
            {articles.length === 0 ? (
              <div className="empty-state">
                <p>No articles yet in this realm.</p>
                <p className="whisper">More knowledge is being gathered...</p>
              </div>
            ) : (
              articles.map(article => (
                <div
                  key={article.id}
                  className="content-card article-card"
                  style={{ borderColor: realm.color }}
                  onClick={() => onArticleSelect(article.id)}
                >
                  <div className="card-header">
                    <span className="card-category">{article.category}</span>
                    <span className="card-level">Level {article.level}</span>
                  </div>
                  
                  <h3 className="card-title">{article.title}</h3>
                  <p className="card-title-ar">{article.titleAr}</p>
                  
                  <p className="card-intro">{article.intro.slice(0, 150)}...</p>
                  
                  <div className="card-footer">
                    <span className="card-sections">
                      {article.sections.length} sections
                    </span>
                    <span className="card-action">Read →</span>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {viewMode === 'nodes' && (
          <>
            {nodes.length === 0 ? (
              <div className="empty-state">
                <p>No knowledge nodes at this level yet.</p>
                <p className="whisper">Explore other levels...</p>
              </div>
            ) : (
              nodes.map(node => (
                <div
                  key={node.id}
                  className="content-card node-card"
                  style={{ borderColor: realm.color }}
                  onClick={() => onNodeSelect(node.id)}
                >
                  <div className="card-header">
                    <span className="card-realm" style={{ color: realm.color }}>
                      {node.realm}
                    </span>
                    {node.locked && <span className="locked-badge">🔒 Locked</span>}
                  </div>
                  
                  <h3 className="card-title">{node.title}</h3>
                  <p className="card-title-ar">{node.titleAr}</p>
                  
                  <p className="card-content">{node.content.slice(0, 120)}...</p>
                  
                  <div className="card-footer">
                    <span className="card-connections">
                      🔗 {node.connections.length} connections
                    </span>
                    <span className="card-action">Explore →</span>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Realm Hint */}
      <div className="realm-hint">
        <p className="whisper">
          Click any card to explore deeper. Connections will reveal themselves.
        </p>
      </div>
    </div>
  );
}
