# Original canvas glyphs

The PNG alpha masks preserve the original canvas font rasterization, including
its brighter stroke coverage. Each strip contains `.`, `:`, `*`, `#`, centered
in square tiles twice the font size. `1.png`, `2.png` and `3.png` use 6, 12 and
18 px type respectively. The exporter applies the original #f5f5f5 ink and
tone curve to these masks; there is no character rendering on the website.

Regenerate on macOS (the original `ui-monospace` resolves to Menlo) after
installing the project's development dependencies and Playwright Chromium:

```sh
node scripts/export-ascii-glyphs.mjs
```

`--font` bypasses these masks for custom fonts. The Python tests check highlight
coverage against the original browser measurement (79.47/255 per white # cell
at the default Retina scale), so a thinner or dimmer substitute is detected.
