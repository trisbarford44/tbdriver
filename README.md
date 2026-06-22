# Tris Drive PWA v2

A free installable iPhone web app for a luxury/performance-style driving dashboard.

## What changed in v2

- Hybrid Aston/AMG/aviation-style dashboard layout
- Large central speed cluster
- Reordered widgets for better phone-mounted visibility
- Spotify button replacing Music
- Spotify app deep-link with web fallback
- Theme selector: Hybrid GT, Aston luxury, AMG sport, Night stealth
- Thumb-friendly bottom controls

## Install through GitHub Pages

1. Create or open your GitHub repo.
2. Upload the contents of this folder, not the folder itself.
3. Go to Settings > Pages.
4. Set source to `Deploy from a branch`.
5. Set branch to `main` and folder to `/root`.
6. Open the published URL on iPhone Safari.
7. Tap Share > Add to Home Screen.

## Best usage

- Open from the Home Screen icon, not inside a browser tab.
- Tap Start before driving to activate GPS.
- Tap Screen On to try to keep the display awake. If unsupported, use iPhone Settings > Display & Brightness > Auto-Lock.
- Use the Spotify button to open the Spotify app. If Spotify is not installed, it opens Spotify web.

## Notes

- iOS may require the first tap before compass permission appears.
- GPS speed depends on real movement and may show `--` or `0` while stationary.
- Full CarPlay dashboard display is not available through a free PWA because Apple restricts CarPlay apps.
