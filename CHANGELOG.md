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
