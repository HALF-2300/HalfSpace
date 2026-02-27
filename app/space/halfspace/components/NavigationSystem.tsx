'use client';

import { useState, useEffect } from 'react';
import { useHalfspaceStore } from '../store/halfspaceStore';
import { KnowledgeNode, getNodeById, getNodesByRealm, getConnectedNodes } from '../architecture/knowledgeGraph';
import { CosmicArticle, getArticleById, getArticlesByRealm } from '../content/cosmicWonders';
import TheCore from './TheCore';
import RealmExplorer from './RealmExplorer';
import ArticleViewer from './ArticleViewer';
import NodeViewer from './NodeViewer';

type ViewState = 
  | { type: 'core' }
  | { type: 'realm', realmId: string }
  | { type: 'article', articleId: string }
  | { type: 'node', nodeId: string };

export default function NavigationSystem() {
  const [viewState, setViewState] = useState<ViewState>({ type: 'core' });
  const [journey, setJourney] = useState<string[]>(['core']);
  const { addVisitedNode } = useHalfspaceStore();

  const navigateToRealm = (realmId: string) => {
    setViewState({ type: 'realm', realmId });
    setJourney([...journey, `realm:${realmId}`]);
  };

  const navigateToArticle = (articleId: string) => {
    const article = getArticleById(articleId);
    if (article) {
      setViewState({ type: 'article', articleId });
      setJourney([...journey, `article:${articleId}`]);
    }
  };

  const navigateToNode = (nodeId: string) => {
    const node = getNodeById(nodeId);
    if (node) {
      setViewState({ type: 'node', nodeId });
      setJourney([...journey, `node:${nodeId}`]);
      addVisitedNode(nodeId);
    }
  };

  const goBack = () => {
    if (journey.length > 1) {
      const newJourney = journey.slice(0, -1);
      setJourney(newJourney);
      
      const lastView = newJourney[newJourney.length - 1];
      if (lastView === 'core') {
        setViewState({ type: 'core' });
      } else if (lastView.startsWith('realm:')) {
        setViewState({ type: 'realm', realmId: lastView.split(':')[1] });
      } else if (lastView.startsWith('article:')) {
        setViewState({ type: 'article', articleId: lastView.split(':')[1] });
      } else if (lastView.startsWith('node:')) {
        setViewState({ type: 'node', nodeId: lastView.split(':')[1] });
      }
    }
  };

  const goHome = () => {
    setViewState({ type: 'core' });
    setJourney(['core']);
  };

  return (
    <div className="navigation-system">
      {/* Breadcrumb Navigation */}
      {journey.length > 1 && (
        <div className="breadcrumb-nav">
          <button className="nav-home" onClick={goHome}>
            🏠 Core
          </button>
          {journey.length > 1 && (
            <button className="nav-back" onClick={goBack}>
              ← Back
            </button>
          )}
          <div className="journey-path">
            {journey.map((step, index) => (
              <span key={index} className="journey-step">
                {index > 0 && ' → '}
                {step.replace('realm:', '').replace('article:', '').replace('node:', '')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main View */}
      <div className="main-view">
        {viewState.type === 'core' && (
          <TheCore onRealmSelect={navigateToRealm} />
        )}

        {viewState.type === 'realm' && (
          <RealmExplorer
            realmId={viewState.realmId}
            onArticleSelect={navigateToArticle}
            onNodeSelect={navigateToNode}
            onBack={goBack}
          />
        )}

        {viewState.type === 'article' && (
          <ArticleViewer
            article={getArticleById(viewState.articleId)!}
            onClose={goBack}
            onNavigate={navigateToNode}
          />
        )}

        {viewState.type === 'node' && (
          <NodeViewer
            node={getNodeById(viewState.nodeId)!}
            onClose={goBack}
            onNavigate={navigateToNode}
          />
        )}
      </div>

      {/* Journey Tracker */}
      <div className="journey-tracker">
        <div className="tracker-icon">🧭</div>
        <div className="tracker-text">
          <span className="tracker-label">Your Journey:</span>
          <span className="tracker-count">{journey.length - 1} steps</span>
        </div>
      </div>
    </div>
  );
}
