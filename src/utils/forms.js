import { DAY_NAMES } from "../constants/dates.js";

/**
 * Human-friendly label for preference.
 * @param {string} value
 * @returns {string}
 */
export function formatPreference(value) {
  switch (value) {
    case "prefer-days":
      return "Woli zmiany dzienne";
    case "prefer-nights":
      return "Woli zmiany nocne";
    case "only-days":
      return "Tylko zmiany dzienne";
    case "only-nights":
      return "Tylko zmiany nocne";
    default:
      return "Bez preferencji";
  }
}

/**
 * Formats blocked shifts map into readable tags, e.g., "Pn (D,N)".
 * @param {Record<number, Array<"D" | "N">>} blockedShifts
 * @returns {string}
 */
export function formatBlockedShifts(blockedShifts) {
  const parts = [];
  Object.entries(blockedShifts || {}).forEach(([key, shifts]) => {
    if (!Array.isArray(shifts) || shifts.length === 0) {
      return;
    }
    const dowIndex = Number(key);
    const dowName = DAY_NAMES[dowIndex] || "";
    if (!dowName) {
      return;
    }
    parts.push(`${dowName} (${shifts.join(",")})`);
  });
  return parts.join(", ");
}

/**
 * Reads blocked shifts table into a map keyed by weekday.
 * @param {HTMLElement | null} container
 * @returns {Record<number, Array<"D" | "N">>}
 */
export function getBlockedShifts(container) {
  if (!container) {
    return {};
  }
  const map = {};
  const inputs = container.querySelectorAll('input[type="checkbox"][data-day][data-shift]');
  inputs.forEach((input) => {
    if (!input.checked) {
      return;
    }
    const day = Number(input.dataset.day);
    const shift = input.dataset.shift;
    if (!Number.isFinite(day) || (shift !== "D" && shift !== "N")) {
      return;
    }
    if (!Array.isArray(map[day])) {
      map[day] = [];
    }
    map[day].push(shift);
  });
  return map;
}

/**
 * Checks blocked shift table inputs based on provided map.
 * @param {HTMLElement | null} container
 * @param {Record<number, Array<"D" | "N">>} blockedShifts
 */
export function setBlockedShifts(container, blockedShifts) {
  if (!container) {
    return;
  }
  const inputs = container.querySelectorAll('input[type="checkbox"][data-day][data-shift]');
  inputs.forEach((input) => {
    const day = Number(input.dataset.day);
    const shift = input.dataset.shift;
    if (!Number.isFinite(day) || (shift !== "D" && shift !== "N")) {
      input.checked = false;
      return;
    }
    const dayShifts = blockedShifts?.[day] || [];
    input.checked = Array.isArray(dayShifts) && dayShifts.includes(shift);
  });
}
