/**
 * Coerces a value to a number while respecting optional lower bound and fallback.
 * @param {unknown} value
 * @param {number} fallback
 * @param {{ min?: number }} [options]
 * @returns {number}
 */
export function sanitizeNumber(value, fallback, options = {}) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  if (typeof options.min === "number" && parsed < options.min) {
    return fallback;
  }
  return parsed;
}

/**
 * Returns a random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);
  if (upper <= lower) {
    return lower;
  }
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}
