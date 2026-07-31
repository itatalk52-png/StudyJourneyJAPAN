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
