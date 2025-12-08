import { DEFAULT_MAX_STREAK } from "../constants/defaults.js";

/**
 * @typedef {Object} AppState
 * @property {Array<import("../types.js").Worker>} workers
 * @property {string | null} editingWorkerId
 * @property {{ schedule: import("../types.js").Schedule | null, month: number, year: number } | null} currentSchedule
 * @property {import("../types.js").Settings} settings
 */

/**
 * Returns a settings object seeded with defaults.
 * @returns {import("../types.js").Settings}
 */
export function createDefaultSettings() {
  return {
    maxStreak: {
      D: DEFAULT_MAX_STREAK.D,
      N: DEFAULT_MAX_STREAK.N,
      ANY: DEFAULT_MAX_STREAK.ANY,
    },
  };
}

export const appState = {
  workers: [],
  editingWorkerId: null,
  currentSchedule: null,
  settings: createDefaultSettings(),
};
