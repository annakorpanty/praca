import { DAY_NAMES } from "../constants/dates.js";

/**
 * Returns numeric checkbox values from a container.
 * @param {HTMLElement | null} container
 * @returns {number[]}
 */
export function getCheckboxValues(container) {
  if (!container) {
    return [];
  }
  const inputs = container.querySelectorAll('input[type="checkbox"]');
  return Array.from(inputs)
    .filter((input) => input.checked)
    .map((input) => Number(input.value))
    .filter((num) => Number.isFinite(num));
}

/**
 * Checks checkboxes that match provided numeric values.
 * @param {HTMLElement | null} container
 * @param {number[]} values
 */
export function setCheckboxValues(container, values) {
  if (!container) {
    return;
  }
  const valueSet = new Set(values);
  const inputs = container.querySelectorAll('input[type="checkbox"]');
  inputs.forEach((input) => {
    const numeric = Number(input.value);
    input.checked = Number.isFinite(numeric) && valueSet.has(numeric);
  });
}

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
 * Returns comma-separated day names from weekday indexes.
 * @param {number[]} weekdayIndexes
 * @returns {string}
 */
export function formatBlockedWeekdays(weekdayIndexes) {
  return weekdayIndexes
    .map((dow) => DAY_NAMES[dow] || "")
    .filter(Boolean)
    .join(", ");
}
