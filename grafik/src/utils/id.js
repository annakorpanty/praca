/**
 * Generates a worker id using crypto if available.
 * @returns {string}
 */
export function createWorkerId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
