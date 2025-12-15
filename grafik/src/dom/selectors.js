/**
 * Populates month/year select elements.
 * @param {HTMLSelectElement} monthSelect
 * @param {HTMLSelectElement} yearSelect
 * @param {string[]} months
 */
export function initSelectors(monthSelect, yearSelect, months) {
  const now = new Date();
  months.forEach((label, index) => {
    const option = document.createElement("option");
    option.value = String(index + 1);
    option.textContent = label;
    if (index === now.getMonth()) {
      option.selected = true;
    }
    monthSelect.append(option);
  });

  const currentYear = now.getFullYear();
  for (let year = currentYear - 1; year <= currentYear + 3; year += 1) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    if (year === currentYear) {
      option.selected = true;
    }
    yearSelect.append(option);
  }
}
