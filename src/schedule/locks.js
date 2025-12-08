/**
 * Updates slot value if editable.
 * @param {import("../state/appState.js").AppState} appState
 * @param {string} rowId
 * @param {number} dayIndex
 * @param {"D" | "N" | "U" | null} value
 */
export function updateSlotValue(appState, rowId, dayIndex, value) {
  if (!appState.currentSchedule) {
    return;
  }
  const { schedule } = appState.currentSchedule;
  const row = schedule.rows.find((item) => item.id === rowId);
  if (
    !row ||
    !Array.isArray(row.slots) ||
    dayIndex < 0 ||
    dayIndex >= row.slots.length ||
    (Array.isArray(row.locks) && row.locks[dayIndex])
  ) {
    return;
  }
  row.slots[dayIndex] = value === "D" || value === "N" || value === "U" ? value : null;
}

/**
 * Toggles lock on a schedule cell.
 * @param {import("../state/appState.js").AppState} appState
 * @param {string} rowId
 * @param {number} dayIndex
 */
export function toggleCellLock(appState, rowId, dayIndex) {
  if (!appState.currentSchedule) {
    return;
  }
  const { schedule } = appState.currentSchedule;
  const row = schedule.rows.find((item) => item.id === rowId);
  if (!row || dayIndex < 0 || dayIndex >= row.slots.length) {
    return;
  }
  if (!Array.isArray(row.locks)) {
    row.locks = Array(row.slots.length).fill(false);
  }
  row.locks[dayIndex] = !row.locks[dayIndex];
}
