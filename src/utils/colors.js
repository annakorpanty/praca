const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

/**
 * Generates a random hex color in #RRGGBB format.
 * @returns {string}
 */
export function randomHexColor() {
  const value = Math.floor(Math.random() * 0xffffff);
  return `#${value.toString(16).padStart(6, "0")}`;
}

/**
 * Checks if a string is a valid hex color in #RRGGBB format.
 * @param {unknown} value
 * @returns {value is string}
 */
export function isHexColor(value) {
  return typeof value === "string" && HEX_COLOR_REGEX.test(value);
}
