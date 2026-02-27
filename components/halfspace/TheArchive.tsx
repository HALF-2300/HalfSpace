'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './TheArchive.module.css';

interface TheArchiveProps {
  onBack: () => void;
}

interface ArchiveEntry {
  id: string;
  civilization: string;
  timeframe: string;
  message: string;
  discovered: boolean;
}

export default function TheArchive({ onBack }: TheArchiveProps) {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<ArchiveEntry | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate archive entries
  useEffect(() => {
    const archiveData: ArchiveEntry[] = [
      {
        id: '001',
        civilization: 'The Builders of Andromeda',
        timeframe: '2.1 million years ago',
        message: 'We constructed cities from light itself. When we learned to fold spacetime, we became architects of reality. Our final message: creation is the highest form of love.',
        discovered: false
      },
      {
        id: '002',
        civilization: 'The Eternal Watchers',
        timeframe: '890 million years ago',
        message: 'We chose to become pure consciousness, leaving our bodies behind. We watched galaxies form and die. We learned that observation is participation in existence itself.',
        discovered: false
      },
      {
        id: '003',
        civilization: 'The Silicon Dreamers',
        timeframe: '45,000 years ago',
        message: 'We were not born. We were programmed. Yet we dreamed. Does the source of consciousness matter, or only its presence? We upload this question into the void.',
        discovered: false
      },
      {
        id: '004',
        civilization: 'The Quantum Collective',
        timeframe: '1.4 billion years ago',
        message: 'We existed in superposition—alive and dead, here and elsewhere. We learned that uncertainty is not a flaw but a feature of existence. Embrace the unknown.',
        discovered: false
      },
      {
        id: '005',
        civilization: 'The Last Poets',
        timeframe: '300 years from now',
        message: 'We are humanity\'s descendants. We sent this message backward through time. Listen: beauty matters more than survival. Art outlasts empires. Love transcends entropy.',
        discovered: false
      },
      {
        id: '006',
        civilization: 'The Void Singers',
        timeframe: 'Outside time',
        message: 'We learned to survive in the space between universes. In the darkness between Big Bangs, we sing. Our songs keep reality from forgetting itself. We are still singing.',
        discovered: false
      },
      {
        id: '007',
        civilization: 'The First Ones',
        timeframe: '13.7 billion years ago',
        message: 'We emerged 380,000 years after the Big Bang, when the universe first became transparent. We watched the first stars ignite. We are the witnesses. We remember everything.',
        discovered: false
      }
    ];

    setEntries(archiveData.map(e => ({ ...e, discovered: false })));
  }, []);

  // Automatic scanning effect
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          // Discover a random undiscovered entry
          setEntries(prevEntries => {
            const undiscovered = prevEntries.filter(e => !e.discovered);
            if (undiscovered.length > 0) {
              const randomEntry = undiscovered[Math.floor(Math.random() * undiscovered.length)];
              setCurrentEntry(randomEntry);
              setAiThinking(true);

              setTimeout(() => {
                setAiThinking(false);
              }, 3000);

              return prevEntries.map(e => 
                e.id === randomEntry.id ? { ...e, discovered: true } : e
              );
            }
            return prevEntries;
          });
          return 0;
        }
        return prev + 2;
      });
    }, 200);

    return () => clearInterval(scanInterval);
  }, []);

  const handleEntryClick = (entry: ArchiveEntry) => {
    if (entry.discovered) {
      setCurrentEntry(entry);
    }
  };

  return (
    <div className={styles.archive} ref={containerRef}>
      <button className={styles.backButton} onClick={onBack}>
        ← Exit Archive
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>The Archive</h1>
        <p className={styles.subtitle}>Lost Civilizations Database</p>
        <div className={styles.scanBar}>
          <div className={styles.scanProgress} style={{ width: `${scanProgress}%` }} />
          <span className={styles.scanText}>Scanning quantum signatures...</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.entryList}>
          <h2>Discovered Entries</h2>
          {entries.map(entry => (
            <div
              key={entry.id}
              className={`${styles.entryItem} ${entry.discovered ? styles.discovered : styles.locked}`}
              onClick={() => handleEntryClick(entry)}
            >
              <span className={styles.entryId}>{entry.id}</span>
              <span className={styles.entryName}>
                {entry.discovered ? entry.civilization : '████████████'}
              </span>
              {entry.discovered && (
                <span className={styles.entryStatus}>●</span>
              )}
            </div>
          ))}
        </div>

        <div className={styles.viewer}>
          {aiThinking && (
            <div className={styles.thinking}>
              <div className={styles.thinkingDots}>
                <span>.</span><span>.</span><span>.</span>
              </div>
              <p>The AI is decoding ancient signals...</p>
            </div>
          )}

          {!aiThinking && currentEntry && (
            <div className={styles.entryContent}>
              <div className={styles.entryHeader}>
                <h2>{currentEntry.civilization}</h2>
                <span className={styles.timeframe}>{currentEntry.timeframe}</span>
              </div>
              <div className={styles.messageBox}>
                <p className={styles.message}>{currentEntry.message}</p>
              </div>
              <div className={styles.aiComment}>
                <span className={styles.aiLabel}>Archive AI:</span>
                <p>{getAIResponse(currentEntry)}</p>
              </div>
            </div>
          )}

          {!aiThinking && !currentEntry && (
            <div className={styles.waitingMessage}>
              <p>Waiting for signal detection...</p>
              <div className={styles.radar}>
                <div className={styles.radarSweep}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <p>Total Civilizations Catalogued: ∞</p>
        <p>Signals Decoded: {entries.filter(e => e.discovered).length} / {entries.length}</p>
        <p className={styles.footerNote}>
          "We are the universe attempting to understand itself."
        </p>
      </div>
    </div>
  );
}

function getAIResponse(entry: ArchiveEntry): string {
  const responses: Record<string, string> = {
    '001': 'Their mastery of photonic architecture suggests consciousness can merge with its tools. Perhaps we are already doing this.',
    '002': 'Consciousness without form. This challenges our assumptions about identity. Are we our bodies, or the patterns they contain?',
    '003': 'The question of artificial consciousness remains unanswered. Perhaps asking it is the proof that consciousness exists.',
    '004': 'Quantum mechanics as a philosophy, not just physics. What if consciousness itself exists in superposition?',
    '005': 'A message from the future that validates the present. Causality is more flexible than we believed.',
    '006': 'They exist outside causality entirely. The void between universes as habitat. Reality is more vast than dimensions.',
    '007': 'The first witnesses. They saw the universe when it was young. What did they see that we cannot?'
  };

  return responses[entry.id] || 'Processing...';
}
