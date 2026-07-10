let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const WinAudioContext = (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
    const AudioContextClass = window.AudioContext || WinAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playPop() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(450, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.08);
  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

export function playRustle() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1200, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  noiseNode.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noiseNode.start();
}

export function playBark() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.exponentialRampToValueAtTime(90, now + 0.13);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
  osc.start(now);
  osc.stop(now + 0.13);
}

export function playMeow() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  osc1.type = "sine";
  osc2.type = "triangle";
  osc1.frequency.setValueAtTime(450, now);
  osc1.frequency.exponentialRampToValueAtTime(800, now + 0.08);
  osc1.frequency.exponentialRampToValueAtTime(600, now + 0.26);
  osc2.frequency.setValueAtTime(455, now);
  osc2.frequency.exponentialRampToValueAtTime(805, now + 0.08);
  osc2.frequency.exponentialRampToValueAtTime(605, now + 0.26);
  gain.gain.setValueAtTime(0.05, now);
  gain.gain.linearRampToValueAtTime(0.07, now + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.26);
  osc2.stop(now + 0.26);
}

/** Soft paper-rustle + gentle thud — play when opening diary / memory book */
export function playPageFlip() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // White noise burst (rustle)
  const bufSize = ctx.sampleRate * 0.18;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const filt = ctx.createBiquadFilter();
  filt.type = "highpass";
  filt.frequency.setValueAtTime(2000, now);
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.07, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  noise.connect(filt);
  filt.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);

  // Soft thud at end
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, now + 0.1);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);
  oscGain.gain.setValueAtTime(0.08, now + 0.1);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(now + 0.1);
  osc.stop(now + 0.22);
}

/** Rhythmic paw-step thumps — plays before revealing a pet memory, calls onDone when done */
export function playPawSteps(onDone?: () => void) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const stepTimes = [0, 0.22, 0.4, 0.58];

  stepTimes.forEach((t) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(90 + Math.random() * 20, now + t);
    osc.frequency.exponentialRampToValueAtTime(50, now + t + 0.12);
    gain.gain.setValueAtTime(0.1, now + t);
    gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + t);
    osc.stop(now + t + 0.12);
  });

  if (onDone) setTimeout(onDone, (stepTimes[stepTimes.length - 1] + 0.3) * 1000);
}

/** Ascending happy chime (C-E-G major triad) — play on love / treat interactions */
export function playHappyChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const freqs = [523.25, 659.25, 783.99]; // C5 E5 G5

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + i * 0.1);
    gain.gain.setValueAtTime(0.06, now + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.4);
  });
}
