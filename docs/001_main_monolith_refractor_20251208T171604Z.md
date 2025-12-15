# main.js refactor proposal

## Current scope
- `main.js` currently owns UI binding (querying DOM, wiring events), global state (workers, settings, schedule), persistence (localStorage), scheduling algorithm (shift assignment, streak handling, fairness), reporting (warnings/summary), rendering (table, highlights), and I/O (PNG/JSON export/import).
- Logic is tightly coupled to the DOM, making algorithmic parts hard to test and reuse; state and side effects are interwoven (schedule generation mutates state and re-renders immediately).
- Cross-cutting utilities (dates, number sanitization, checkbox helpers) live inline, causing duplication risks and low discoverability.

## Pain points to address
- Single file mixes concerns; changes to one area risk regressions elsewhere.
- No clear contract for state shape or scheduling engine inputs/outputs.
- Limited testability for the scheduling rules (streak caps, preferences, blocked days, locks).
- Rendering and business rules are interlaced, so UI tweaks risk logic changes.
- PNG/JSON exporters re-implement formatting instead of using shared data projections.

## Target module layout (ES modules, `type="module"` in `index.html`)
- `grafik/src/constants/`
  - `dates.js`: `MONTHS`, `DAY_NAMES`.
  - `storageKeys.js`: `STORAGE_KEY`, `SETTINGS_STORAGE_KEY`.
  - `defaults.js`: default form values, streak limits, block targets.
- `grafik/src/state/`
  - `appState.js`: in-memory state object and getters/setters.
  - `persistence.js`: hydrate/persist workers/settings with validation.
- `grafik/src/dom/`
  - `elements.js`: DOM lookups and template accessors.
  - `handlers.js`: shared event helpers (e.g., modal open/close guards).
- `grafik/src/workers/`
  - `form.js`: extract/validate worker payloads, defaulting, edit/reset flow.
  - `list.js`: render worker rows, bind edit/delete actions.
- `grafik/src/settings/`
  - `form.js`: load/save settings, validation helpers.
- `grafik/src/schedule/`
  - `engine.js`: pure `buildSchedule(workers, month, year, lockedRows)` with no DOM access.
  - `insights.js`: `deriveScheduleInsights`, coverage/night-to-day/blocked/streak checks.
  - `summary.js`: compute per-worker totals/warnings from schedule.
  - `render.js`: render schedule table, highlights, warnings, summary to DOM.
  - `locks.js`: helpers for lock toggling/updateSlotValue.
- `grafik/src/io/`
  - `exporters.js`: PNG/JSON export using shared projections.
  - `importers.js`: JSON import normalization and hydration hooks.
- `grafik/src/utils/`
  - `numbers.js`: `sanitizeNumber`, `randomInt`.
  - `dates.js`: `formatDate`, `formatDateRange`, month/year helpers.
  - `forms.js`: checkbox helpers, preference formatting.
- `grafik/src/init.js`: orchestrates boot sequence (hydrate state, init selectors, bind events, initial render).

## Refactor phases
1) **Switch to modules safely**: change script tag to `type="module"`, add `grafik/src/init.js` that imports existing monolith (temporarily split into exported functions) without behavior changes. Add smoke checklist (generate schedule, add/edit/delete worker, export/import).
2) **Extract pure core**: move scheduling engine + summary/insights into `grafik/src/schedule/` as pure functions (no DOM/state mutation). Add JSDoc signatures and defaulted params; keep old entrypoint calling new functions.
3) **State & persistence**: isolate `appState` plus hydrate/persist logic; expose typed accessors to avoid accidental mutations. Ensure locked rows normalization lives here.
4) **DOM/render separation**: move rendering (schedule table, warnings, summary) and template helpers into `grafik/src/schedule/render.js`; ensure it receives plain data and highlight descriptors only.
5) **Forms & modals**: extract worker/settings form flows and modal controls into dedicated modules; expose init functions to wire events in `init.js`.
6) **I/O modules**: split PNG/JSON export/import using data projections from schedule + summary modules; keep all user-facing strings centralized for reuse.
7) **Cleanup & contracts**: remove leftover globals, ensure every module exports a minimal public API; document state shapes and function contracts via JSDoc.
8) **Documentation & tests**: add README-style doc for module map, and introduce unit tests for pure functions (engine, insights, sanitizers) with fixture-based cases; add a short manual QA checklist for UI flows.

## JSDoc & documentation approach
- Add JSDoc to all exported functions describing params, return types, and side effects; prefer typedefs for `Worker`, `Schedule`, `ScheduleDay`, `ScheduleRow`, `SummaryEntry`.
- Provide inline examples for key utilities (e.g., `buildSchedule`) showing expected inputs and outputs.
- Create a `docs/schedule-engine.md` (or similar) describing business rules: streak limits, preferences, blocked weekdays, locks, coverage checks, and warning meanings.
- Centralize user-facing strings for tooltips/warnings to ease future localization.

## Testing & verification
- Add unit tests for pure modules (engine, insights, summary, sanitize helpers) covering edge cases: locked slots, blocked weekdays, streak caps, hour caps, preference weights, carry-over month/year.
- Regression checklist for UI: worker CRUD, settings save/cancel, generate schedule, lock/unlock cell behavior, export/import JSON, export PNG.
- Keep behavior parity before introducing new features; diff warnings/summary between old and new implementations during refactor.
