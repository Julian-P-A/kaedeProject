# Process images

User-provided images:

- `meeting.webp`: Elixir Parfum / Kaede Project meeting, from `reunion_elixir_kaede_1280x1440.png`. Used for Discover.
- `design-figma.webp`: Figma workspace, from `figma_recorte_8x9_1280x1440.png`. Used for Design.

Illustrative photographs, used under the Unsplash License: https://unsplash.com/license

- `discover.webp`: Headway, https://unsplash.com/photos/5QgIuuBxKwM
- `define.webp`: Kelly Sikkema, https://unsplash.com/photos/v9FQR4tbIq8. Previously used for Design, now used for Define.
- `build.webp`: Nubelson Fernandes, https://unsplash.com/photos/UcYBL5V0xWQ

The ASCII layers are exported ahead of time from these photographs into
`public/ascii/rendered/process-*.webp` with `scripts/export-ascii.py`.
The browser displays the exported images and applies the shared crop and mask.
