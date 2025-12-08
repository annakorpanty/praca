import { BUTTON_LABELS, DEFAULT_FORM_NUMBERS, DEFAULT_FORM_VALUES } from "../constants/defaults.js";
import { getBlockedShifts, setBlockedShifts } from "../utils/forms.js";
import { sanitizeNumber } from "../utils/numbers.js";

/**
 * Extracts worker payload from form data.
 * @param {FormData} formData
 * @param {HTMLFormElement} workerForm
 * @returns {Omit<import("../types.js").Worker, "id" | "order">}
 */
export function extractWorkerPayload(formData, workerForm) {
  const rawName = formData.get("worker-name");
  const name = rawName ? String(rawName).trim() : "";
  const blockedShifts = getBlockedShifts(workerForm.querySelector("#worker-block-shifts"));
  return {
    name,
    maxHours: sanitizeNumber(
      formData.get("worker-max-hours"),
      DEFAULT_FORM_NUMBERS.maxHours,
      { min: 12 },
    ),
    shiftHours: sanitizeNumber(
      formData.get("worker-shift-hours"),
      DEFAULT_FORM_NUMBERS.shiftHours,
      { min: 4 },
    ),
    preference: formData.get("worker-preference") || DEFAULT_FORM_VALUES.preference,
    noWeekends: false,
    enforceHourCap: formData.get("worker-limit-hours") === "on",
    blockedShifts,
  };
}

/**
 * Begins editing mode for a worker, populating form fields.
 * @param {import("../types.js").Worker} worker
 * @param {import("../state/appState.js").AppState} appState
 * @param {{
 *  workerForm: HTMLFormElement;
 *  workerSubmitButton: HTMLButtonElement;
 *  cancelEditButton: HTMLButtonElement;
 *  workerModalTitle: HTMLElement | null;
 *  workerBlockShifts: HTMLElement | null;
 * }} ui
 * @param {() => void} onShowModal
 */
export function startEditingWorker(worker, appState, ui, onShowModal) {
  appState.editingWorkerId = worker.id;
  ui.workerForm.querySelector("#worker-name").value = worker.name;
  ui.workerForm.querySelector("#worker-max-hours").value = String(worker.maxHours);
  ui.workerForm.querySelector("#worker-shift-hours").value = String(worker.shiftHours);
  ui.workerForm.querySelector("#worker-preference").value = worker.preference;
  ui.workerForm.querySelector("#worker-limit-hours").checked = Boolean(worker.enforceHourCap);
  setBlockedShifts(ui.workerBlockShifts, worker.blockedShifts || {});
  ui.workerSubmitButton.textContent = BUTTON_LABELS.save;
  ui.cancelEditButton.hidden = false;
  if (ui.workerModalTitle) {
    ui.workerModalTitle.textContent = "Edytuj osobę";
  }
  onShowModal();
}

/**
 * Exits editing mode and resets form state.
 * @param {import("../state/appState.js").AppState} appState
 * @param {{
 *  workerForm: HTMLFormElement;
 *  workerSubmitButton: HTMLButtonElement;
 *  cancelEditButton: HTMLButtonElement;
 *  workerModalTitle: HTMLElement | null;
 *  workerBlockShifts: HTMLElement | null;
 * }} ui
 */
export function exitEditingMode(appState, ui) {
  appState.editingWorkerId = null;
  ui.workerForm.reset();
  setDefaultFormValues(ui);
  ui.workerSubmitButton.textContent = BUTTON_LABELS.add;
  ui.cancelEditButton.hidden = true;
  if (ui.workerModalTitle) {
    ui.workerModalTitle.textContent = "Dodaj osobę";
  }
}

/**
 * Applies default values to worker form.
 * @param {{
 *  workerForm: HTMLFormElement;
 *  workerBlockShifts: HTMLElement | null;
 * }} ui
 */
export function setDefaultFormValues(ui) {
  ui.workerForm.querySelector("#worker-max-hours").value = DEFAULT_FORM_VALUES.maxHours;
  ui.workerForm.querySelector("#worker-shift-hours").value = DEFAULT_FORM_VALUES.shiftHours;
  ui.workerForm.querySelector("#worker-preference").value = DEFAULT_FORM_VALUES.preference;
  ui.workerForm.querySelector("#worker-limit-hours").checked = false;
  setBlockedShifts(ui.workerBlockShifts, {});
}
