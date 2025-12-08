# Hotel Reception Schedule

Vanilla HTML/CSS/JS app for building monthly reception schedules with worker preferences, streak limits, and import/export. Pure static assets—no build step required.

## Features
- Schedule generation with day/night balancing, hour caps, streak limits, preferences, blocked weekdays, and lockable cells.
- Inline editing for worker roster and schedule cells; warnings/highlights for coverage gaps, night→day transitions, blocked days, and streak violations.
- Export to PNG or JSON; import from JSON to restore workers and schedules.
- Settings for max streaks saved in `localStorage` along with workers and locks.

## Project structure
- `index.html`, `styles.css` — static shell and styling.
- `src/init.js` — app entry (ES module).
- `src/constants/` — defaults, months/day labels, storage keys.
- `src/state/` — app state container and `localStorage` persistence.
- `src/dom/` — DOM lookups and selector initialization.
- `src/workers/`, `src/settings/` — form logic and roster UI.
- `src/schedule/` — scheduling engine, insights/warnings, rendering, locks, summaries.
- `src/io/` — JSON/PNG import/export.
- `src/utils/` — IDs, date/number helpers, form utilities.
- `docs/` — refactor plan, schedule engine guide, and GitHub Pages notes.
- `tests/pure.test.mjs` — minimal sanity tests for pure modules.

## Run locally (no build)
1. Serve over HTTP (modules are blocked on `file://`):
   - `python3 -m http.server 8000` (or `npx http-server . --port 8000`)
2. Open `http://localhost:8000` in the browser.
3. Generate a schedule, adjust cells, and use PNG/JSON export/import from the UI.

## Tests
- `node tests/pure.test.mjs` — exercises the scheduling engine, insights, import normalization, and numeric guards.

## Deployment (GitHub Pages)
- Works as static assets with relative module imports.
- Recommended: Settings → Pages → Deploy from branch → `main` → `/ (root)`. Live URL will be `https://<user>.github.io/<repo>/`.
- Alternative: publish from `/docs` by copying `index.html`, `styles.css`, and `src/` under `docs/` or syncing via workflow. See `docs/002_github_pages_deploy_20251208T171604Z.md`.

## Data persistence
- Workers, settings, and locks are stored in `localStorage` (`receptionAgendaWorkers`, `receptionAgendaSettings`). Clearing site data resets the app. JSON export is the portable backup.
