# Ver.2.0.8 Official Release

- Updated the post-update profile flow for registered users.
- Restored saved avatar and profile fields before opening the dialog.
- Added a “プロフィールはそのまま” button that closes the dialog and returns Home.
- Updated the application and Service Worker version to 2.0.8.

# Ver.2.0.7 Official Release

- アプリ内の表示バージョンを Ver.2.0.7 に更新
- 「🚀 最新バージョンで旅をする」ボタンを「プロフィールを更新」と同じ濃い緑色に統一
- 更新確認・更新完了・最新版表示の仕組みを継続
- Service Worker のキャッシュ名を Ver.2.0.7 用に更新
- Google Apps Script の変更なし

# Ver.2.0.6 Hotfix

- Added a manual “最新バージョンで旅をする” update control to the profile screen.
- Added clear success messages for updated and already-current states.
- Retained automatic service-worker update notifications.
- Ensured the own Friends card uses “今週の簿記勉強時間”.
- Emphasized own total points in bold red.
- Updated the service-worker cache version.

# Ver.2.0.3 Hotfix

- Renamed “本日の獲得ポイント” to “本日の勉強時間ポイント” on the Timer screen.
- Renamed “累計ポイント” to “累計獲得ポイント” on the Timer screen.
- Updated the service-worker cache version.
- No calculation logic or Apps Script changes.

# Ver.2.0.2 Hotfix

- Changed “今回の学習ポイント” to “本日の獲得ポイント” on the Timer screen.
- The left Timer card now shows today’s study points (1 minute = 1 point).
- Kept cumulative points unchanged on the right card.
- Updated the service-worker cache version.

# Ver.2.0.0

- Added 30 new badge memories across Ehime, Kochi, and Kagawa.
- Expanded the implemented collection from 80 to 110 of 470 memories.
- Added Angel Road to Kagawa and standardized all new badge filenames.
- Updated the embedded badge catalog and service-worker cache.
- No Apps Script changes are required for this content release.

# Ver.1.9.4

- Added “今週の勉強時間ランク〇位” below This Week on the Home screen.
- Weekly rank is calculated from Monday-to-Sunday cumulative study minutes.
- Added competition ranking for weekly-time ties: 1st, 2nd, 2nd, 4th.
- Aligned Friends list rank numbers with the weekly study-time rank.
- Retained the cumulative point rank introduced in Ver.1.9.3.
- Updated the Apps Script API and service-worker cache version.

# Ver.1.9.3

- Added the user’s cumulative point rank below Total Points on the Home screen.
- Point rank includes study, medal, streak, and cheer points.
- Added competition ranking for ties: 1st, 2nd, 2nd, 4th.
- Kept the Friends list ordered by weekly study time.
- Updated the Apps Script API and service-worker cache version.

# Ver.1.9.2

- Fixed weekly study time showing as zero when the week ID cell is a Google Sheets date value.
- Applied the same normalized week comparison to study updates, cloud sync, and Friends ranking.
- Added the label “今週の勉強時間”.
- Changed weekly duration display to Japanese hours and minutes, such as `2時間07分`.
- Removed the Timer RESET button to prevent accidental confusion.
- Updated the service-worker cache version.

# Ver.1.9.0

- Added server-generated random Study Journey IDs.
- Added passwordless ID login.
- Added multi-device cloud state loading.
- Added badge acquisition history sheet and migration from accumulated minutes.
- Synced study totals, daily calendar records, streaks, points, location and badges.
- Kept profile images device-local.
- Bumped service-worker cache to Ver.1.9.0.

# Ver.1.8.5 R3

- Added an in-app update notification dialog.
- Added “Update now” and “Later” actions.
- The new service worker waits for user approval before activation.
- Reloads automatically after the approved update becomes active.
- Checks for updates on launch, when returning to the app, and every hour.
- Keeps local learning records and profile data during updates.
- Updated the service-worker cache version.

# Ver.1.8.5 R2

- Fixed the top-right Home profile icon to render as a true circle.
- Removed browser button padding and locked equal width and height.
- Enforced centered `object-fit: cover` cropping for uploaded profile images.
- Updated the service-worker cache version.

# Ver.1.8.5

- Rebuilt the map feature using dedicated current-location images.
- Separated national-map display from current-location display.
- Removed visited-prefecture coloring.
- Added user-created map images for Okinawa and the seven Kyushu prefectures.
- Added profile-avatar markers to both Home and Map screens.
- Updated the service-worker cache version.

# Ver.1.8.4

- Rebuilt all 47 prefecture coordinates using prefecture-label centers from the supplied reference map.
- Moved the current-location marker inside the transformed map canvas.
- Added the user's configured avatar to the current-location marker.
- Added initials fallback when no avatar is configured.
- Updated the service-worker cache version.

# Ver.1.8.2

- Removed the TODAY label from calendar cells.
- Adjusted calendar medal and minute spacing.
- Removed all map preview modes; the map now always reflects real progress.
- Added a current-region zoom view for the Map screen.
- Added a national/current-location map toggle.
- Replaced the Home mini-map with an enlarged current-location view.
- Updated the service-worker cache version.

# Ver.1.8.1

- Enforced true circular avatars using 1:1 aspect ratio and cover cropping.
- Standard cheer and thank-you rewards changed to 0.1 points.
- Dormant-user cheer reward changed to 0.2 points.
- Restart bonus changed to 0.1 points.
- Timer rebuilt around elapsed wall-clock time.
- Timer restores elapsed time after screen lock, background suspension, reload, or PWA reopening.
- Sessions continuing past midnight are allocated by date.
- Service-worker cache updated.

- Fixed Collection badge flicker by preventing unnecessary once-per-second DOM reconstruction.
