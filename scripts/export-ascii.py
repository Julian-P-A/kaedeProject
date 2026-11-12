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
# Match the former canvas: 6 CSS px type, rendered at Retina resolution.
# Layout size, character density and encoded resolution are separate values.
CELL_SIZE = 6
CELL_ASPECT = 0.6
RENDER_SCALE = 2
VIDEO_CRF = 12
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
    for path in ['/System/Library/Fonts/SFNSMono.ttf', '/System/Library/Fonts/Menlo.ttc', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf']:
        if Path(path).exists():
            return path
    raise SystemExit('Pass --font with the path to a monospace TrueType font.')


def load_font(path=None, scale=RENDER_SCALE):
    font = ImageFont.truetype(path or font_path(), CELL_SIZE * scale)
    font.ascii_browser_glyphs = path is None
    # SF Mono's variable-font default is Light. CSS ui-monospace uses Regular;
    # using Light here makes the exported artwork substantially darker.
    try:
        if b'Regular' in font.get_variation_names():
            font.set_variation_by_name(b'Regular')
    except OSError:
        pass  # Static fonts (Menlo, DejaVu) have no variation names.
    return font


def glyph_mask(char, font, width, height, scale):
    atlas_path = ROOT / f'scripts/ascii-glyphs/{scale}.png'
    if getattr(font, 'ascii_browser_glyphs', False):
        # These alpha masks come from the original browser renderer. FreeType
        # alone produces thinner strokes, making the same #f5f5f5 ink look grey.
        with Image.open(atlas_path) as atlas:
            tile = atlas.height
            index = RAMP.strip().index(char)
            alpha = atlas.getchannel('A').crop((index * tile, 0, (index + 1) * tile, tile))
        left, top = (tile - width) // 2, (tile - height) // 2
        return np.asarray(alpha.crop((left, top, left + width, top + height))).copy()
    tile = Image.new('L', (width, height))
    ImageDraw.Draw(tile).text((width / 2, height / 2), char, font=font, anchor='mm', fill=255)
    return np.asarray(tile).copy()


class GlyphRenderer:
    def __init__(self, width, height, font, scale=RENDER_SCALE, cols=None):
        self.width, self.height = width * scale, height * scale
        target_cols = cols or max(1, math.floor(width / (CELL_SIZE * CELL_ASPECT)))
        logical_cell_w = max(1, math.ceil(width / target_cols))
        self.cell_w = logical_cell_w * scale
        self.cell_h = max(CELL_SIZE, round(logical_cell_w / CELL_ASPECT)) * scale
        self.cols = max(1, math.floor(self.width / self.cell_w))
        self.rows = math.ceil(self.height / self.cell_h)
        self.offset_x = (self.width - self.cols * self.cell_w) // 2
        glyphs = []
        for char in RAMP.strip():
            glyphs.append(glyph_mask(char, font, self.cell_w, self.cell_h, scale))
        glyphs.sort(key=lambda tile: tile.sum())
        tones = np.power(np.clip(((np.arange(256) - 8) / 247 - 0.5) * 1.16 + 0.5, 0, 1), 0.9)
        indices = np.minimum(len(glyphs) - 1, (np.sqrt(tones) * len(glyphs)).astype(int))
        self.atlas = (np.array(glyphs)[indices] * tones[:, None, None] * (245 / 255)).astype(np.uint8)
        self.atlas[:8] = 0
        y, x = np.mgrid[:self.rows, :self.cols]
        noise = np.mod(np.sin(x * 127.1 + y * 311.7) * 43758.5453, 1)
        distance = (0.015 + noise * 0.055) * self.width
        self.scatter_x = (x * self.cell_w - self.width / 2) * 0.22 + np.cos(noise * math.tau) * distance
        self.scatter_y = (y * self.cell_h - self.height / 2) * 0.22 + np.sin(noise * math.tau) * distance
        self.x, self.y = self.offset_x + x * self.cell_w, y * self.cell_h

    def sample(self, frame):
        values = np.asarray(Image.fromarray(frame).resize((self.cols, self.rows), Image.Resampling.LANCZOS), dtype=np.float32)
        padded = np.pad(values, 1, mode='edge')
        neighbours = (padded[1:-1, :-2] + padded[1:-1, 2:] + padded[:-2, 1:-1] + padded[2:, 1:-1]) / 4
        sharpened = np.clip(np.rint(values + (values - neighbours) * 0.45), 0, 255).astype(np.uint8)
        # The original renderer left near-black cells empty before sharpening.
        return np.where(values < 8, 0, sharpened).astype(np.uint8)

    def render(self, values, spread=0):
        tiles = self.atlas[values]
        if spread < 0.00001:
            grid = tiles.transpose(0, 2, 1, 3).reshape(self.rows * self.cell_h, self.cols * self.cell_w)
            output = np.zeros((self.height, self.width), dtype=np.uint8)
            output[:, self.offset_x:self.offset_x + grid.shape[1]] = grid[:self.height]
            return output
        # All displaced glyph positions are baked into the file as well.
        x = np.rint(self.x + self.scatter_x * spread).astype(int)[..., None, None] + np.arange(self.cell_w)[None, None, None, :]
        y = np.rint(self.y + self.scatter_y * spread).astype(int)[..., None, None] + np.arange(self.cell_h)[None, None, :, None]
        x, y = np.broadcast_arrays(x, y)
        valid = (x >= 0) & (x < self.width) & (y >= 0) & (y < self.height) & (tiles > 0)
        output = np.zeros((self.height, self.width), dtype=np.uint8)
        np.maximum.at(output, (y[valid], x[valid]), tiles[valid])
        return output


def smooth(value):
    value = max(0, min(1, value))
    return value * value * (3 - 2 * value)


def encode_frames(frames, output, width, height, fps, seekable=False, keyframe_interval=None):
    output.parent.mkdir(parents=True, exist_ok=True)
    # H.264 is decoded natively on iPhone. Short GOPs keep reverse scrubbing
    # responsive without the download cost of making every frame a keyframe.
    gop = keyframe_interval or (6 if seekable else round(fps * 2))
    with tempfile.TemporaryDirectory(prefix='kaede-ascii-') as directory:
        temp = Path(directory) / 'render.mp4'
        command = ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', f'{width}x{height}', '-r', str(fps), '-i', '-', '-an',
                   '-c:v', 'libx264', '-preset', 'slow', '-tune', 'psnr', '-crf', str(VIDEO_CRF), '-pix_fmt', 'yuv420p', '-g', str(gop), '-keyint_min', str(gop), '-sc_threshold', '0', '-bf', '0', '-movflags', '+faststart', str(temp)]
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


