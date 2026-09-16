# Dano brand assets

`dano-logo.png` is the original transparent logo from the owner's GitHub profile
repository, downloaded unchanged on 2026-09-12 at the owner's request.

- Source: https://github.com/DanoAndHolidays/DanoAndHolidays/blob/main/logo.png
- Raw: https://raw.githubusercontent.com/DanoAndHolidays/DanoAndHolidays/main/logo.png
- Size: 450 × 200, PNG with alpha

Keep this local asset so the website and startup screen do not depend on GitHub
being reachable. The fox identity uses the native 🦊 emoji.

The animated signature now lives in `src/assets/brand/dano-loading.svg` so Vite
fingerprints it on every change. It reveals filled nib-shaped outlines along
six pen trajectories, with light upstrokes, broader downstrokes, lifted ends,
brief pen lifts and a final flourish. The finished signature stays visible;
reduced motion shows all the ink immediately.

Run `node scripts/generate-loading-signature.mjs` to rebuild both this SVG and
`src/components/shell/DanoWordmark.vue` from the same pressure-shaped geometry.
Writing ends at 2710ms; `index.html` holds the completed signature until 3120ms.
The original PNG remains available as an image-load fallback.

Startup CSS lives in `src/styles/loading.css`, also bundled with a content hash.
The small critical style in `index.html` keeps the startup overlay centered and
fixed to the viewport before stylesheet delivery, including slow connections.
