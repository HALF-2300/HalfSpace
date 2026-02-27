'use client';

import { useState, useEffect } from 'react';
import { CosmicArticle } from '../content/cosmicWonders';
import { getConnectedNodes } from '../architecture/knowledgeGraph';

interface ArticleViewerProps {
  article: CosmicArticle;
  onClose: () => void;
  onNavigate: (nodeId: string) => void;
}

export default function ArticleViewer({ article, onClose, onNavigate }: ArticleViewerProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [showConnections, setShowConnections] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const connectedNodes = article.connections
    .map(id => getConnectedNodes(id))
    .flat()
    .filter((node, index, self) => 
      index === self.findIndex(n => n?.id === node?.id)
    );

  useEffect(() => {
    // Keyboard navigation
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentSection < article.sections.length - 1) {
        setCurrentSection(currentSection + 1);
      } else if (e.key === 'ArrowLeft' && currentSection > 0) {
        setCurrentSection(currentSection - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentSection, article.sections.length, onClose]);

  const section = article.sections[currentSection];

  return (
    <div className="article-viewer-overlay">
      <div className="article-viewer">
        {/* Header */}
        <div className="article-header">
          <div className="article-meta">
            <span className="article-realm" style={{ color: getRealmColor(article.realm) }}>
              {article.realm.toUpperCase()}
            </span>
            <span className="article-level">Level {article.level}</span>
            <span className="article-category">{article.category}</span>
          </div>

          <div className="article-controls">
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
        <div className="article-title-section">
          <h1 className="article-title">
            {language === 'en' ? article.title : article.titleAr}
          </h1>
        </div>

        {/* Intro */}
        <div className="article-intro">
          <p className="intro-text">
            {language === 'en' ? article.intro : article.introAr}
          </p>
        </div>

        {/* Current Section */}
        <div className="article-section fade-in" key={currentSection}>
          <div className="section-icon">{section.icon}</div>
          
          <h2 className="section-title">
            {language === 'en' ? section.title : section.titleAr}
          </h2>

          <div className="section-content">
            <p className="content-text">
              {language === 'en' ? section.content : section.contentAr}
            </p>

            {section.scientificFact && (
              <div className="fact-box">
                <div className="fact-icon">🔬</div>
                <p className="fact-text">{section.scientificFact}</p>
              </div>
            )}

            {section.philosophicalTwist && (
              <div className="philosophy-box">
                <div className="philosophy-icon">💭</div>
                <p className="philosophy-text">{section.philosophicalTwist}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="article-navigation">
          <button
            className="nav-btn prev"
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
          >
            ← Previous
          </button>

          <div className="section-indicator">
            {article.sections.map((_, index) => (
              <div
                key={index}
                className={`indicator-dot ${index === currentSection ? 'active' : ''}`}
                onClick={() => setCurrentSection(index)}
              />
            ))}
          </div>

          <button
            className="nav-btn next"
            onClick={() => setCurrentSection(Math.min(article.sections.length - 1, currentSection + 1))}
            disabled={currentSection === article.sections.length - 1}
          >
            Next →
          </button>
        </div>

        {/* Philosophical End (shown on last section) */}
        {currentSection === article.sections.length - 1 && (
          <div className="article-conclusion fade-in">
            <div className="conclusion-divider"></div>
            <p className="conclusion-text">
              {language === 'en' ? article.philosophicalEnd : article.philosophicalEndAr}
            </p>
          </div>
        )}

        {/* Connections */}
        <div className="article-connections">
          <button
            className="connections-toggle"
            onClick={() => setShowConnections(!showConnections)}
          >
            <span className="icon">🔗</span>
            <span>Connected Ideas ({article.connections.length})</span>
          </button>

          {showConnections && (
            <div className="connections-grid fade-in">
              {connectedNodes.map(node => node && (
                <div
                  key={node.id}
                  className="connection-card"
                  onClick={() => {
                    onNavigate(node.id);
                    onClose();
                  }}
                >
                  <div className="connection-realm" style={{ color: getRealmColor(node.realm) }}>
                    {node.realm}
                  </div>
                  <h4 className="connection-title">{node.title}</h4>
                  <p className="connection-preview">{node.content.slice(0, 100)}...</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="article-footer">
          <p className="footer-hint whisper">
            Use ← → arrows to navigate • ESC to close • Click connections to explore
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
