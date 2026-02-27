'use client';

import { useState } from 'react';
import { KnowledgeNode, getConnectedNodes, getNodeById } from '../architecture/knowledgeGraph';

interface NodeViewerProps {
  node: KnowledgeNode;
  onClose: () => void;
  onNavigate: (nodeId: string) => void;
}

export default function NodeViewer({ node, onClose, onNavigate }: NodeViewerProps) {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [showConnections, setShowConnections] = useState(true);

  const connectedNodes = getConnectedNodes(node.id);

  if (node.locked) {
    return (
      <div className="node-viewer-overlay">
        <div className="node-viewer locked-node">
          <div className="locked-header">
            <div className="locked-icon">🔒</div>
            <h1 className="locked-title">Node Locked</h1>
          </div>
          
          <div className="locked-content">
            <p className="locked-message">
              This knowledge node is currently locked.
            </p>
            {node.unlockCondition && (
              <p className="unlock-condition">
                Unlock condition: {node.unlockCondition}
              </p>
            )}
            <p className="locked-hint whisper">
              Explore more of HalfSpace to discover how to unlock this node...
            </p>
          </div>
          
          <button className="close-btn" onClick={onClose}>
            Return
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="node-viewer-overlay">
      <div className="node-viewer">
        {/* Header */}
        <div className="node-header">
          <div className="node-meta">
            <span className="node-realm" style={{ color: getRealmColor(node.realm) }}>
              {node.realm.toUpperCase()}
            </span>
            <span className="node-level">Level {node.level}</span>
          </div>

          <div className="node-controls">
            <button 
              className="lang-toggle"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              {language === 'en' ? 'ع' : 'EN'}
            </button>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        {/* Title */}
        <div className="node-title-section">
          <h1 className="node-title">
            {language === 'en' ? node.title : node.titleAr}
          </h1>
        </div>

        {/* Content */}
        <div className="node-content">
          <p className="content-text">{node.content}</p>
        </div>

        {/* Questions */}
        {node.questions && node.questions.length > 0 && (
          <div className="node-questions">
            <h3 className="questions-title">Questions to Ponder</h3>
            {node.questions.map((question, index) => (
              <div key={index} className="question-item">
                <span className="question-icon">?</span>
                <p className="question-text">{question}</p>
              </div>
            ))}
          </div>
        )}

        {/* Coordinates */}
        <div className="node-coordinates">
          <span className="coord-label">Cosmic Coordinates:</span>
          <span className="coord-value">
            [{node.coordinates[0]}, {node.coordinates[1]}, {node.coordinates[2]}]
          </span>
        </div>

        {/* Connections */}
        <div className="node-connections">
          <button
            className="connections-toggle"
            onClick={() => setShowConnections(!showConnections)}
          >
            <span className="icon">🔗</span>
            <span>Connected Nodes ({connectedNodes.length})</span>
          </button>

          {showConnections && connectedNodes.length > 0 && (
            <div className="connections-grid fade-in">
              {connectedNodes.map(connectedNode => (
                <div
                  key={connectedNode.id}
                  className="connection-card"
                  style={{ borderColor: getRealmColor(connectedNode.realm) }}
                  onClick={() => onNavigate(connectedNode.id)}
                >
                  <div className="connection-realm" style={{ color: getRealmColor(connectedNode.realm) }}>
                    {connectedNode.realm} • Level {connectedNode.level}
                  </div>
                  <h4 className="connection-title">{connectedNode.title}</h4>
                  <p className="connection-title-ar whisper">{connectedNode.titleAr}</p>
                  <p className="connection-preview">{connectedNode.content.slice(0, 100)}...</p>
                  <div className="connection-action">Explore →</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="node-footer">
          <p className="footer-hint whisper">
            Follow the connections. Each thought leads to another. The web is infinite.
          </p>
        </div>
      </div>
    </div>
  );
}

function getRealmColor(realm: string): string {
  const colors: Record<string, string> = {
    known: '#0080FF',
    unseen: '#8B00FF',
    human: '#FF6B35',
    core: '#FFD700',
    nexus: '#00FFFF',
    hidden: '#FF0080'
  };
  return colors[realm] || '#FFFFFF';
}
