'use client';

import React from 'react';
import { ScienceOverlay as ScienceOverlayType } from '../engine/types';

interface ScienceOverlayProps {
  overlays: ScienceOverlayType[];
  active: boolean;
}

export const ScienceOverlay: React.FC<ScienceOverlayProps> = ({
  overlays,
  active,
}) => {
  if (!active || overlays.length === 0) return null;

  return (
    <div className="science-overlay-container">
      <div className="science-overlay-header">
        <h3 className="science-overlay-title">🔬 Deep Science Mode</h3>
        <p className="science-overlay-subtitle">
          Explore {overlays.length} concept{overlays.length !== 1 ? 's' : ''} nearby
        </p>
      </div>
      
      <div className="science-overlay-list">
        {overlays.map((overlay) => (
          <div key={overlay.id} className="science-overlay-item">
            <div className="science-overlay-item-header">
              <span className="science-overlay-item-category">
                {overlay.category}
              </span>
              <h4 className="science-overlay-item-title">{overlay.title}</h4>
            </div>
            
            <p className="science-overlay-item-description">
              {overlay.shortDescription}
            </p>
            
            <details className="science-overlay-item-details">
              <summary className="science-overlay-item-summary">
                Read more
              </summary>
              <div className="science-overlay-item-full">
                <p>{overlay.fullDescription}</p>
                <div className="science-overlay-item-fact">
                  <span className="science-overlay-fact-value">
                    {overlay.keyFact.value}
                  </span>
                  <span className="science-overlay-fact-unit">
                    {overlay.keyFact.unit}
                  </span>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};
