'use client';

import { useState, useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  onClose: () => void;
}

export default function InfiniteScroll({ onClose }: InfiniteScrollProps) {
  const [scrollDepth, setScrollDepth] = useState(0);
  const [entries, setEntries] = useState<any[]>([]);
  const [reachedEnd, setReachedEnd] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate initial entries
    generateEntries(0);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const depth = scrollTop / (scrollHeight - clientHeight);
      setScrollDepth(depth);

      // Load more entries as we scroll
      if (scrollTop + clientHeight >= scrollHeight - 100 && !reachedEnd) {
        const currentAge = entries.length;
        if (currentAge < 50) {
          generateEntries(currentAge);
        } else {
          setReachedEnd(true);
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [entries, reachedEnd]);

  const generateEntries = (startIndex: number) => {
    const newEntries: any[] = [];
    for (let i = 0; i < 5; i++) {
      const age = startIndex + i;
      newEntries.push(generateCosmicEntry(age));
    }
    setEntries(prev => [...prev, ...newEntries]);
  };

  return (
    <div className="infinite-scroll-overlay">
      <div className="infinite-scroll-panel">
        <div className="infinite-scroll-header">
          <h2>∞ The Infinite Scroll of Existence</h2>
          <p className="subtitle">Journey through cosmic time</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="depth-indicator">
          <div className="depth-bar">
            <div 
              className="depth-fill"
              style={{ width: `${scrollDepth * 100}%` }}
            ></div>
          </div>
          <p className="depth-label">
            {scrollDepth < 0.1 && 'Recent History'}
            {scrollDepth >= 0.1 && scrollDepth < 0.3 && 'Ancient Era'}
            {scrollDepth >= 0.3 && scrollDepth < 0.6 && 'Primordial Age'}
            {scrollDepth >= 0.6 && scrollDepth < 0.9 && 'Before Time'}
            {scrollDepth >= 0.9 && !reachedEnd && 'The Edge of Knowledge'}
            {reachedEnd && 'THE BEGINNING (OR THE END)'}
          </p>
        </div>

        <div 
          ref={scrollContainerRef}
          className="infinite-scroll-content"
        >
          {entries.map((entry, index) => (
            <div 
              key={index}
              className="scroll-entry fade-in"
              style={{
                opacity: 1 - (scrollDepth * 0.3),
                filter: `hue-rotate(${scrollDepth * 360}deg)`
              }}
            >
              <div className="entry-time">{entry.time}</div>
              <div className="entry-content">
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
                {entry.artifact && (
                  <div className="entry-artifact">
                    <span className="artifact-icon">{entry.artifact.icon}</span>
                    <span className="artifact-text">{entry.artifact.text}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {reachedEnd && (
            <div className="scroll-end fade-in">
              <div className="end-symbol">⧖</div>
              <h2 className="glitch-text">You are the first. Or the last.</h2>
              <p className="whisper">There is nothing before this.</p>
              <p className="whisper">Or nothing after.</p>
              <p className="whisper">Time itself is uncertain here.</p>
            </div>
          )}

          {!reachedEnd && entries.length > 0 && (
            <div className="loading-more">
              <div className="loading-spinner"></div>
              <p>Excavating older memories...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function generateCosmicEntry(index: number): any {
  const age = Math.pow(10, index / 3);
  const timeAgo = formatTimeAgo(age);
  
  const entries = [
    {
      title: 'First Human Consciousness',
      description: 'The moment when matter first became aware of itself.',
      artifact: { icon: '🧠', text: 'Preserved in quantum memory' }
    },
    {
      title: 'The Great Silence',
      description: 'When all civilizations across the galaxy went quiet, simultaneously.',
      artifact: { icon: '📡', text: 'No transmission records survive' }
    },
    {
      title: 'Star Forge Activation',
      description: 'An ancient machine that created suns from thought alone.',
      artifact: { icon: '⚙️', text: 'Last activated: Unknown' }
    },
    {
      title: 'The Whisper Event',
      description: 'Every sentient being heard the same word, in their own language.',
      artifact: { icon: '🌀', text: 'The word is now forgotten' }
    },
    {
      title: 'First Light',
      description: 'The universe opened its eyes and saw itself for the first time.',
      artifact: { icon: '✨', text: 'Echo still reverberates' }
    },
    {
      title: 'The Collapsing Hour',
      description: 'Time briefly ran backwards. Most dont remember.',
      artifact: { icon: '⏰', text: 'Temporal scars remain' }
    },
    {
      title: 'Civilization Alpha',
      description: 'They reached the edge of reality and decided not to return.',
      artifact: { icon: '🏛️', text: 'Ruins exist in impossible dimensions' }
    },
    {
      title: 'The Dreaming Stars',
      description: 'A period when stars developed consciousness and conversed.',
      artifact: { icon: '⭐', text: 'Some say they still do' }
    },
    {
      title: 'Void Walker Discovery',
      description: 'Entities that exist only in the spaces between atoms.',
      artifact: { icon: '👁️', text: 'They are watching, always' }
    },
    {
      title: 'The Last Question',
      description: 'Someone asked a question so profound, the universe stopped to think.',
      artifact: { icon: '❓', text: 'The answer was silence' }
    }
  ];

  const entry = entries[index % entries.length];
  
  return {
    time: timeAgo,
    ...entry
  };
}

function formatTimeAgo(years: number): string {
  if (years < 1000) {
    return `${Math.floor(years)} years ago`;
  } else if (years < 1000000) {
    return `${Math.floor(years / 1000)} thousand years ago`;
  } else if (years < 1000000000) {
    return `${(years / 1000000).toFixed(1)} million years ago`;
  } else {
    return `${(years / 1000000000).toFixed(1)} billion years ago`;
  }
}
