# Dano brand assets

`dano-logo.png` is the original transparent logo from the owner's GitHub profile
repository, downloaded unchanged on 2026-09-12 at the owner's request.

- Source: https://github.com/DanoAndHolidays/DanoAndHolidays/blob/main/logo.png
- Raw: https://raw.githubusercontent.com/DanoAndHolidays/DanoAndHolidays/main/logo.png
- Size: 450 × 200, PNG with alpha

Keep this local asset so the website and startup screen do not depend on GitHub
being reachable. The fox identity uses the native 🦊 emoji.

`dano-loading.svg` draws a cursive Dano signature stroke by stroke, then reveals
the original logo with a small spring-like pop. The PNG is embedded unchanged,
so this works as a single self-contained image during app startup. Reduced
motion shows the final logo immediately. Rebuild it after changing the logo
or strokes with `node scripts/generate-loading-signature.mjs`.
