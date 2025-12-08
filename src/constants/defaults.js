export const BUTTON_LABELS = {
  add: "Dodaj recepcjonistę",
  save: "Zapisz zmiany",
};

export const DEFAULT_MAX_STREAK = {
  D: 3,
  N: 2,
  ANY: 3,
};

export const BLOCK_TARGETS = {
  D: { min: 1, max: 3 },
  N: { min: 1, max: 2 },
};

export const DEFAULT_FORM_NUMBERS = {
  maxHours: 168,
  shiftHours: 12,
};

export const DEFAULT_FORM_VALUES = {
  maxHours: String(DEFAULT_FORM_NUMBERS.maxHours),
  shiftHours: String(DEFAULT_FORM_NUMBERS.shiftHours),
  preference: "balanced",
  blockedShifts: {},
};
