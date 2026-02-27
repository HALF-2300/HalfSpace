'use client';

import { useState } from 'react';
import { useHalfspaceStore } from '../store/halfspaceStore';

interface DreamSyncProtocolProps {
  onClose: () => void;
}

export default function DreamSyncProtocol({ onClose }: DreamSyncProtocolProps) {
  const [dream, setDream] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { addDream, visitorId } = useHalfspaceStore();

  const handleSync = async () => {
    if (!dream.trim()) return;

    setAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const interpretation = interpretDream(dream);
      setResult(interpretation);
      
      // Save to store
      if (visitorId) {
        addDream({
          id: `dream-${Date.now()}`,
          dream: dream,
          coordinates: interpretation.coordinates,
          linkedSector: interpretation.sector,
          timestamp: Date.now()
        });
      }

      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="dream-sync-overlay">
      <div className="dream-sync-panel">
        <div className="dream-sync-header">
          <h2>🌙 Dream Sync Protocol</h2>
          <p className="subtitle">Merge your subconscious with cosmic data</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="dream-sync-content">
          {!result ? (
            <>
              <div className="dream-input-section">
                <label>Describe your dream:</label>
                <textarea
                  value={dream}
                  onChange={(e) => setDream(e.target.value)}
                  placeholder="I dreamed of falling through stars..."
                  rows={6}
                  className="dream-textarea"
                  disabled={analyzing}
                />
              </div>

              <button 
                className="sync-button"
                onClick={handleSync}
                disabled={!dream.trim() || analyzing}
              >
                {analyzing ? (
                  <>
                    <span className="analyzing-spinner"></span>
                    Analyzing dream patterns...
                  </>
                ) : (
                  <>
                    <span className="icon">🔮</span>
                    Sync with Cosmos
                  </>
                )}
              </button>

              <div className="dream-hint">
                <p className="whisper">The universe interprets dreams as coordinates...</p>
                <p>Your subconscious may hold the key to forgotten sectors.</p>
              </div>
            </>
          ) : (
            <div className="dream-result fade-in">
              <h3>✨ Dream Interpretation Complete</h3>
              
              <div className="result-section">
                <h4>Cosmic Coordinates</h4>
                <p className="coordinates">{result.coordinates}</p>
              </div>

              <div className="result-section">
                <h4>Linked Sector</h4>
                <p className="sector">{result.sector}</p>
                <p className="sector-description">{result.description}</p>
              </div>

              <div className="result-section">
                <h4>Historical Record</h4>
                <p className="history">{result.history}</p>
              </div>

              <div className="dream-message">
                <p className="glitch-text">{result.message}</p>
              </div>

              <button 
                className="new-dream-button"
                onClick={() => {
                  setResult(null);
                  setDream('');
                }}
              >
                Sync Another Dream
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function interpretDream(dream: string): any {
  const keywords = dream.toLowerCase().split(/\s+/);
  
  // Generate coordinates based on dream content
  const hash = keywords.reduce((acc, word) => acc + word.charCodeAt(0), 0);
  const coordinates = `X:${(hash % 1000) - 500} Y:${((hash * 7) % 1000) - 500} Z:${((hash * 13) % 1000) - 500}`;
  
  // Determine sector based on keywords
  let sector = 'Sector X-97';
  let description = 'A region of space known for temporal anomalies.';
  let history = 'Last recorded by an explorer 600 years ago.';
  let message = 'You are now linked to this forgotten region.';
  
  if (keywords.some(w => ['fall', 'falling', 'dropped', 'down'].includes(w))) {
    sector = 'The Descent Nebula';
    description = 'Where gravity dreams of becoming infinite.';
    history = 'Recorded in ancient texts as "The place where angels fell."';
    message = 'Your dream resonates with the collective memory of falling civilizations.';
  } else if (keywords.some(w => ['star', 'stars', 'light', 'bright'].includes(w))) {
    sector = 'Luminara Prime';
    description = 'The birthplace of first light.';
    history = 'Said to be where the universe opened its eyes for the first time.';
    message = 'You carry the memory of stellar birth within you.';
  } else if (keywords.some(w => ['dark', 'darkness', 'shadow', 'void'].includes(w))) {
    sector = 'The Void Between';
    description = 'True emptiness. Not the absence of light, but the absence of possibility.';
    history = 'No one has returned from this region.';
    message = 'Some dreams are warnings. This may be one of them.';
  } else if (keywords.some(w => ['water', 'ocean', 'sea', 'swim'].includes(w))) {
    sector = 'Aquarius Depths';
    description = 'Where the cosmic ocean meets consciousness itself.';
    history = 'Ancient mariners spoke of stars that swam like fish.';
    message = 'You dream of fluid time. Reality is more liquid than you know.';
  } else if (keywords.some(w => ['fly', 'flying', 'float', 'soar'].includes(w))) {
    sector = 'The Weightless Fields';
    description = 'A region where physics forgot itself.';
    history = 'Explorers reported feeling simultaneously everywhere and nowhere.';
    message = 'Your consciousness seeks freedom from physical constraints.';
  }
  
  return { coordinates, sector, description, history, message };
}
