'use client';

import React from 'react';
import { Hotspot } from '../engine/types';

interface LearnMoreModalProps {
  hotspot: Hotspot | null;
  onClose: () => void;
}

export const LearnMoreModal: React.FC<LearnMoreModalProps> = ({
  hotspot,
  onClose,
}) => {
  if (!hotspot) return null;

  return (
    <div className="learn-more-modal-overlay" onClick={onClose}>
      <div className="learn-more-modal" onClick={(e) => e.stopPropagation()}>
        <button className="learn-more-modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="learn-more-modal-header">
          <h2 className="learn-more-modal-title">{hotspot.learnMore.title}</h2>
        </div>
        
        <div className="learn-more-modal-body">
          {hotspot.learnMore.sections.map((section, index) => (
            <div key={index} className="learn-more-section">
              <h3 className="learn-more-section-heading">{section.heading}</h3>
              <p className="learn-more-section-content">{section.content}</p>
            </div>
          ))}
        </div>
        
        <div className="learn-more-modal-footer">
          <button className="learn-more-modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
