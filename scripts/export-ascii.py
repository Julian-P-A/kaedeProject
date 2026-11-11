#!/usr/bin/env python3
"""Render final ASCII pixels offline. Requires FFmpeg, Pillow and NumPy.

python3 scripts/export-ascii.py                 # all production media
python3 scripts/export-ascii.py --only creation # one clip and its mobile version
python3 scripts/export-ascii.py --input map.mp4 --output public/ascii/rendered/custom --width 720

The existing public/ascii clips are luminance sources, never final artwork.
Every generated MP4/WebP contains the glyphs; the website only displays media.
"""
import argparse
import json
import math
from pathlib import Path
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public/ascii/rendered'
FPS = 30
CELL_W, CELL_H = 6, 10
RAMP = ' .:*#'
SPECS = {
    'creation': (1440, 810, 720, 406, None),
    'web-architecture': (720, 720, 360, 360, 'first'),
    'ai-bust': (720, 720, 360, 360, 'middle'),
    'automation-gears': (720, 720, 360, 360, 'middle'),
    'crm-hands': (720, 408, 360, 204, 'last'),
    'faq-book': (720, 544, 480, 362, None),
}


def run(args):
    return subprocess.check_output(args)


def font_path():
    for path in ['/System/Library/Fonts/Menlo.ttc', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf']:
        if Path(path).exists():
            return path
    raise SystemExit('Pass --font with the path to a monospace TrueType font.')


class GlyphRenderer:
    def __init__(self, width, height, font):
        self.width, self.height = width, height
        self.cols, self.rows = math.ceil(width / CELL_W), math.ceil(height / CELL_H)
        glyphs = []
        for char in RAMP.strip():
            tile = Image.new('L', (CELL_W, CELL_H))
            ImageDraw.Draw(tile).text((CELL_W / 2, CELL_H / 2), char, font=font, anchor='mm', fill=255)
            glyphs.append(np.asarray(tile).copy())
        glyphs.sort(key=lambda tile: tile.sum())
        tones = np.power(np.clip(((np.arange(256) - 8) / 247 - 0.5) * 1.16 + 0.5, 0, 1), 0.9)
        indices = np.minimum(len(glyphs) - 1, (np.sqrt(tones) * len(glyphs)).astype(int))
        self.atlas = (np.array(glyphs)[indices] * tones[:, None, None] * (245 / 255)).astype(np.uint8)
        self.atlas[:8] = 0
        y, x = np.mgrid[:self.rows, :self.cols]
        noise = np.mod(np.sin(x * 127.1 + y * 311.7) * 43758.5453, 1)
        distance = (0.015 + noise * 0.055) * width
        self.scatter_x = (x * CELL_W - width / 2) * 0.22 + np.cos(noise * math.tau) * distance
        self.scatter_y = (y * CELL_H - height / 2) * 0.22 + np.sin(noise * math.tau) * distance
        self.x, self.y = x * CELL_W, y * CELL_H

    def sample(self, frame):
        values = np.asarray(Image.fromarray(frame).resize((self.cols, self.rows), Image.Resampling.LANCZOS), dtype=np.float32)
        padded = np.pad(values, 1, mode='edge')
        neighbours = (padded[1:-1, :-2] + padded[1:-1, 2:] + padded[:-2, 1:-1] + padded[2:, 1:-1]) / 4
        return np.clip(np.rint(values + (values - neighbours) * 0.45), 0, 255).astype(np.uint8)

    def render(self, values, spread=0):
        tiles = self.atlas[values]
        if spread < 0.00001:
            return tiles.transpose(0, 2, 1, 3).reshape(self.rows * CELL_H, self.cols * CELL_W)[:self.height, :self.width].copy()
        # All displaced glyph positions are baked into the file as well.
        x = np.rint(self.x + self.scatter_x * spread).astype(int)[..., None, None] + np.arange(CELL_W)[None, None, None, :]
        y = np.rint(self.y + self.scatter_y * spread).astype(int)[..., None, None] + np.arange(CELL_H)[None, None, :, None]
        x, y = np.broadcast_arrays(x, y)
        valid = (x >= 0) & (x < self.width) & (y >= 0) & (y < self.height) & (tiles > 0)
        output = np.zeros((self.height, self.width), dtype=np.uint8)
        np.maximum.at(output, (y[valid], x[valid]), tiles[valid])
        return output


def smooth(value):
    value = max(0, min(1, value))
    return value * value * (3 - 2 * value)


def encode_frames(frames, output, width, height, fps, seekable=False):
    output.parent.mkdir(parents=True, exist_ok=True)
    # H.264 is decoded natively on iPhone. Short GOPs keep reverse scrubbing
    # responsive without the download cost of making every frame a keyframe.
    gop = 6 if seekable else fps * 2
    with tempfile.TemporaryDirectory(prefix='kaede-ascii-') as directory:
        temp = Path(directory) / 'render.mp4'
        command = ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', f'{width}x{height}', '-r', str(fps), '-i', '-', '-an',
                   '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-g', str(gop), '-keyint_min', str(gop), '-sc_threshold', '0', '-bf', '0', '-movflags', '+faststart', str(temp)]
        encoder = subprocess.Popen(command, stdin=subprocess.PIPE)
        try:
            for frame in frames:
                encoder.stdin.write(np.ascontiguousarray(frame).tobytes())
            encoder.stdin.close()
            if encoder.wait():
                raise RuntimeError(f'FFmpeg failed for {output}')
            temp.replace(output.with_suffix('.mp4'))
        finally:
            if encoder.poll() is None:
                encoder.kill()
                encoder.wait()
    display = output.relative_to(ROOT) if output.is_relative_to(ROOT) else output
    print(f'{display}.mp4: {width}x{height}, {output.with_suffix(".mp4").stat().st_size / 1024:.0f} KiB', flush=True)


