# Finished ASCII media

All files here contain the finished ASCII pixels. The application displays
native MP4 video and WebP images; it never converts luminance to characters.

Regenerate from the original luminance clips in the parent directory and the
photographs in `public/process`:

```sh
python3 -m pip install -r scripts/requirements-ascii.txt
npm run export:ascii
```

FFmpeg with libx264 and a monospace font are also required. The exporter uses
Menlo on macOS or DejaVu Sans Mono on Linux; `--font /path/to/font.ttf` selects
an explicit font. Production uses the checked-in media and needs none of these
rendering dependencies.

- `creation*.mp4`, `faq-book*.mp4`: the existing clips, rendered as complete
  ASCII video at 30 fps. Each has a matching exported WebP poster.
- `web-architecture*`, `ai-bust*`, `automation-gears*`, `crm-hands*`: existing
  service clips plus baked entry/exit glyph dispersion. Scroll seeks inside
  this finished sequence. Keyframes every six frames support reverse seeking.
- `*-mobile.*`: separate exports with fewer glyphs and smaller dimensions.
  Phones request these instead of the desktop video.
- `process-*.webp`: transparent ASCII layers from the corresponding original
  photographs, aligned using the same image crop in CSS.
- `fire.*`, `field.*`: decorative loops rendered offline with fixed seeds.

`src/data/ascii.ts` records the dimensions and frame rates used by the player.
Source luminance videos are retained for regeneration and are never requested
by the application. To roll back, revert the player/asset commit; sources and
the preceding deployment remain intact.
