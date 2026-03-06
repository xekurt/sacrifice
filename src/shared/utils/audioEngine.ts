// Procedural Audio Engine using Web Audio API
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

/**
 * Resumes the audio context if it was suspended by the browser.
 * Should be called on the first user interaction.
 */
export const resumeAudio = async () => {
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }
};

/**
 * Procedural "Approve" Sound: A heavy, resonant bureaucratic stamp.
 */
export const playApproveSound = () => {
    const now = audioCtx.currentTime;

    // 1. The "Impact" - High-passed noise for the initial click/thump
    const bufferSize = audioCtx.sampleRate * 0.05; // 50ms
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) noiseData[i] = Math.random() * 2 - 1;

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);

    // 2. The "Body" - Low frequency triangle sweep
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);

    oscGain.gain.setValueAtTime(0.8, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    // 3. Resonant Filter (The "Bunker" feel)
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.Q.setValueAtTime(5, now);

    // Connections
    noiseSource.connect(noiseGain);
    osc.connect(oscGain);

    noiseGain.connect(filter);
    oscGain.connect(filter);

    filter.connect(audioCtx.destination);

    noiseSource.start(now);
    osc.start(now);
    noiseSource.stop(now + 0.1);
    osc.stop(now + 0.2);
};

/**
 * Procedural "Reject" Sound: A harsh, ripping paper/ink rejection.
 */
export const playRejectSound = () => {
    const now = audioCtx.currentTime;

    // 1. The "Tear" - White Noise Burst
    const bufferSize = audioCtx.sampleRate * 0.15; // 150ms
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    // 2. The "Tone" - Harsh Sawtooth
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(60, now);

    const oscGain = audioCtx.createGain();
    oscGain.gain.setValueAtTime(0.3, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    // Filter to make it sound "papery" / thin
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(400, now);

    // Connections
    noise.connect(noiseGain);
    osc.connect(oscGain);

    noiseGain.connect(filter);
    oscGain.connect(filter);

    filter.connect(audioCtx.destination);

    noise.start(now);
    osc.start(now);

    noise.stop(now + 0.2);
    osc.stop(now + 0.25);
};
