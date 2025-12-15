/**
 * Formats a Date as YYYY-MM-DD.
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Formats a date range for warnings/highlights.
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {string}
 */
export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return "";
  }
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  if (start === end) {
    return start;
  }
  return `${start} - ${end}`;
}
