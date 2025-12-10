import { formatBlockedShifts, formatPreference } from "../utils/forms.js";

/**
 * Renders worker list with edit/delete actions.
 * @param {import("../state/appState.js").AppState} appState
 * @param {{
 *  workerListElement: HTMLElement;
 *  workerRowTemplate: HTMLTemplateElement;
 * }} targets
 * @param {{ onEdit: (worker: import("../types.js").Worker) => void; onDelete: (id: string) => void }} handlers
 */
export function renderWorkers(appState, targets, handlers) {
  const { workerListElement, workerRowTemplate } = targets;
  workerListElement.innerHTML = "";
  if (appState.workers.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Brak recepcjonistów.";
    empty.style.color = "#5f6c8f";
    workerListElement.append(empty);
    return;
  }

  appState.workers.forEach((worker) => {
    const row = workerRowTemplate.content.firstElementChild.cloneNode(true);
    row.querySelector("[data-worker-name]").textContent = worker.name;
    const details = `${worker.shiftHours}h zmiana • ≤${worker.maxHours}h / miesiąc`;
    row.querySelector("[data-worker-details]").textContent = details;
    row.querySelector("[data-worker-preference]").textContent = formatPreference(worker.preference);
    const colorSwatch = row.querySelector("[data-worker-color]");
    if (colorSwatch) {
      colorSwatch.style.backgroundColor = worker.color || "#e2e8f0";
      colorSwatch.dataset.color = worker.color || "";
      colorSwatch.title = worker.color ? `Kolor: ${worker.color}` : "Brak koloru";
    }
    const blockedTags = [];
    const blockedLabel = formatBlockedShifts(worker.blockedShifts);
    if (blockedLabel) {
      blockedTags.push(`Nie pracuje w: ${blockedLabel}`);
    }
    if (blockedTags.length) {
      const tagGrid = row.querySelector(".tag-grid");
      blockedTags.forEach((text) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = text;
        tagGrid.append(tag);
      });
    }
    const editButton = row.querySelector(".edit-btn");
    editButton.addEventListener("click", () => {
      handlers.onEdit(worker);
    });
    const deleteButton = row.querySelector(".delete-btn");
    deleteButton.addEventListener("click", () => {
      handlers.onDelete(worker.id);
    });
    workerListElement.append(row);
  });
}
