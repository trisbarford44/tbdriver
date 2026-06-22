# Tris Drive PWA v4.6 — Compass + Phone Fix

Replace these files in GitHub:

- `index.html`
- `app.js`

Keep your existing audio files and `welcome.html` unless you want to replace all files.

## Compass

The compass now uses two sources:

1. iPhone motion/orientation heading when enabled.
2. GPS heading while moving.

On iPhone, tap the settings/sidebar button, then tap **Enable iPhone Compass**. iOS requires a user tap before it gives web apps compass access.

If the car is stationary and the iPhone compass has not been enabled, the compass may show `---` because GPS heading only works reliably while moving.

## Phone button

Web apps cannot open iPhone Recents directly. Apple does not expose Recent Calls to Safari/PWAs.

This version adds a setting:

- **Siri Shortcut: Drive Call** — opens an iOS Shortcut named `Drive Call`.
- **Open dialer** — opens the phone dialer prompt.

Recommended iOS Shortcut:

1. Open Shortcuts.
2. Create a shortcut named exactly `Drive Call`.
3. Add action: **Ask for Input**.
   - Prompt: `Who do you want to call?`
   - Input type: Text.
4. Add action: **Call**.
   - Set contact/number to the provided input.
5. Save.

Then the app's Phone button can launch that shortcut.
