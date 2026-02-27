'use client';

import { useEffect, useState } from 'react';
import styles from './OpeningSequence.module.css';

interface OpeningSequenceProps {
  onComplete: () => void;
}

export default function OpeningSequence({ onComplete }: OpeningSequenceProps) {
  const [stage, setStage] = useState<'silence' | 'whisper' | 'dot' | 'horizon' | 'planet' | 'question'>('silence');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize audio context
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(ctx);

    return () => {
      if (ctx.state !== 'closed') {
        ctx.close();
      }
    };
  }, []);

  useEffect(() => {
    const sequence = async () => {
      // Stage 1: Silence (3 seconds)
      await sleep(3000);
      
      // Stage 2: Whisper
      setStage('whisper');
      playCosmicSound(audioContext);
      await sleep(5000);
      
      // Stage 3: Dot appears
      setStage('dot');
      await sleep(2000);
      
      // Stage 4: Horizon line
      setStage('horizon');
      await sleep(2000);
      
      // Stage 5: Planet curve
      setStage('planet');
      playThunderRumble(audioContext);
      await sleep(3000);
      
      // Stage 6: Question
      setStage('question');
      await sleep(3000);
    };

    sequence();
  }, [audioContext]);

  const playCosmicSound = (ctx: AudioContext | null) => {
    if (!ctx) return;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 100;
    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 3);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 1);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 4);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 4);
  };

  const playThunderRumble = (ctx: AudioContext | null) => {
    if (!ctx) return;
    
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    filter.type = 'lowpass';
    filter.frequency.value = 100;
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.5);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    
    noise.start();
    noise.stop(ctx.currentTime + 2);
  };

  return (
    <div className={styles.opening}>
      {stage === 'silence' && (
        <div className={styles.silence}></div>
      )}

      {stage === 'whisper' && (
        <div className={styles.whisper}>
          <p className={styles.whisperText}>
            Welcome to HalfSpace.
            <br />
            The border between the known and the never imagined.
          </p>
        </div>
      )}

      {(stage === 'dot' || stage === 'horizon' || stage === 'planet' || stage === 'question') && (
        <>
          <div className={`${styles.cosmicElement} ${styles[stage]}`}>
            {stage === 'dot' && <div className={styles.dot}></div>}
            {stage === 'horizon' && <div className={styles.horizon}></div>}
            {stage === 'planet' && <div className={styles.planetCurve}></div>}
          </div>

          {stage === 'planet' && (
            <div className={styles.vibration}>
              <p className={styles.vibrationText}>
                cosmic radiation detected...
              </p>
            </div>
          )}
        </>
      )}

      {stage === 'question' && (
        <div className={styles.question}>
          <p className={styles.questionText}>Where do you wish to begin?</p>
          <div className={styles.constellations}>
            <button 
              className={styles.constellation} 
              onClick={onComplete}
              data-option="origin"
            >
              <span className={styles.star}>✦</span>
              <span>The Origin</span>
              <span className={styles.hint}>the birth of the universe</span>
            </button>
            <button 
              className={styles.constellation} 
              onClick={onComplete}
              data-option="void"
            >
              <span className={styles.star}>✧</span>
              <span>The Void</span>
              <span className={styles.hint}>a surreal exploration mode</span>
            </button>
            <button 
              className={styles.constellation} 
              onClick={onComplete}
              data-option="archive"
            >
              <span className={styles.star}>✫</span>
              <span>The Archive</span>
              <span className={styles.hint}>lost civilizations</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
