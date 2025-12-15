# Schedule module guide

## Module map
- `grafik/src/init.js` — orchestrates hydration, event wiring, renders schedule.
- `grafik/src/constants/*` — shared defaults, month/day labels, storage keys.
- `grafik/src/state/appState.js` — in-memory state container seeded with defaults.
- `grafik/src/state/persistence.js` — hydrate/persist workers + settings to `localStorage`.
- `grafik/src/utils/*` — form helpers, date formatting, numeric guards, id generator.
- `grafik/src/workers/form.js` — worker form extraction, edit/reset flows.
- `grafik/src/workers/list.js` — renders worker list with edit/delete hooks.
- `grafik/src/settings/form.js` — settings form sync + payload sanitization.
- `grafik/src/schedule/engine.js` — pure scheduler (`buildSchedule`) and streak helpers.
- `grafik/src/schedule/summary.js` — per-worker totals + overtime detection.
- `grafik/src/schedule/insights.js` — warnings/highlights (coverage, N→D, blocked, streaks).
- `grafik/src/schedule/render.js` — DOM rendering for schedule table, summary, warnings.
- `grafik/src/schedule/locks.js` — slot edits and lock toggling.
- `grafik/src/io/exporters.js` — PNG/JSON export.
- `grafik/src/io/importers.js` — JSON import + normalization.

## Data shapes
- `Worker`: `{ id, name, order, maxHours, shiftHours, preference, enforceHourCap, blockedShifts }` where `blockedShifts` is a map `{ [weekdayIndex]: ["D","N"] }`.
- `Settings`: `{ maxStreak: { D, N, ANY } }`
- `Schedule`: `{ days[], rows[], summary[], warnings[] }`
  - `days`: `{ day, dow, date, isSaturday, isSunday }`
  - `rows`: `{ id, name, slots[], locks[] }` where slots contain `"D" | "N" | "U" | null`
  - `summary`: `{ name, totalHours, dayCount, nightCount, holidayCount, overtimeHours, warnings[] }`

## Scheduling rules (engine)
- Tries to assign both day and night shifts for each calendar day.
- Respects locked cells from previous schedule runs.
- Discards assignments that break: weekend bans, D-after-N, capped hours (hard if `enforceHourCap` or `respectCap` pass), blocked shifts per weekday (unless forced).
- Balances load with scoring: penalizes consecutive over-target streaks, rewards idle time recovery, biases by preferences (prefer/only day or night).
- Limits streaks using settings: `maxStreak.D`, `maxStreak.N`, `maxStreak.ANY` with random block targets inside allowed range.
- Emits forced warnings when violating a blocked shift/day due to lack of candidates.

## Insights and warnings
- Coverage: missing day/night per date.
- Night→Day: flags consecutive N then D for same worker.
- Blocked days: worker assigned on blocked weekday.
- Streaks: exceeding configured D, N, or ANY streak lengths.
- Summary: zero hours, >168h cap, or >worker max hours.
Highlights mirror warnings via column/cell markers passed to renderer.

## Rendering and I/O
- Rendering is DOM-only (`renderSchedule`, `renderWarnings`, `renderSummary`) and driven by pure data structures plus callbacks for slot changes and lock toggles.
- PNG export paints table + summary via canvas; JSON export preserves workers + schedule + meta; JSON import normalizes month/year, workers, slots, and locks.

## Manual QA checklist
- Add worker, edit, delete; verify form resets and modal titles.
- Save settings and ensure streak limits update highlights/warnings after regenerate.
- Generate schedule for current month; lock/unlock cells; change slot via select; regenerate preserves locks.
- Export PNG/JSON; re-import JSON and confirm workers + schedule load with correct month/year.
- Validate warnings: create N→D case, blocked weekday assignment, streak beyond limit, and missing coverage by clearing a slot. 
