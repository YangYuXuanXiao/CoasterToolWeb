# Coaster Tool support website

Static support and privacy pages for GitHub Pages. No build step or dependencies.

Support and privacy inquiries can be sent through public
[GitHub Issues](https://github.com/YangYuXuanXiao/CoasterToolWeb/issues) or by email to
[xiaoyangyuxuan@126.com](mailto:xiaoyangyuxuan@126.com). App issue reports should
include the device model, iOS/watchOS version, app version, problem description,
expected and actual results, and specific steps to reproduce the issue. Do not
include precise locations, private photos, or complete/raw recordings in either
channel.

Keep all six languages aligned with the current CoasterTool implementation,
localization strings and these App repository documents:

- `docs/RECORD-CAPACITY.md`: 50 free local recordings, optional one-time purchases
  for 100 total or unlimited recordings, full-price upgrades without credit,
  restore purchases, and retention after refunds. Display App Store prices only;
  do not publish local StoreKit test prices as live prices.
- `docs/ICLOUD-BACKUP.md`: manual iCloud snapshots and restore are free, without a
  backup purchase or purchase restoration. Restoring records still requires enough
  local recording capacity. Capacity purchases do not provide iCloud storage.
- `docs/USER-GUIDE.md`, `docs/WATCH.md` and `docs/FORCE-JSON.md`: recording and
  limits, confirmed Watch transfers, calibration, barometer data,
  four-array imports and export choices.

New snapshots exclude all notes. Note drafts use local storage
excluded from system backups; ordinary preferences may still be backed up. Older
supported snapshots may contain notes and are not rewritten or deleted
automatically. Manual restore can recover older notes, but creating another
snapshot excludes them. Recording JSON exports keep notes.

Snapshots keep all saved recordings and their complete raw samples, including
GPS outside the selected analysis range. Opening the backup page lists existing
snapshots; it does not create a new one. Watch records must first be saved on
iPhone. A lack of recording slots prevents the entire restore batch from adding
records; a later disk write failure can leave some records restored, and retrying
skips those records. Current backup exclusions do not retroactively clean older
system device backups, which may contain note drafts.

Purchase restoration restores capacity entitlements, not recordings or photos.
The App Store and iCloud accounts can differ. StoreKit checks entitlements at
launch, foreground entry and transaction updates; an explicit Restore purchases
action starts purchase restoration. Pending approval does not unlock capacity.
Apple handles payment and retains transaction records under its own policy, and
may provide developer purchase/refund reports that do not identify the buyer.
Both support and privacy pages link to Apple's standard EULA and iCloud privacy
information; support also links to Apple's refund instructions.

For future updates, verify these boundaries against the implementation under
`Packages/CoasterKit/Sources/CoasterKit/` in the App repository:

- `Infrastructure/Purchases/RecordPurchaseClient.swift` and
  `Controllers/RecordPurchaseController.swift`: verified entitlements, explicit
  restoration, pending purchases, transaction updates and refunds.
- `Models/Backup/RideBackup.swift` and `Models/Backup/RideStore+Backup.swift`:
  excluded fields, complete samples, archive limits and partial disk failures.
- `Controllers/CloudBackupController.swift` and
  `Infrastructure/Cloud/ICloudBackupRepository.swift`: user-initiated snapshots,
  upload/download status and account-change handling.

Use official Apple references for service behavior outside the app:
[App Store & Privacy](https://www.apple.com/legal/privacy/data/en/app-store/),
[Apple Account & iCloud privacy](https://www.apple.com/legal/privacy/data/en/apple-id/),
[standard EULA](https://www.apple.com/legal/internet-services/itunes/dev/stdeula/)
and [refund instructions](https://support.apple.com/en-us/118223).

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
| 日本語 | `ja/index.html` | `ja/privacy.html` |
| العربية | `ar/index.html` | `ar/privacy.html` |

The original `index.html` and `privacy.html` URLs remain language-neutral entry
pages. They use the saved manual language choice first, then the browser's ordered
language preferences, and fall back to English. Chinese script tags take priority;
`zh-TW`, `zh-HK`, and `zh-MO` select Traditional Chinese, and other Chinese locales
select Simplified Chinese. Japanese regional tags such as `ja-JP` select `ja`;
Arabic tags such as `ar-SA` and `ar-EG` select `ar`. The first supported language
in the browser preference list wins after any saved manual choice.

Every localized page has ordinary language links that work without JavaScript.
With JavaScript enabled, a manual choice is saved in local storage when available.
The automatic-language button clears that choice and uses browser preferences.
Explicit language URLs always display the requested language. Support/privacy
navigation stays in that language. Entry redirects preserve the query and fragment
and work under a GitHub Pages repository subpath.

Arabic pages declare `lang="ar"` and `dir="rtl"` in the static HTML, so headings,
text and flex navigation flow right to left even without JavaScript. All other
pages declare LTR; switching languages loads the matching document and direction.
Each language link has its own direction, and mixed-direction product names and
file paths use `bdi` where needed. Arabic and Japanese headings use natural letter
spacing. Page metadata, language alternatives, support/privacy links and the
no-JavaScript entry choices cover all six languages.

Translations preserve the existing policy date and meaning; adding a language
does not change the app permissions, purchase terms or data handling.

To preview locally, run `python3 -m http.server 8000` and open
`http://localhost:8000/`. Run routing and page-integrity checks with
`node --test tests/*.test.js`.
