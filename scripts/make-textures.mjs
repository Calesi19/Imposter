// Bakes the dossier's paper, desk and ink textures into src/assets/textures.
// Static tiles instead of live SVG filters: they cost one decode, not a
// feTurbulence raster on every mid-range phone.
// Run with: node scripts/make-textures.mjs (requires cwebp on PATH)
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const OUT = new URL('../src/assets/textures/', import.meta.url).pathname
const TMP = join(tmpdir(), `imposter-textures-${process.pid}`)
mkdirSync(TMP, { recursive: true })
mkdirSync(OUT, { recursive: true })

// Seeded so re-running the script produces byte-identical assets.
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Periodic value noise: lattice wraps at `cellsX`/`cellsY`, so tiles repeat seamlessly.
function lattice(cellsX, cellsY, seed) {
  const rand = rng(seed)
  const grid = new Float32Array(cellsX * cellsY).map(() => rand())
  const smooth = t => t * t * (3 - 2 * t)
  return (u, v) => {
    const x = u * cellsX
    const y = v * cellsY
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const fx = smooth(x - x0)
    const fy = smooth(y - y0)
    const at = (i, j) => grid[((j % cellsY) + cellsY) % cellsY * cellsX + ((i % cellsX) + cellsX) % cellsX]
    const top = at(x0, y0) * (1 - fx) + at(x0 + 1, y0) * fx
    const bottom = at(x0, y0 + 1) * (1 - fx) + at(x0 + 1, y0 + 1) * fx
    return top * (1 - fy) + bottom * fy
  }
}

function fbm(cellsX, cellsY, octaves, seed) {
  const layers = Array.from({ length: octaves }, (_, i) => lattice(cellsX << i, cellsY << i, seed + i * 97))
  return (u, v) => {
    let sum = 0
    let amp = 0.5
    let norm = 0
    for (const layer of layers) {
      sum += layer(u, v) * amp
      norm += amp
      amp /= 2
    }
    return sum / norm
  }
}

function writeWebp(name, w, h, pixel, { alpha = false, quality = 84 } = {}) {
  const depth = alpha ? 4 : 3
  const data = Buffer.alloc(w * h * depth)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const out = pixel(x / w, y / h, x, y)
      const i = (y * w + x) * depth
      for (let c = 0; c < depth; c++) data[i + c] = Math.max(0, Math.min(255, Math.round(out[c])))
    }
  }
  const header = `P7\nWIDTH ${w}\nHEIGHT ${h}\nDEPTH ${depth}\nMAXVAL 255\nTUPLTYPE ${alpha ? 'RGB_ALPHA' : 'RGB'}\nENDHDR\n`
  const pam = join(TMP, `${name}.pam`)
  writeFileSync(pam, Buffer.concat([Buffer.from(header), data]))
  execFileSync('cwebp', ['-quiet', '-q', String(quality), '-alpha_q', '100', pam, '-o', join(OUT, `${name}.webp`)])
}

const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)

// Long fibres (stretched noise), slow blotches and foxing specks shared by paper stocks.
function stock(base, shade, seed) {
  const blotch = fbm(3, 3, 4, seed)
  const fibreA = fbm(4, 48, 3, seed + 11)
  const fibreB = fbm(48, 4, 3, seed + 23)
  const grain = lattice(256, 256, seed + 37)
  const fox = fbm(14, 14, 3, seed + 53)
  return u => {
    const [x, y] = u
    const tone = (blotch(x, y) - 0.5) * 0.7
    const fibre = (fibreA(x, y) + fibreB(x, y) - 1) * 0.5
    const fine = grain(x, y) - 0.5
    const c = mix(base, shade, Math.max(0, Math.min(1, 0.3 + tone + fibre * 0.7)))
    const spot = fox(x, y) > 0.7 ? (fox(x, y) - 0.7) * 2.2 : 0
    return mix(c, shade, spot).map(v => v + fine * 15)
  }
}

const paper = stock([235, 225, 201], [205, 188, 150], 4)
writeWebp('paper', 512, 512, (u, v) => paper([u, v]))

const manila = stock([207, 174, 113], [165, 130, 72], 19)
writeWebp('manila', 512, 512, (u, v) => manila([u, v]))

// Pebbled desk leather: cellular-feeling noise pushed dark, with slow wear patches.
{
  const pebble = fbm(29, 37, 4, 71)
  const wear = fbm(3, 3, 4, 83)
  const grain = lattice(256, 256, 91)
  writeWebp('desk', 512, 512, (u, v) => {
    const p = Math.abs(pebble(u, v) - 0.5) * 2
    const w = wear(u, v)
    const value = 17 + p * 9 + (w - 0.5) * 14 + (grain(u, v) - 0.5) * 6
    return [value * 1.14, value * 1.0, value * 0.86]
  })
}

// Hammered olive enamel for the console plate.
{
  const hammer = fbm(20, 20, 3, 101)
  const grain = lattice(256, 256, 113)
  writeWebp('steel', 256, 256, (u, v) => {
    const h = (hammer(u, v) - 0.5) * 34
    const g = (grain(u, v) - 0.5) * 9
    return [64 + h + g, 67 + h + g, 45 + h * 0.8 + g]
  })
}

// Rubber stamps never ink evenly: alpha holes where the pad ran dry.
{
  const patch = fbm(9, 5, 3, 131)
  const speck = lattice(240, 120, 149)
  const pores = lattice(90, 45, 157)
  writeWebp('stamp-ink', 480, 240, (u, v) => {
    const dry = patch(u, v)
    const hole = speck(u, v) < 0.07 + Math.max(0, dry - 0.56) * 1.1 || pores(u, v) < 0.03
    const faded = 255 - Math.max(0, dry - 0.5) * 170
    return [0, 0, 0, hole ? 0 : faded]
  }, { alpha: true, quality: 40 })
}

// A single coffee ring with a drip, for the desk and paper corners.
{
  const edge = fbm(6, 6, 4, 173)
  const stain = fbm(5, 5, 3, 181)
  const size = 420
  writeWebp('coffee-ring', size, size, (u, v) => {
    const dx = u - 0.5
    const dy = v - 0.5
    const r = Math.hypot(dx, dy) * 2
    const wobble = (edge(u, v) - 0.5) * 0.07
    const d = Math.abs(r - (0.78 + wobble))
    const line = Math.max(0, 1 - d / 0.022)
    const halo = Math.max(0, 1 - d / 0.1) * 0.28
    const pool = r < 0.78 + wobble ? 0.07 + stain(u, v) * 0.13 : 0
    const dropout = 0.55 + edge(1 - u, v) * 0.9
    const alpha = Math.min(1, (line * 0.8 + halo) * dropout + pool)
    return [84, 52, 24, alpha * 215]
  }, { alpha: true, quality: 50 })
}

rmSync(TMP, { recursive: true, force: true })
