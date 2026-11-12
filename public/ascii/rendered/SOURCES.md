# Finished ASCII media

All files here contain the finished ASCII pixels. The application displays
native MP4 video and WebP images; it never converts luminance to characters.

Regenerate from the original luminance clips in the parent directory and the
photographs in `public/process`:

```sh
python3 -m pip install -r scripts/requirements-ascii.txt
npm run export:ascii
```

FFmpeg with libx264 and a monospace font are also required. By default the
exporter uses the checked-in browser glyph masks in `scripts/ascii-glyphs`,
preserving the original canvas's antialiasing and white highlight coverage.
FreeType alone renders thinner strokes and darker highlights at the same size.
`--font /path/to/font.ttf` selects an explicit font rendered through Pillow.
Production uses the checked-in media and needs none of these dependencies.

The export preserves the former canvas's 6 px type, tone ramp and local
sharpening. Layout dimensions in `SPECS` are separate from raster resolution:
`--scale 2` renders glyphs directly at twice the layout dimensions, with
antialiasing, instead of enlarging a low-resolution image. Character density
does not change with scale. Ink stays at the original `#f5f5f5`; the baked masks
preserve its visible brightness. H.264 uses CRF 12 with distortion-based encoding
(`psnr`) to preserve the fine glyph edges; WebP posters and photo layers are
lossless. The higher-resolution videos are larger than the previous exports.

- `creation*.mp4`, `faq-book*.mp4`: the existing clips, rendered as complete
  ASCII video at 30 fps. Each has a matching exported WebP poster.
- `web-architecture*`, `ai-bust*`, `automation-gears*`, `crm-hands*`: existing
  service clips plus baked entry/exit glyph dispersion. Scroll seeks inside
  this finished sequence. Keyframes every six frames support reverse seeking.
- `*-mobile.*`: separate Retina exports with fewer glyphs and smaller dimensions.
  Phones request these instead of the desktop video.
- `process-*.webp`: transparent ASCII layers from the corresponding original
  photographs, aligned using the same image crop in CSS.
- `fire.*`, `field.*`: decorative loops rendered offline with fixed seeds.

`src/data/ascii.ts` records the dimensions and frame rates used by the player.
These are the encoded pixel dimensions, not the layout sizes in `SPECS`.
The optional `scripts/ascii-export.mjs` input pipeline uses a lossless FFV1
intermediate and forwards FPS, column count and keyframe settings to the final
renderer, avoiding a second lossy compression before glyph generation.

Verify the export quality and custom-input pipeline with:

```sh
python3 -m unittest discover -s tests -p 'test_ascii_export.py' -v
```

Source luminance videos are retained for regeneration and are never requested
by the application. To roll back, revert the player/asset commit; sources and
the preceding deployment remain intact.
