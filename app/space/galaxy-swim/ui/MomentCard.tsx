'use client';

import React from 'react';
import { Hotspot } from '../engine/types';

interface MomentCardProps {
  hotspot: Hotspot;
  onLearnMore: (hotspot: Hotspot) => void;
  onClose: () => void;
}

export const MomentCard: React.FC<MomentCardProps> = ({
  hotspot,
  onLearnMore,
  onClose,
}) => {
  return (
    <div className="moment-card">
      <button className="moment-card-close" onClick={onClose}>
        ×
      </button>
      
      <div className="moment-card-header">
        <h3 className="moment-card-title">{hotspot.card.title}</h3>
      </div>
      
      <div className="moment-card-body">
        <p className="moment-card-description">{hotspot.card.description}</p>
        
        <div className="moment-card-fact">
          <div className="moment-card-fact-value">{hotspot.card.fact}</div>
          <div className="moment-card-fact-label">{hotspot.card.factLabel}</div>
        </div>
      </div>
      
      <div className="moment-card-footer">
        <button
          className="moment-card-button"
          onClick={() => onLearnMore(hotspot)}
        >
          Learn more →
        </button>
      </div>
    </div>
  );
};
