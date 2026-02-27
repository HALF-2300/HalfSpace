'use client';

import { useState, useEffect } from 'react';

interface ParallelRealitiesProps {
  isDarkDimension: boolean;
  onFlip: () => void;
}

export default function ParallelRealities({ isDarkDimension, onFlip }: ParallelRealitiesProps) {
  const [showHint, setShowHint] = useState(false);
  const [discovered, setDiscovered] = useState(false);

  useEffect(() => {
    // Check if user has discovered the void
    const hasDiscovered = localStorage.getItem('halfspace_void_discovered') === 'true';
    setDiscovered(hasDiscovered);

    if (isDarkDimension && !hasDiscovered) {
      localStorage.setItem('halfspace_void_discovered', 'true');
      setDiscovered(true);
    }
  }, [isDarkDimension]);

  return (
    <div className="parallel-realities">
      {/* Dimension indicator */}
      <div className={`dimension-indicator ${isDarkDimension ? 'dark' : 'light'}`}>
        <div className="dimension-icon">
          {isDarkDimension ? '🌑' : '🌕'}
        </div>
        <div className="dimension-label">
          {isDarkDimension ? 'VOID DIMENSION' : 'LIGHT DIMENSION'}
        </div>
      </div>

      {/* Flip button (only shows after discovery) */}
      {discovered && (
        <button 
          className="reality-flip-button"
          onClick={onFlip}
          onMouseEnter={() => setShowHint(true)}
          onMouseLeave={() => setShowHint(false)}
        >
          <span className="flip-icon">⟲</span>
          <span className="flip-label">Flip Reality</span>
        </button>
      )}

      {/* Dimensional messages */}
      <div className="dimension-messages">
        {isDarkDimension ? (
          <div className="dark-message fade-in">
            <p className="whisper">"Welcome to the side that was never meant to be seen."</p>
            <p className="truth">Here, the cosmos reveals its darker truths...</p>
          </div>
        ) : (
          discovered && (
            <div className="light-message fade-in">
              <p className="whisper">"You now walk between worlds."</p>
              <p className="hint">Type VOID again to return to the darkness...</p>
            </div>
          )
        )}
      </div>

      {/* Reality distortion visual effect */}
      {isDarkDimension && (
        <div className="reality-distortion">
          <div className="distortion-wave wave-1"></div>
          <div className="distortion-wave wave-2"></div>
          <div className="distortion-wave wave-3"></div>
        </div>
      )}

      {/* Hint for undiscovered users */}
      {!discovered && (
        <div className="undiscovered-hint">
          <p className="cryptic">Something lurks in the void...</p>
          <p className="ultra-subtle">The word holds power.</p>
        </div>
      )}
    </div>
  );
}
