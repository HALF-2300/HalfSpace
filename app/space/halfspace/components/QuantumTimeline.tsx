'use client';

import { useState, useEffect } from 'react';
import { useHalfspaceStore } from '../store/halfspaceStore';

export default function QuantumTimeline() {
  const { quantumTime, setQuantumTime } = useHalfspaceStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [lockedTimelines, setLockedTimelines] = useState<number[]>([-0.9, -0.5, 0.7, 1.0]);

  useEffect(() => {
    // Check for clues discovered to unlock timelines
    const cluesFound = parseInt(localStorage.getItem('halfspace_clues') || '0');
    const unlockedTimelines = lockedTimelines.filter((_, i) => i < cluesFound);
    setLockedTimelines(lockedTimelines.filter(t => !unlockedTimelines.includes(t)));
  }, []);

  const handleTimeChange = (value: number) => {
    // Check if this timeline is locked
    const isLocked = lockedTimelines.some(locked => 
      Math.abs(value - locked) < 0.05
    );

    if (isLocked) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    setQuantumTime(value);

    // Special messages at key points
    if (value < -0.95) {
      console.log('%cYou have reached the beginning of time...', 'color: #00ff00; font-size: 16px;');
    } else if (value > 0.95) {
      console.log('%cYou approach the heat death of the universe...', 'color: #ff0000; font-size: 16px;');
    }
  };

  const getEraLabel = (time: number): string => {
    if (time < -0.7) return 'Primordial Formation';
    if (time < -0.3) return 'Star Birth Era';
    if (time < 0.1) return 'Present Day';
    if (time < 0.5) return 'Stellar Maturity';
    if (time < 0.8) return 'Pre-Collapse';
    return 'Event Horizon';
  };

  return (
    <div className={`quantum-timeline ${isExpanded ? 'expanded' : ''}`}>
      <button 
        className="timeline-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="icon">⏳</span>
        <span className="label">Quantum Time</span>
      </button>

      {isExpanded && (
        <div className="timeline-content">
          <div className="timeline-header">
            <h3>Timeline Navigator</h3>
            <p className="era-label">{getEraLabel(quantumTime)}</p>
          </div>

          <div className="timeline-slider-container">
            <div className="timeline-markers">
              <span className="marker past">Formation</span>
              <span className="marker present">Now</span>
              <span className="marker future">Heat Death</span>
            </div>

            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={quantumTime}
              onChange={(e) => handleTimeChange(parseFloat(e.target.value))}
              className="timeline-slider"
            />

            <div className="time-value">
              {quantumTime < 0 
                ? `${Math.abs(quantumTime * 13.8).toFixed(1)} Billion Years Ago`
                : quantumTime === 0 
                ? 'Present Day'
                : `+${(quantumTime * 10).toFixed(1)} Billion Years`
              }
            </div>
          </div>

          {/* Locked timeline warning */}
          {showMessage && (
            <div className="locked-message glitch-text">
              <p>⚠️ This time should not exist.</p>
              <p className="hint">Discover clues across HalfSpace to unlock forbidden timelines...</p>
            </div>
          )}

          {/* Timeline events */}
          <div className="timeline-events">
            <div className={`event ${quantumTime < -0.8 ? 'active' : ''}`}>
              🌌 Galaxy nucleation begins
            </div>
            <div className={`event ${quantumTime >= -0.5 && quantumTime < 0 ? 'active' : ''}`}>
              ⭐ First stars ignite
            </div>
            <div className={`event ${Math.abs(quantumTime) < 0.1 ? 'active' : ''}`}>
              🌍 Present moment
            </div>
            <div className={`event ${quantumTime > 0.5 && quantumTime < 0.9 ? 'active' : ''}`}>
              🔴 Red giant phase
            </div>
            <div className={`event ${quantumTime >= 0.9 ? 'active' : ''}`}>
              ⚫ Gravitational collapse
            </div>
          </div>

          <div className="timeline-hint">
            <p>Scroll through time and watch the galaxy evolve</p>
          </div>
        </div>
      )}
    </div>
  );
}
