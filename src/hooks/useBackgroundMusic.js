import { useEffect, useRef } from 'react'

// ── Romantic ambient music via Web Audio API ──────────────────────
// Melody: gentle arpeggio in A minor — E4 C4 A3 G3 / A4 G4 E4 C4
// Bass: A2 / C3 alternating every 4 notes
// Colour: warm low-pass filter + impulse reverb

const MELODY = [
  329.63,  // E4
  261.63,  // C4
  220.00,  // A3
  196.00,  // G3
  440.00,  // A4
  392.00,  // G4
  329.63,  // E4
  261.63,  // C4
]
const BASS = [110.00, 130.81]   // A2, C3
const BPM = 66
const NOTE_DUR = 60 / BPM        // ≈ 0.91 s
const SCHEDULE_AHEAD = 0.20      // schedule 200 ms ahead
const MASTER_GAIN = 0.55         // applied on top of user volume

// ── Reverb (impulse response built from noise) ───────────────────
function makeReverb(ctx) {
  const length = Math.floor(ctx.sampleRate * 2.2)
  const buf = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.8)
    }
  }
  const conv = ctx.createConvolver()
  conv.buffer = buf
  return conv
}

// ── Single note scheduler ────────────────────────────────────────
function scheduleNote(ctx, dest, freq, t, dur, peak, type = 'sine') {
  const osc  = ctx.createOscillator()
  const env  = ctx.createGain()
  const filt = ctx.createBiquadFilter()

  osc.type          = type
  osc.frequency.value = freq
  filt.type          = 'lowpass'
  filt.frequency.value = 900   // warm, muffled
  filt.Q.value       = 0.6

  const atk = 0.07
  const rel = 0.30
  env.gain.setValueAtTime(0, t)
  env.gain.linearRampToValueAtTime(peak, t + atk)
  env.gain.setValueAtTime(peak, t + dur - rel)
  env.gain.linearRampToValueAtTime(0, t + dur)

  osc.connect(filt)
  filt.connect(env)
  env.connect(dest)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

// ── Hook ─────────────────────────────────────────────────────────
export function useBackgroundMusic(volume, muted) {
  const volumeRef = useRef(volume)
  const mutedRef  = useRef(muted)

  const r = useRef({
    ctx:       null,
    master:    null,
    reverb:    null,
    noteIdx:   0,
    nextTime:  0,
    timer:     null,
    started:   false,
  })

  // Keep refs in sync
  useEffect(() => { volumeRef.current = volume }, [volume])
  useEffect(() => { mutedRef.current  = muted  }, [muted])

  // React to volume / mute changes after start
  useEffect(() => {
    const { master, ctx } = r.current
    if (!master || !ctx) return
    const target = mutedRef.current ? 0 : volumeRef.current * MASTER_GAIN
    master.gain.setTargetAtTime(target, ctx.currentTime, 0.25)
  }, [volume, muted])

  function tick() {
    const { ctx, master, reverb } = r.current
    if (!ctx) return

    while (r.current.nextTime < ctx.currentTime + SCHEDULE_AHEAD) {
      const idx  = r.current.noteIdx % MELODY.length
      const freq = MELODY[idx]

      // Melody note → reverb → master
      scheduleNote(ctx, reverb, freq, r.current.nextTime, NOTE_DUR * 1.5, 0.07)

      // Bass on every 4th note → directly to master (dry, grounding)
      if (idx % 4 === 0) {
        const bassIdx  = Math.floor(r.current.noteIdx / 4) % BASS.length
        scheduleNote(ctx, master, BASS[bassIdx], r.current.nextTime, NOTE_DUR * 4.8, 0.045)
      }

      r.current.noteIdx++
      r.current.nextTime += NOTE_DUR
    }

    r.current.timer = setTimeout(tick, 50)
  }

  function startAudio() {
    if (r.current.started) {
      // Resume if suspended (browser policy)
      r.current.ctx?.resume()
      return
    }
    r.current.started = true

    try {
      const ctx    = new (window.AudioContext || window.webkitAudioContext)()
      const master = ctx.createGain()
      master.gain.value = mutedRef.current ? 0 : volumeRef.current * MASTER_GAIN
      master.connect(ctx.destination)

      // Reverb bus
      const reverb     = makeReverb(ctx)
      const reverbGain = ctx.createGain()
      reverbGain.gain.value = 0.45
      reverb.connect(reverbGain)
      reverbGain.connect(master)

      r.current.ctx      = ctx
      r.current.master   = master
      r.current.reverb   = reverb
      r.current.nextTime = ctx.currentTime + 0.25

      tick()
    } catch (e) {
      console.warn('Web Audio not available:', e)
    }
  }

  // Start on first user interaction (browser autoplay policy)
  useEffect(() => {
    const onInteract = () => startAudio()
    window.addEventListener('click',   onInteract, { once: true })
    window.addEventListener('keydown', onInteract, { once: true })
    return () => {
      window.removeEventListener('click',   onInteract)
      window.removeEventListener('keydown', onInteract)
    }
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      if (r.current.timer) clearTimeout(r.current.timer)
      r.current.ctx?.close().catch(() => {})
    }
  }, [])
}