def export_video(source, output, width, height, font, transition=None):
    info = json.loads(run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', str(source)]))['streams'][0]
    raw = run(['ffmpeg', '-v', 'error', '-i', str(source), '-vf', f'fps={FPS}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'])
    frames = np.frombuffer(raw, dtype=np.uint8).reshape(-1, info['height'], info['width'])
    renderer = GlyphRenderer(width, height, font)
    samples = [renderer.sample(frame) for frame in frames]
    poster = renderer.render(samples[len(samples) // 2])
    output.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(poster).save(output.with_suffix('.webp'), lossless=True, method=6)
    if transition:
        start, end = (0 if transition == 'first' else -0.18), (1 if transition == 'last' else 1.18)
        body_start, body_end = (0 if transition == 'first' else 0.18), (1 if transition == 'last' else 0.82)
        count = round(len(samples) * (end - start) / (body_end - body_start))

        def rendered():
            for local in np.linspace(start, end, count):
                progress = max(0, min(1, (local - body_start) / (body_end - body_start)))
                entry = 1 if transition == 'first' else smooth((local + 0.18) / 0.36)
                exit = 1 if transition == 'last' else 1 - smooth((local - 0.82) / 0.36)
                spread = min(1, (1 - entry * exit) * 1.4) ** 1.4
                yield renderer.render(samples[round(progress * (len(samples) - 1))], spread)
    else:
        def rendered():
            for values in samples:
                yield renderer.render(values)
    encode_frames(rendered(), output, width, height, FPS, bool(transition))


def export_photos(font):
    for source in (ROOT / 'public/process').glob('*.webp'):
        photo = Image.open(source).convert('L')
        width, height = 960, round(photo.height * 960 / photo.width)
        renderer = GlyphRenderer(width, height, font)
        values = np.asarray(photo.resize((renderer.cols, renderer.rows), Image.Resampling.LANCZOS), dtype=np.float32)
        # Match the original photograph's density, with transparent empty cells.
        values = np.clip((values / 255 - 0.12) * 1.35, 0, 1)
        atlas = []
        for level in range(64):
            tile = Image.new('L', (CELL_W, CELL_H))
            if level:
                glyph = RAMP[min(len(RAMP) - 1, math.ceil(level / 63 * (len(RAMP) - 1)))]
                ImageDraw.Draw(tile).text((CELL_W / 2, CELL_H / 2), glyph, font=font, anchor='mm', fill=round(255 * (level / 63) ** 0.7))
            atlas.append(np.asarray(tile).copy())
        tiles = np.array(atlas)[np.rint(values * 63).astype(int)]
        alpha = tiles.transpose(0, 2, 1, 3).reshape(renderer.rows * CELL_H, renderer.cols * CELL_W)[:height, :width]
        image = Image.new('RGBA', (width, height), (245, 245, 245, 0))
        image.putalpha(Image.fromarray(alpha))
        target = DEST / f'process-{source.stem}.webp'
        image.save(target, lossless=True, method=6)
        print(f'{target.relative_to(ROOT)}: {target.stat().st_size / 1024:.0f} KiB', flush=True)


def export_fire(font):
    width, height, fps, count = 1440, 180, 12, 120
    renderer = GlyphRenderer(width, height, font)
    rng = np.random.default_rng(7331)
    heat = np.zeros((renderer.rows, renderer.cols))
    decay = 2 / (renderer.rows * 0.75)
    x = np.arange(renderer.cols)

    def step(t):
        wave = np.sin(x * 0.11 + t * 0.5) * 0.5 + np.sin(x * 0.29 - t * 0.3) * 0.5
        heat[-1] = np.clip(0.7 + wave * 0.35 + rng.random(renderer.cols) * 0.15, 0, 1)
        for y in range(1, renderer.rows):
            drift = rng.integers(-1, 2, renderer.cols)
            target = np.clip(x + drift, 0, renderer.cols - 1)
            heat[y - 1, target] = np.maximum(0, heat[y] - (rng.random(renderer.cols) >= 0.5) * decay)
        return renderer.render(np.rint(heat * 255).astype(np.uint8))

    for i in range(renderer.rows * 2):
        step(i / fps)
    frames = [step(i / fps) for i in range(count)]
    # Crossfade the end into the start offline for a clean repeated background.
    for i in range(12):
        alpha = (i + 1) / 12
        frames[-12 + i] = np.rint(frames[-12 + i] * (1 - alpha) + frames[0] * alpha).astype(np.uint8)
    Image.fromarray(frames[0]).save(DEST / 'fire.webp', lossless=True, method=6)
    encode_frames(iter(frames), DEST / 'fire', width, height, fps)


def export_field(font):
    renderer = GlyphRenderer(720, 360, font)
    y, x = np.mgrid[:renderer.rows, :renderer.cols]
    noise = np.random.default_rng(41).random((renderer.rows, renderer.cols))
    frames = []
    for i in range(96):
        phase = i / 96 * math.tau
        wave = np.sin(x * 0.18 + phase) * 0.5 + np.sin(y * 0.35 - phase + x * 0.05) * 0.5
        values = np.clip((wave + 1) / 2 + (noise - 0.5) * 0.6, 0, 1)
        frames.append(renderer.render(np.rint(values * 255).astype(np.uint8)))
    Image.fromarray(frames[0]).save(DEST / 'field.webp', lossless=True, method=6)
    encode_frames(iter(frames), DEST / 'field', 720, 360, 12)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--only', choices=[*SPECS, 'photos', 'fire', 'field'])
    parser.add_argument('--font')
    parser.add_argument('--input', type=Path)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--width', type=int, default=720)
    args = parser.parse_args()
    font = ImageFont.truetype(args.font or font_path(), CELL_H)
    DEST.mkdir(parents=True, exist_ok=True)
    if args.input:
        if not args.output:
            parser.error('--input requires --output')
        info = json.loads(run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', str(args.input)]))['streams'][0]
        height = 2 * round(args.width * info['height'] / info['width'] / 0.6 / 2)
        export_video(args.input, args.output.resolve(), args.width, height, font)
        return
    for name, (width, height, mobile_width, mobile_height, transition) in SPECS.items():
        if args.only and args.only != name:
            continue
        source = ROOT / f'public/ascii/{name}.mp4'
        export_video(source, DEST / name, width, height, font, transition)
        export_video(source, DEST / f'{name}-mobile', mobile_width, mobile_height, font, transition)
    if args.only in (None, 'photos'):
        export_photos(font)
    if args.only in (None, 'fire'):
        export_fire(font)
    if args.only in (None, 'field'):
        export_field(font)


if __name__ == '__main__':
    main()
