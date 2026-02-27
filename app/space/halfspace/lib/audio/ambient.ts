export type AmbientEngine = {
  start: () => Promise<void>;
  stop: () => void;
  setLevel: (level: number) => void; // 0..1
  isRunning: () => boolean;
};

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function makeNoiseBuffer(ctx: AudioContext, seconds = 2) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    // soft noise
    data[i] = (Math.random() * 2 - 1) * 0.18;
  }
  return buffer;
}

export function createAmbientEngine(): AmbientEngine {
  let ctx: AudioContext | null = null;

  let master: GainNode | null = null;
  let bedGain: GainNode | null = null;

  let noiseSrc: AudioBufferSourceNode | null = null;
  let noiseFilter: BiquadFilterNode | null = null;

  let oscA: OscillatorNode | null = null;
  let oscB: OscillatorNode | null = null;
  let oscGain: GainNode | null = null;
  let oscFilter: BiquadFilterNode | null = null;

  let running = false;
  let level = 0.35;

  const ensure = () => {
    if (ctx) return;
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    master = ctx.createGain();
    master.gain.value = 0.0; // start silent, fade in
    master.connect(ctx.destination);

    // Noise bed
    bedGain = ctx.createGain();
    bedGain.gain.value = 0.0;

    noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 520;
    noiseFilter.Q.value = 0.9;

    // Oscillators
    oscGain = ctx.createGain();
    oscGain.gain.value = 0.0;

    oscFilter = ctx.createBiquadFilter();
    oscFilter.type = 'bandpass';
    oscFilter.frequency.value = 220;
    oscFilter.Q.value = 0.7;

    // Route
    bedGain.connect(noiseFilter);
    noiseFilter.connect(master);

    oscGain.connect(oscFilter);
    oscFilter.connect(master);
  };

  const fadeTo = (node: GainNode, target: number, ms: number) => {
    if (!ctx) return;
    const t = ctx.currentTime;
    node.gain.cancelScheduledValues(t);
    node.gain.setValueAtTime(node.gain.value, t);
    node.gain.linearRampToValueAtTime(target, t + ms / 1000);
  };

  const setLevelFn = (v: number) => {
    level = clamp01(v);
    if (!ctx || !master || !bedGain || !oscGain) return;

    if (running) {
      // adjust smoothly without popping
      fadeTo(bedGain, 0.22 * level, 350);
      fadeTo(oscGain, 0.16 * level, 350);
      fadeTo(master, 0.22 * level + 0.16 * level, 350);
    }
  };

  const start = async () => {
    ensure();
    if (!ctx || !master || !bedGain || !oscGain) return;

    // Must be triggered after user gesture, but we still try to resume.
    if (ctx.state !== 'running') {
      try {
        await ctx.resume();
      } catch {
        // ignore
      }
    }

    if (running) return;
    running = true;

    // Create noise source
    noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = makeNoiseBuffer(ctx, 2);
    noiseSrc.loop = true;
    noiseSrc.connect(bedGain);
    noiseSrc.start();

    // Create oscillators (soft "space hum")
    oscA = ctx.createOscillator();
    oscA.type = 'sine';
    oscA.frequency.value = 55; // low hum

    oscB = ctx.createOscillator();
    oscB.type = 'triangle';
    oscB.frequency.value = 110;

    // slight detune for richness
    oscA.detune.value = -7;
    oscB.detune.value = 6;

    oscA.connect(oscGain);
    oscB.connect(oscGain);
    oscA.start();
    oscB.start();

    // Fade in
    setLevelFn(level);
    fadeTo(bedGain, 0.22 * level, 650);
    fadeTo(oscGain, 0.16 * level, 900);
    fadeTo(master, 0.22 * level + 0.16 * level, 1000);

    // Gentle drift (very lightweight)
    const drift = () => {
      if (!ctx || !running || !oscFilter) return;
      const t = ctx.currentTime;
      // move bandpass center slowly
      const base = 180 + Math.random() * 120;
      oscFilter.frequency.cancelScheduledValues(t);
      oscFilter.frequency.setValueAtTime(oscFilter.frequency.value, t);
      oscFilter.frequency.linearRampToValueAtTime(base, t + 6.5);
      setTimeout(drift, 6500);
    };
    drift();
  };

  const stop = () => {
    if (!ctx || !master || !bedGain || !oscGain) return;
    if (!running) return;

    // Fade out then stop nodes
    fadeTo(master, 0.0, 600);
    fadeTo(bedGain, 0.0, 500);
    fadeTo(oscGain, 0.0, 500);

    const localCtx = ctx;
    const localNoise = noiseSrc;
    const localA = oscA;
    const localB = oscB;

    running = false;

    setTimeout(() => {
      try { localNoise?.stop(); } catch {}
      try { localA?.stop(); } catch {}
      try { localB?.stop(); } catch {}
      try { localNoise?.disconnect(); } catch {}
      try { localA?.disconnect(); } catch {}
      try { localB?.disconnect(); } catch {}
      // Keep AudioContext alive (avoid re-creating too often)
    }, 650);

    noiseSrc = null;
    oscA = null;
    oscB = null;
  };

  return {
    start,
    stop,
    setLevel: setLevelFn,
    isRunning: () => running,
  };
}
