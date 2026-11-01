// All sound is synthesised, so there is nothing to download or cache. Every cue
// is identical for every player: audio must never reveal who is the Imposter.
const STORAGE_KEY = 'imposter_sound'

let enabled = readEnabled()
let ctx = null
let master = null
let noise = null
let ambient = null

function readEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

function audio() {
  if (!enabled) return null
  const Context = window.AudioContext ?? window.webkitAudioContext
  if (!Context) return null
  if (!ctx) {
    ctx = new Context()
    master = ctx.createGain()
    master.gain.value = 0.7
    master.connect(ctx.destination)
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const samples = noise.getChannelData(0)
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function burst({ freq, to = freq, q = 1, type = 'bandpass', gain, dur, delay = 0 }) {
  const ac = audio()
  if (!ac) return
  const start = ac.currentTime + delay
  const source = ac.createBufferSource()
  source.buffer = noise
  const filter = ac.createBiquadFilter()
  filter.type = type
  filter.Q.value = q
  filter.frequency.setValueAtTime(freq, start)
  filter.frequency.exponentialRampToValueAtTime(to, start + dur)
  const env = ac.createGain()
  env.gain.setValueAtTime(gain, start)
  env.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  source.connect(filter).connect(env).connect(master)
  source.start(start, Math.random() * 0.8, dur + 0.02)
}

function thump({ freq, to, gain, dur, delay = 0 }) {
  const ac = audio()
  if (!ac) return
  const start = ac.currentTime + delay
  const osc = ac.createOscillator()
  osc.frequency.setValueAtTime(freq, start)
  osc.frequency.exponentialRampToValueAtTime(to, start + dur)
  const env = ac.createGain()
  env.gain.setValueAtTime(gain, start)
  env.gain.exponentialRampToValueAtTime(0.0001, start + dur)
  osc.connect(env).connect(master)
  osc.start(start)
  osc.stop(start + dur + 0.02)
}

function buzz(pattern) {
  if (enabled) navigator.vibrate?.(pattern)
}

export const sfx = {
  key() {
    burst({ freq: 2600, q: 3, gain: 0.05, dur: 0.028 })
    thump({ freq: 240, to: 120, gain: 0.03, dur: 0.03 })
  },
  stamp() {
    thump({ freq: 150, to: 44, gain: 0.5, dur: 0.16 })
    burst({ freq: 900, to: 220, type: 'lowpass', gain: 0.32, dur: 0.09 })
    burst({ freq: 2400, q: 2, gain: 0.07, dur: 0.03, delay: 0.09 })
    buzz(28)
  },
  paper() {
    burst({ freq: 1200, to: 4600, q: 0.7, gain: 0.07, dur: 0.24 })
  },
  clack() {
    burst({ freq: 3400, q: 5, gain: 0.14, dur: 0.018 })
    thump({ freq: 420, to: 150, gain: 0.14, dur: 0.05 })
    buzz(10)
  },
  detent() {
    burst({ freq: 4200, q: 8, gain: 0.08, dur: 0.012 })
    buzz(4)
  },
  peel() {
    burst({ freq: 2200, to: 7000, q: 1.2, gain: 0.05, dur: 0.16 })
  },
}

// Room tone: mains hum plus air, right at the edge of hearing.
function startAmbient() {
  const ac = audio()
  if (!ac || ambient) return
  const out = ac.createGain()
  out.gain.setValueAtTime(0, ac.currentTime)
  out.gain.linearRampToValueAtTime(0.05, ac.currentTime + 2.5)
  out.connect(master)

  const air = ac.createBufferSource()
  air.buffer = noise
  air.loop = true
  const airFilter = ac.createBiquadFilter()
  airFilter.type = 'lowpass'
  airFilter.frequency.value = 320
  air.connect(airFilter).connect(out)
  air.start()

  const hum = ac.createOscillator()
  hum.frequency.value = 60
  const humGain = ac.createGain()
  humGain.gain.value = 0.16
  hum.connect(humGain).connect(out)
  hum.start()

  ambient = { out, air, hum }
}

function stopAmbient() {
  if (!ambient) return
  ambient.air.stop()
  ambient.hum.stop()
  ambient.out.disconnect()
  ambient = null
}

export { startAmbient }

export function isSoundEnabled() {
  return enabled
}

export function setSoundEnabled(next) {
  enabled = next
  try {
    localStorage.setItem(STORAGE_KEY, String(next))
  } catch {
    // Private windows can refuse storage; the choice still holds for this session.
  }
  if (next) startAmbient()
  else stopAmbient()
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return
    if (document.hidden) ctx.suspend()
    else if (enabled) ctx.resume()
  })
}
