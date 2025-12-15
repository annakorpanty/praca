# Hotel Reception Schedule

Vanilla HTML/CSS/JS app for building monthly reception schedules with worker preferences, streak limits, and import/export. Pure static assets—no build step required.

## Features
- Schedule generation with day/night balancing, hour caps, streak limits, preferences, per-shift weekday blocks, and lockable cells.
- Inline editing for worker roster and schedule cells; warnings/highlights for coverage gaps, night→day transitions, blocked days, and streak violations.
- Export to PNG or JSON; import from JSON to restore workers and schedules.
- Settings for max streaks saved in `localStorage` along with workers and locks.

## Project structure
- `index.html` — simple entry page linking to the app.
- `grafik/index.html`, `grafik/styles.css` — static shell and styling.
- `grafik/src/init.js` — app entry (ES module).
- `grafik/src/constants/` — defaults, months/day labels, storage keys.
- `grafik/src/state/` — app state container and `localStorage` persistence.
- `grafik/src/dom/` — DOM lookups and selector initialization.
- `grafik/src/workers/`, `grafik/src/settings/` — form logic and roster UI.
- `grafik/src/schedule/` — scheduling engine, insights/warnings, rendering, locks, summaries.
- `grafik/src/io/` — JSON/PNG import/export.
- `grafik/src/utils/` — IDs, date/number helpers, form utilities.
- `docs/` — refactor plan, schedule engine guide, and GitHub Pages notes.
- `grafik/tests/pure.test.mjs` — minimal sanity tests for pure modules.

## Run locally (no build)
1. Serve over HTTP (modules are blocked on `file://`):
   - `python3 -m http.server 8000` (or `npx http-server . --port 8000`)
2. Open `http://localhost:8000` in the browser.
   - App lives at `http://localhost:8000/grafik/`
3. Generate a schedule, adjust cells, and use PNG/JSON export/import from the UI.

## Tests
- `node grafik/tests/pure.test.mjs` — exercises the scheduling engine, insights, import normalization, and numeric guards.

## Deployment (GitHub Pages)
- Works as static assets with relative module imports.
- Recommended: Settings → Pages → Deploy from branch → `main` → `/ (root)`. Live URL will be `https://<user>.github.io/<repo>/`.
- Alternative: publish from `/docs` by copying `grafik/` under `docs/` (or syncing via workflow).

## Data persistence
- Workers, settings, and locks are stored in `localStorage` (`receptionAgendaWorkers`, `receptionAgendaSettings`). Clearing site data resets the app. JSON export is the portable backup.