def export_video(source, output, width, height, font, transition=None, scale=RENDER_SCALE, fps=FPS, cols=None, keyframe_interval=None):
    info = json.loads(run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', str(source)]))['streams'][0]
    raw = run(['ffmpeg', '-v', 'error', '-i', str(source), '-vf', f'fps={fps}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'])
    frames = np.frombuffer(raw, dtype=np.uint8).reshape(-1, info['height'], info['width'])
    source_limit = round(info['width'] * 1.5)
    target_cols = cols or min(source_limit, max(1, math.floor(width / (CELL_SIZE * CELL_ASPECT))))
    renderer = GlyphRenderer(width, height, font, scale, target_cols)
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
    encode_frames(rendered(), output, renderer.width, renderer.height, fps, bool(transition), keyframe_interval)


def export_photos(font, scale=RENDER_SCALE):
    for source in (ROOT / 'public/process').glob('*.webp'):
        photo = Image.open(source).convert('L')
        width, height = 960, round(photo.height * 960 / photo.width)
        renderer = GlyphRenderer(width, height, font, scale)
        values = np.asarray(photo.resize((renderer.cols, renderer.rows), Image.Resampling.LANCZOS), dtype=np.float32)
        # Match the original photograph's density, with transparent empty cells.
        values = np.clip((values / 255 - 0.12) * 1.35, 0, 1)
        atlas = []
        for level in range(64):
            tile = np.zeros((renderer.cell_h, renderer.cell_w), dtype=np.uint8)
            if level:
                glyph = RAMP[min(len(RAMP) - 1, math.ceil(level / 63 * (len(RAMP) - 1)))]
                mask = glyph_mask(glyph, font, renderer.cell_w, renderer.cell_h, scale)
                tile = np.rint(mask * (level / 63) ** 0.7).astype(np.uint8)
            atlas.append(tile)
        renderer.atlas = np.array(atlas)
        alpha = renderer.render(np.rint(values * 63).astype(int))
        image = Image.new('RGBA', (renderer.width, renderer.height), (245, 245, 245, 0))
        image.putalpha(Image.fromarray(alpha))
        target = DEST / f'process-{source.stem}.webp'
        image.save(target, lossless=True, method=6)
        print(f'{target.relative_to(ROOT)}: {target.stat().st_size / 1024:.0f} KiB', flush=True)


def export_fire(font, scale=RENDER_SCALE):
    width, height, fps, count = 1440, 180, 12, 120
    renderer = GlyphRenderer(width, height, font, scale)
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
    encode_frames(iter(frames), DEST / 'fire', renderer.width, renderer.height, fps)


def export_field(font, scale=RENDER_SCALE):
    renderer = GlyphRenderer(720, 360, font, scale)
    y, x = np.mgrid[:renderer.rows, :renderer.cols]
    noise = np.random.default_rng(41).random((renderer.rows, renderer.cols))
    frames = []
    for i in range(96):
        phase = i / 96 * math.tau
        wave = np.sin(x * 0.18 + phase) * 0.5 + np.sin(y * 0.35 - phase + x * 0.05) * 0.5
        values = np.clip((wave + 1) / 2 + (noise - 0.5) * 0.6, 0, 1)
        frames.append(renderer.render(np.rint(values * 255).astype(np.uint8)))
    Image.fromarray(frames[0]).save(DEST / 'field.webp', lossless=True, method=6)
    encode_frames(iter(frames), DEST / 'field', renderer.width, renderer.height, 12)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--only', choices=[*SPECS, 'photos', 'fire', 'field'])
    parser.add_argument('--font')
    parser.add_argument('--input', type=Path)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--width', type=int, default=720)
    parser.add_argument('--scale', type=int, choices=[1, 2, 3], default=RENDER_SCALE, help='Raster resolution per layout pixel; does not change glyph density')
    parser.add_argument('--fps', type=float, default=FPS)
    parser.add_argument('--cols', type=int, help='Explicit character count for a prepared luminance map')
    parser.add_argument('--keyframe-interval', type=int)
    args = parser.parse_args()
    if args.width < 2 or args.width % 2 or args.fps <= 0 or (args.cols is not None and args.cols < 1) or (args.keyframe_interval is not None and args.keyframe_interval < 1):
        parser.error('Use a positive even width, positive fps, cols and keyframe interval')
    font = load_font(args.font, args.scale)
    DEST.mkdir(parents=True, exist_ok=True)
    if args.input:
        if not args.output:
            parser.error('--input requires --output')
        info = json.loads(run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', str(args.input)]))['streams'][0]
        height = 2 * round(args.width * info['height'] / info['width'] / 0.6 / 2)
        export_video(args.input, args.output.resolve(), args.width, height, font, scale=args.scale, fps=args.fps, cols=args.cols, keyframe_interval=args.keyframe_interval)
        return
    for name, (width, height, mobile_width, mobile_height, transition) in SPECS.items():
        if args.only and args.only != name:
            continue
        source = ROOT / f'public/ascii/{name}.mp4'
        export_video(source, DEST / name, width, height, font, transition, args.scale, args.fps)
        export_video(source, DEST / f'{name}-mobile', mobile_width, mobile_height, font, transition, args.scale, args.fps)
    if args.only in (None, 'photos'):
        export_photos(font, args.scale)
    if args.only in (None, 'fire'):
        export_fire(font, args.scale)
    if args.only in (None, 'field'):
        export_field(font, args.scale)


if __name__ == '__main__':
    main()
