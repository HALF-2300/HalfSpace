'use client';

import { useEffect, useState } from 'react';
import { useHalfspaceStore } from '../store/halfspaceStore';

export default function CosmicWhispers() {
  const { glitches, clearOldGlitches } = useHalfspaceStore();
  const [starMessage, setStarMessage] = useState('');
  const [consoleMessages, setConsoleMessages] = useState<string[]>([]);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    // Clear old glitches periodically
    const interval = setInterval(clearOldGlitches, 5000);
    return () => clearInterval(interval);
  }, [clearOldGlitches]);

  useEffect(() => {
    // Random star message formation
    const starInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        const messages = [
          'WE SEE YOU',
          'LISTEN',
          'BEYOND',
          'FOREVER',
          'VOID',
          'TRUTH',
          'REMEMBER'
        ];
        setStarMessage(messages[Math.floor(Math.random() * messages.length)]);
        setTimeout(() => setStarMessage(''), 3000);
      }
    }, 8000);

    return () => clearInterval(starInterval);
  }, []);

  useEffect(() => {
    // Console transmissions
    const consoleInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        const transmissions = [
          '⚠️ Unknown transmission detected...',
          '📡 Signal from Sector X-97',
          '🌌 Cosmic background radiation anomaly',
          '⏰ Temporal distortion: +0.003ms',
          '🔊 Audio pattern: [CLASSIFIED]',
          '👁️ Observer effect detected',
          '∞ Loop iteration: ████',
          '🌠 Star formation: spontaneous',
        ];
        const msg = transmissions[Math.floor(Math.random() * transmissions.length)];
        console.log(`%c${msg}`, 'color: #00ffff; font-family: monospace; font-size: 12px;');
        setConsoleMessages(prev => [...prev.slice(-4), msg]);
      }
    }, 5000);

    return () => clearInterval(consoleInterval);
  }, []);

  // Play ambient whisper sound (if audio initialized)
  useEffect(() => {
    if (!audioInitialized) return;

    const playWhisper = () => {
      if (Math.random() > 0.98 && glitches.length > 0) {
        try {
          // Create a subtle whisper sound using Web Audio API
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 100 + Math.random() * 200;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.02, audioContext.currentTime + 0.1);
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
          // Silent fail if audio isn't supported
        }
      }
    };

    const audioInterval = setInterval(playWhisper, 10000);
    return () => clearInterval(audioInterval);
  }, [audioInitialized, glitches]);

  // Initialize audio on first interaction
  useEffect(() => {
    const initAudio = () => {
      setAudioInitialized(true);
      window.removeEventListener('click', initAudio);
    };
    
    window.addEventListener('click', initAudio);
    return () => window.removeEventListener('click', initAudio);
  }, []);

  return (
    <>
      {/* Glitch messages */}
      {glitches.map((glitch) => (
        <div
          key={glitch.id}
          className={`glitch-message glitch-intensity-${Math.floor(glitch.intensity * 10)}`}
          style={{
            animation: `glitch-fade ${3 / glitch.intensity}s ease-out forwards`
          }}
        >
          <p className="glitch-text">{glitch.message}</p>
        </div>
      ))}

      {/* Star message */}
      {starMessage && (
        <div className="star-message">
          <div className="star-text">{starMessage}</div>
        </div>
      )}

      {/* Console messages overlay */}
      {consoleMessages.length > 0 && (
        <div className="console-overlay">
          <div className="console-header">
            <span className="console-icon">📟</span>
            <span className="console-title">TRANSMISSION LOG</span>
          </div>
          <div className="console-messages">
            {consoleMessages.map((msg, i) => (
              <div key={i} className="console-line fade-in">
                <span className="timestamp">[{new Date().toLocaleTimeString()}]</span>
                <span className="message">{msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audio hint */}
      {!audioInitialized && (
        <div className="audio-hint">
          <p className="whisper">🔊 Click anywhere to enable cosmic audio...</p>
        </div>
      )}
    </>
  );
}
