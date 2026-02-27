'use client';

import { useState } from 'react';
import { useHalfspaceStore } from '../store/halfspaceStore';

export default function UserGalaxyCreator() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'word' | 'emotion'>('word');
  const { addGalaxy, visitorId } = useHalfspaceStore();

  const emotionColors: Record<string, string> = {
    joy: '#FFD700',
    peace: '#87CEEB',
    wonder: '#9370DB',
    fear: '#8B0000',
    hope: '#00FF7F',
    melancholy: '#4B0082',
    curiosity: '#FF69B4',
    awe: '#00CED1',
    longing: '#DA70D6',
    serenity: '#E0FFFF'
  };

  const handleCreate = () => {
    if (!input.trim() || !visitorId) return;

    // Generate galaxy properties from input
    const hash = simpleHash(input);
    const color = mode === 'emotion' && emotionColors[input.toLowerCase()] 
      ? emotionColors[input.toLowerCase()]
      : generateColorFromString(input);

    const position: [number, number, number] = [
      (Math.sin(hash) * 20) - 10,
      (Math.cos(hash * 2) * 10) - 5,
      (Math.sin(hash * 3) * 20) - 30
    ];

    const galaxy = {
      id: `galaxy-${Date.now()}-${Math.random()}`,
      name: input,
      emotion: mode === 'emotion' ? input : 'neutral',
      color,
      position,
      createdAt: Date.now(),
      visitorId
    };

    addGalaxy(galaxy);
    
    // Clear and close
    setInput('');
    setIsOpen(false);

    // Show confirmation
    setTimeout(() => {
      alert(`✨ Galaxy "${input}" has been born into the cosmos!\nYou can see it glowing in the distance.`);
    }, 100);
  };

  return (
    <div className="galaxy-creator">
      <button 
        className="creator-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="icon">✨</span>
        <span className="label">Create Galaxy</span>
      </button>

      {isOpen && (
        <div className="creator-panel">
          <div className="creator-header">
            <h3>Birth a Galaxy</h3>
            <p className="subtitle">Your thoughts become stars</p>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="creator-content">
            <div className="mode-selector">
              <button 
                className={mode === 'word' ? 'active' : ''}
                onClick={() => setMode('word')}
              >
                Word
              </button>
              <button 
                className={mode === 'emotion' ? 'active' : ''}
                onClick={() => setMode('emotion')}
              >
                Emotion
              </button>
            </div>

            <div className="input-section">
              <label>
                {mode === 'word' 
                  ? 'Enter a word that resonates with you:'
                  : 'Choose an emotion:'
                }
              </label>

              {mode === 'emotion' ? (
                <select 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="emotion-select"
                >
                  <option value="">Select an emotion...</option>
                  {Object.keys(emotionColors).map(emotion => (
                    <option key={emotion} value={emotion}>
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter a word..."
                  className="word-input"
                  maxLength={20}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                />
              )}
            </div>

            <button 
              className="create-button"
              onClick={handleCreate}
              disabled={!input.trim()}
            >
              <span className="spark">✨</span>
              Birth into Existence
              <span className="spark">✨</span>
            </button>

            <div className="creator-hint">
              <p>Each creation adds to the collective universe.</p>
              <p className="whisper">Your galaxies will drift eternally through HalfSpace...</p>
            </div>
          </div>

          {/* Preview */}
          {input && (
            <div className="galaxy-preview">
              <div 
                className="preview-sphere"
                style={{
                  backgroundColor: mode === 'emotion' && emotionColors[input.toLowerCase()]
                    ? emotionColors[input.toLowerCase()]
                    : generateColorFromString(input),
                  boxShadow: `0 0 30px ${mode === 'emotion' && emotionColors[input.toLowerCase()]
                    ? emotionColors[input.toLowerCase()]
                    : generateColorFromString(input)}`
                }}
              ></div>
              <p className="preview-label">{input}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Utility functions
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function generateColorFromString(str: string): string {
  const hash = simpleHash(str);
  const hue = hash % 360;
  const saturation = 60 + (hash % 40);
  const lightness = 50 + (hash % 20);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
