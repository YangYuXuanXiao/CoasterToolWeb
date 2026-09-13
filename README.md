# Coaster Tool support website

Static support and privacy pages for GitHub Pages. No build step or dependencies.

Content reviewed on 2026-09-13 against CoasterTool commit `22e79b1`
(2026-09-12). All four languages cover recording with the screen locked,
per-device stop confirmation, immediate heart-rate permission requests,
automatic range trimming, display-only curve smoothing, and range-based track
recalculation. Support and privacy pages reflect the removal of iCloud backup
and restore, local export requirements, and browser language-preference storage.
Check current app behavior and localization strings as well as its README and
`Website/` pages when updating content; those pages can lag behind implementation.

| Language | Support | Privacy |
| --- | --- | --- |
| 简体中文 | `zh-Hans/index.html` | `zh-Hans/privacy.html` |
| 繁體中文 | `zh-Hant/index.html` | `zh-Hant/privacy.html` |
| English | `en/index.html` | `en/privacy.html` |
| Français | `fr/index.html` | `fr/privacy.html` |

The original `index.html` and `privacy.html` URLs remain language-neutral entry
pages. They use the saved manual language choice first, then the browser's ordered
language preferences, and fall back to English. Chinese script tags take priority;
`zh-TW`, `zh-HK`, and `zh-MO` select Traditional Chinese, and other Chinese locales
select Simplified Chinese.

Every localized page has ordinary language links that work without JavaScript.
With JavaScript enabled, a manual choice is saved in local storage when available.
The automatic-language button clears that choice and uses browser preferences.
Explicit language URLs always display the requested language. Support/privacy
navigation stays in that language. Entry redirects preserve the query and fragment
and work under a GitHub Pages repository subpath.

To preview locally, run `python3 -m http.server 8000` and open
`http://localhost:8000/`. Run routing and page-integrity checks with
`node --test tests/*.test.js`.
