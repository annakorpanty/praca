import { DEFAULT_MAX_STREAK } from "../constants/defaults.js";
import { sanitizeNumber } from "../utils/numbers.js";

/**
 * Reads settings values from inputs with sanitization.
 * @param {{
 *  dayInput: HTMLInputElement | null;
 *  nightInput: HTMLInputElement | null;
 *  anyInput: HTMLInputElement | null;
 *  useWorkerColors?: HTMLInputElement | null;
 * }} inputs
 * @returns {{ maxStreak: { D: number; N: number; ANY: number }; useWorkerColors: boolean }}
 */
export function readSettingsPayload(inputs) {
  const dayLimit = sanitizeNumber(inputs.dayInput ? inputs.dayInput.value : null, DEFAULT_MAX_STREAK.D, {
    min: 1,
  });
  const nightLimit = sanitizeNumber(
    inputs.nightInput ? inputs.nightInput.value : null,
    DEFAULT_MAX_STREAK.N,
    { min: 1 },
  );
  const anyLimit = sanitizeNumber(
    inputs.anyInput ? inputs.anyInput.value : null,
    DEFAULT_MAX_STREAK.ANY,
    { min: 1 },
  );
  return {
    maxStreak: {
      D: dayLimit,
      N: nightLimit,
      ANY: anyLimit,
    },
    useWorkerColors: Boolean(inputs.useWorkerColors?.checked),
  };
}

/**
 * Syncs input values from current app settings.
 * @param {import("../state/appState.js").AppState} appState
 * @param {{
 *  dayInput: HTMLInputElement | null;
 *  nightInput: HTMLInputElement | null;
 *  anyInput: HTMLInputElement | null;
 *  useWorkerColors?: HTMLInputElement | null;
 * }} inputs
 */
export function syncSettingsFormValues(appState, inputs) {
  const streaks = appState.settings?.maxStreak || DEFAULT_MAX_STREAK;
  if (inputs.dayInput) {
    inputs.dayInput.value = String(streaks.D ?? DEFAULT_MAX_STREAK.D);
  }
  if (inputs.nightInput) {
    inputs.nightInput.value = String(streaks.N ?? DEFAULT_MAX_STREAK.N);
  }
  if (inputs.anyInput) {
    inputs.anyInput.value = String(streaks.ANY ?? DEFAULT_MAX_STREAK.ANY);
  }
  if (inputs.useWorkerColors) {
    inputs.useWorkerColors.checked = Boolean(appState.settings?.useWorkerColors);
  }
}
