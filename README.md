# Sentry — Motion Alert PWA

A camera on one phone watches for motion; the moment it sees movement, it pings a second phone. No app store, no backend to run — it relays alerts through the free public [ntfy.sh](https://ntfy.sh) notification service.

## How it works
- **Watch mode**: uses your camera and compares video frames roughly 3x/second. When enough of the frame changes, it POSTs an alert to `https://ntfy.sh/<your-topic>`.
- **Receive mode**: opens a live connection to that same topic and sounds an alarm, vibrates, flashes the screen, and shows a notification when an alert arrives.
- Both phones just need to agree on the same **topic name** — think of it as a shared, secret channel name. Nothing to sign up for.

## 1. Deploy it (needs HTTPS — camera access requires it)
Pick whichever is easiest for you:

**GitHub Pages (free, permanent)**
1. Create a new GitHub repo and upload all the files in this folder.
2. Repo Settings → Pages → Deploy from branch → `main` / root.
3. You'll get a URL like `https://yourname.github.io/repo-name/`.

**Netlify Drop (free, fastest)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this whole folder in.
2. You'll get an instant `https://random-name.netlify.app` URL.

**Local testing on one machine**
```
python3 -m http.server 8000
```
Then visit `http://localhost:8000` — fine for testing camera/motion detection on one device, but to test across two *phones* you need a real HTTPS URL (use one of the options above), since phones can't reach your computer's `localhost`.

## 2. Set up both phones
1. Open the deployed URL on **both** phones.
2. Tap **Install** (or "Add to Home Screen" from the browser menu) on each, so it behaves like a normal app.
3. On **both** phones, enter the **exact same topic name** — e.g. `garage-cam-7fk2`. Make it long and specific; anyone who knows your topic name can see or send alerts on it, since ntfy.sh is a shared public relay.

**Phone A — the camera:**
- Switch to **Watch**, grant camera access, adjust sensitivity if needed, tap **Start Watching**.

**Phone B — the one that gets alerted:**
- Switch to **Receive**, allow notifications, tap **Subscribe**.
- Tap **Send Test Alert** on Phone A to confirm the connection works end to end.

## Important limitation: background delivery
This PWA can reliably alert Phone B while its tab/app is open (foreground or backgrounded). Browsers restrict what a web page can do once it's fully closed or the phone is locked for a long time — that's a phone OS limitation, not something any web app can fully get around without a push-notification backend.

**For guaranteed alerts even with the app closed:** install the free **ntfy** app (App Store / Play Store) on the receiving phone and subscribe to the *same* topic name there. It will then deliver true native push notifications regardless of whether this page is open.

## Privacy note
ntfy.sh's public server is free but unencrypted and open — anyone who guesses your topic name can read your alerts. For real security use, either pick a long random topic, or [self-host ntfy](https://docs.ntfy.sh/install/) and change the relay URL in `index.html` (search for `ntfy.sh`) to your own server.

## Files
- `index.html` — the whole app (UI + motion detection + alert logic)
- `manifest.json` — makes it installable as a PWA
- `sw.js` — service worker, caches the app shell for offline loading
- `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` — app icons
