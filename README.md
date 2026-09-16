# Coaster Tool support website

Static support and privacy pages for GitHub Pages. No build step or dependencies.

Keep all four languages aligned with the current CoasterTool implementation,
localization strings and these App repository documents:

- `docs/RECORD-CAPACITY.md`: 50 free local recordings, optional one-time purchases
  for 100 total or unlimited recordings, full-price upgrades without credit,
  restore purchases, and retention after refunds. Display App Store prices only;
  do not publish local StoreKit test prices as live prices.
- `docs/ICLOUD-BACKUP.md`: manual iCloud snapshots and restore are free, without a
  backup purchase or purchase restoration. Restoring records still requires enough
  local recording capacity. Capacity purchases do not provide iCloud storage.
- `docs/USER-GUIDE.md`, `docs/WATCH.md` and `docs/FORCE-JSON.md`: recording and
  HealthKit limits, confirmed Watch transfers, calibration, barometer data,
  four-array imports and export choices.

New snapshots exclude heart rate and all notes. Note drafts use local storage
excluded from system backups; ordinary preferences may still be backed up. Older
supported snapshots may contain notes and are not rewritten or deleted
automatically. Manual restore can recover older notes, but creating another
snapshot excludes them. Recording JSON exports keep notes; heart rate requires
an explicit choice each time the share screen is opened.

Tracks require full calibration, a geographic heading and accepted GPS in each
continuous motion-data segment; there is no inertial-only or GPS-only fallback.
Barometer data can assist altitude only after GPS acceptance. The file import
entry accepts four-array force JSON, not full CoasterTool recording JSON.

The old paid-backup offer and its per-version dismissible History suggestion
have been removed from the App. Keep support and privacy pages consistent with
free backup and separate recording-capacity purchases. App Store Connect product
configuration and GitHub Pages publication are separate release steps; editing
these files does not change either service.

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
