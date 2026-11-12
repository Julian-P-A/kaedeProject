"""Quality checks for the offline renderer (FFmpeg, Pillow and NumPy required)."""
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('ascii_export', ROOT / 'scripts/export-ascii.py')
exporter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(exporter)


class AsciiExportTests(unittest.TestCase):
    def renderer(self, width=720, height=720, scale=2):
        font = exporter.load_font(scale=scale)
        return exporter.GlyphRenderer(width, height, font, scale)

    def test_retina_preserves_character_density_and_adds_raster_detail(self):
        normal, retina = self.renderer(scale=1), self.renderer(scale=2)
        self.assertEqual((normal.cols, normal.rows), (retina.cols, retina.rows))
        # The former export had only 120 columns and 72 rows at this size.
        self.assertGreaterEqual(retina.cols, 180)
        self.assertGreaterEqual(retina.rows, 100)
        frame = retina.render(np.full((retina.rows, retina.cols), 255, dtype=np.uint8))
        self.assertEqual(frame.shape, (1440, 1440))
        self.assertTrue(np.any((frame > 0) & (frame < 245)), 'Glyph edges must retain antialiasing')

    def test_near_black_source_stays_empty(self):
        renderer = self.renderer(160, 96)
        values = renderer.sample(np.full((24, 40), 7, dtype=np.uint8))
        self.assertFalse(np.any(renderer.render(values)))

    def test_brightest_glyph_preserves_ink_contrast(self):
        highlight = self.renderer().atlas[255]
        self.assertGreaterEqual(highlight.max(), 240)
        # The original canvas measures 79.47/255 mean light per white # cell.
        # A thinner FreeType substitute fell to ~50 despite the same ink colour.
        self.assertAlmostEqual(float(highlight.mean()), 79.47, delta=2)

    def test_encoded_video_retains_fine_glyphs(self):
        renderer = self.renderer(160, 96)
        rng = np.random.default_rng(17)
        values = rng.integers(0, 256, (renderer.rows, renderer.cols), dtype=np.uint8)
        frame = renderer.render(values)
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'quality'
            exporter.encode_frames(iter([frame] * 3), output, renderer.width, renderer.height, 24)
            raw = exporter.run(['ffmpeg', '-v', 'error', '-i', str(output.with_suffix('.mp4')),
                                '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'])
            decoded = np.frombuffer(raw, dtype=np.uint8).reshape(frame.shape)
            mse = np.mean((frame.astype(float) - decoded.astype(float)) ** 2)
            psnr = 10 * np.log10(255 ** 2 / max(mse, 1e-9))
            self.assertGreater(psnr, 42, f'Fine glyphs lost detail: {psnr:.2f} dB')

    def test_js_export_keeps_requested_fps_columns_and_keyframes(self):
        with tempfile.TemporaryDirectory() as directory:
            source, output = Path(directory) / 'source.mkv', Path(directory) / 'custom'
            subprocess.run(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', 'testsrc2=size=160x96:rate=24',
                            '-t', '0.5', '-c:v', 'ffv1', str(source)], check=True)
            subprocess.run(['node', str(ROOT / 'scripts/ascii-export.mjs'), str(source), str(output),
                            '--cols', '40', '--fps', '12', '--keyframeInterval', '1'], check=True)
            info = json.loads(exporter.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0',
                                           '-show_entries', 'stream=width,avg_frame_rate,nb_frames:frame=key_frame',
                                           '-of', 'json', str(output.with_suffix('.mp4'))]))
            self.assertEqual(info['streams'][0]['avg_frame_rate'], '12/1')
            self.assertEqual(info['streams'][0]['nb_frames'], '6')
            self.assertEqual(info['streams'][0]['width'], 320)
            self.assertTrue(all(frame['key_frame'] for frame in info['frames']))
            with Image.open(output.with_suffix('.webp')) as poster:
                self.assertEqual(poster.width, 320)


if __name__ == '__main__':
    unittest.main()
