/**
 * Simple audio chime for star clicks
 * Using Web Audio API for lightweight sound generation
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Play a pleasant chime sound when clicking a star
 */
export async function playStarChime(): Promise<void> {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create oscillator for the chime
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Pleasant frequency (A note, high octave)
    osc.frequency.value = 880;
    osc.type = 'sine';

    // Quick fade in/out envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (error) {
    // Silently fail if audio not supported
  }
}

/**
 * Play a deeper, more resonant sound for special interactions
 */
export async function playDeepChime(): Promise<void> {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Lower frequency for deeper sound
    osc.frequency.value = 220;
    osc.type = 'sine';

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.start(now);
    osc.stop(now + 0.5);
  } catch (error) {
    // Silently fail if audio not supported
  }
}
