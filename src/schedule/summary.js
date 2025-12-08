import { DEFAULT_FORM_NUMBERS } from "../constants/defaults.js";

/**
 * Computes per-worker summary entries from schedule rows.
 * @param {import("../types.js").Schedule | null} schedule
 * @param {import("../types.js").Worker[]} workers
 * @returns {import("../types.js").SummaryEntry[]}
 */
export function computeSummaryFromSchedule(schedule, workers) {
  if (!schedule) {
    return [];
  }
  return schedule.rows.map((row) => {
    const worker = workers.find((item) => item.id === row.id);
    const shiftHours = worker ? worker.shiftHours : DEFAULT_FORM_NUMBERS.shiftHours;
    const maxHours = worker ? worker.maxHours : DEFAULT_FORM_NUMBERS.maxHours;
    const dayCount = row.slots.filter((slot) => slot === "D").length;
    const nightCount = row.slots.filter((slot) => slot === "N").length;
    const holidayCount = row.slots.filter((slot) => slot === "U").length;
    const totalHours = (dayCount + nightCount) * shiftHours;
    const overtimeHours = Math.max(0, totalHours - maxHours);
    const warnings = [];
    if (totalHours === 0) {
      warnings.push("Brak przydzielonych zmian.");
    }
    if (totalHours > 168) {
      warnings.push(`${row.name} przekracza 168h o ${totalHours - 168}h.`);
    }
    if (totalHours > maxHours) {
      warnings.push(`${row.name} zaplanowano ${totalHours}h przy limicie ${maxHours}h.`);
    }
    return {
      name: row.name,
      totalHours,
      nightsAssigned: nightCount,
      dayCount,
      nightCount,
      holidayCount,
      overtimeHours,
      warnings,
    };
  });
}
