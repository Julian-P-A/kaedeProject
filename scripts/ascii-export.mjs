#!/usr/bin/env node
/**
 * Bakes a video into a tiny "ASCII-ready" clip for <AsciiVideo />: background
 * removed, zoom applied and scaled so each pixel is one character. The browser
 * then only maps pixel brightness to a character, with no keying or scaling.
 * Writes <output>.webm (VP9, smallest) and <output>.mp4 (H.264, Safari fallback).
 *
 * Usage:
 *   node scripts/ascii-export.mjs <input> <output-without-extension> [options]
 *
 * Options (match the values from the ASCII playground):
 *   --cols 200        characters per row (rows follow the aspect ratio)
 *   --fps 25          output frame rate; frames are interpolated when the source has fewer
 *   --speed 1         bake slow/fast motion into the clip (0.5 = half speed). Unlike the
 *                     component's `speed` prop, slow motion stays smooth because the
 *                     missing in-between frames are generated here.
 *   --zoom 1          1 = whole frame, 2 = twice as close
 *   --aspect          width/height of the crop (e.g. 1.333 for 4:3); default: the source's
 *   --focusX 0.5      zoom focus point, 0–1 across the frame
 *   --focusY 0.5
 *   --mode luminance  `luminance` or `saturation` (colorful subject on a pale background)
 *   --threshold 0.12  values below this become blank
 *   --max 1           values at or above this get the densest character
 *   --invert          dark = dense (light backgrounds keyed by luminance)
 *   --start 0         trim start (seconds)
 *   --duration        trim length (seconds, default: whole video)
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, statSync } from 'node:fs'
import { dirname } from 'node:path'

const [input, output, ...rest] = process.argv.slice(2)
if (!input || !output) {
  console.error('Usage: node scripts/ascii-export.mjs <input> <output-without-extension> [--cols 200] [--fps 25] ...')
  process.exit(1)
}

const opts = { cols: 200, fps: 0, zoom: 1, focusX: 0.5, focusY: 0.5, mode: 'luminance', threshold: 0.12, max: 1, speed: 1, aspect: 0, invert: false, start: 0, duration: 0 }
for (let i = 0; i < rest.length; i++) {
  const key = rest[i].replace(/^--/, '')
  if (key === 'invert') opts.invert = true
  else if (key === 'mode') opts.mode = rest[++i]
  else opts[key] = Number(rest[++i])
}

const probe = spawnSync('ffprobe', [
  '-v', 'error', '-select_streams', 'v:0',
  '-show_entries', 'stream=width,height,r_frame_rate', '-of', 'csv=p=0', input,
])
const [w, h, rate] = probe.stdout.toString().trim().split(',')
if (!Number(w) || !Number(h)) {
  console.error('Could not read video size. Is ffmpeg installed?')
  process.exit(1)
}
const [num, den] = rate.split('/').map(Number)
const sourceFps = num / (den || 1)
const fps = opts.fps || Math.round(sourceFps)
const speed = opts.speed > 0 ? opts.speed : 1
// Source frames per output second once the speed change is applied.
const effectiveFps = sourceFps * speed

// A monospace cell is ~0.6 wide per 1 tall, so fewer rows than a square grid.
// Codecs need even dimensions.
const even = (n) => Math.max(2, Math.round(n / 2) * 2)
const zoom = Math.max(1, opts.zoom)
const aspect = opts.aspect || Number(w) / Number(h)
// Zoom sets the crop height; the crop width follows the aspect, capped at the frame.
const cropW = Math.min(Number(w), (Number(h) / zoom) * aspect)
const cropH = cropW / aspect
const cols = even(opts.cols)
const rows = even((cropH / cropW) * cols * 0.6)

const crop = `crop=${Math.round(cropW)}:${Math.round(cropH)}:` +
  `'clip(${opts.focusX}*iw-ow/2,0,iw-ow)':'clip(${opts.focusY}*ih-oh/2,0,ih-oh)'`

const R = 'r(X,Y)', G = 'g(X,Y)', B = 'b(X,Y)'
const hi = `max(max(${R},${G}),${B})`
const value = opts.mode === 'saturation'
  ? `(${hi}-min(min(${R},${G}),${B}))/max(${hi},1)`
  : `(0.299*${R}+0.587*${G}+0.114*${B})/255`
const v = opts.invert ? `(1-${value})` : value
const level = `clip((${v}-${opts.threshold})/(${opts.max}-${opts.threshold}),0,1)*255`

const filters = [
  crop,
  // setsar=1 keeps one pixel = one character; otherwise browsers stretch the
  // clip back to the source aspect ratio and report extra rows.
  `scale=${cols}:${rows}:flags=area`,
  'setsar=1',
  'format=gbrp',
  `geq=r='${level}':g='${level}':b='${level}'`,
  ...(speed !== 1 ? [`setpts=PTS/${speed}`] : []),
  fps > effectiveFps ? `minterpolate=fps=${fps}:mi_mode=mci` : `fps=${fps}`,
  'format=yuv420p',
].join(',')

const trim = ['-ss', String(opts.start), ...(opts.duration ? ['-t', String(opts.duration)] : [])]
const encoders = {
  webm: ['-c:v', 'libvpx-vp9', '-crf', '40', '-b:v', '0', '-row-mt', '1'],
  mp4: ['-c:v', 'libx264', '-crf', '23', '-preset', 'veryslow', '-tune', 'animation', '-movflags', '+faststart'],
}

mkdirSync(dirname(output), { recursive: true })
for (const [ext, codec] of Object.entries(encoders)) {
  const file = `${output}.${ext}`
  const ff = spawnSync('ffmpeg', ['-v', 'error', '-y', ...trim, '-i', input, '-an', '-vf', filters, ...codec, file])
  if (ff.status !== 0) {
    console.error(ff.stderr.toString())
    process.exit(1)
  }
  console.log(`${file} · ${cols}×${rows} chars · ${fps} fps · ${(statSync(file).size / 1024).toFixed(0)} KB`)
}
