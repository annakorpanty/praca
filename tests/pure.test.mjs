import assert from "node:assert/strict";
import { buildSchedule } from "../src/schedule/engine.js";
import { deriveScheduleInsights } from "../src/schedule/insights.js";
import { computeSummaryFromSchedule } from "../src/schedule/summary.js";
import { normalizeImportedSchedule } from "../src/io/importers.js";
import { sanitizeNumber } from "../src/utils/numbers.js";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function run() {
  let passed = 0;
  for (const { name, fn } of tests) {
    try {
      fn();
      console.log(`✔ ${name}`);
      passed += 1;
    } catch (error) {
      console.error(`✖ ${name}`);
      console.error(error);
      process.exitCode = 1;
      break;
    }
  }
  if (process.exitCode !== 1) {
    console.log(`\n${passed} tests passed.`);
  }
}

test("sanitizeNumber respects fallback and min guard", () => {
  assert.equal(sanitizeNumber("abc", 10), 10);
  assert.equal(sanitizeNumber("2", 10, { min: 3 }), 10);
  assert.equal(sanitizeNumber("5", 10, { min: 3 }), 5);
});

test("normalizeImportedSchedule trims slots and locks", () => {
  const raw = {
    days: [{ day: 1 }, { day: 2 }],
    rows: [
      {
        id: "w1",
        name: "A",
        slots: ["D", "X"],
        locks: [true, ""],
      },
    ],
  };
  const normalized = normalizeImportedSchedule(raw, 1, 2025);
  assert.equal(normalized.days.length, 31);
  assert.equal(normalized.rows[0].slots[0], "D");
  assert.equal(normalized.rows[0].slots[1], null);
  assert.equal(normalized.rows[0].locks[1], false);
});

test("buildSchedule respects locked cells", () => {
  const worker = {
    id: "w1",
    name: "Alex",
    order: 0,
    maxHours: 168,
    shiftHours: 12,
    preference: "balanced",
    enforceHourCap: false,
    blockedShifts: {},
    noWeekends: false,
  };
  const originalRandom = Math.random;
  Math.random = () => 0.1;
  const schedule = buildSchedule(
    [worker],
    2,
    2025,
    [{ id: "w1", name: "Alex", slots: ["D", null], locks: [true, false] }],
    { maxStreak: { D: 3, N: 2, ANY: 3 } },
  );
  Math.random = originalRandom;
  assert.equal(schedule.rows[0].slots[0], "D");
  assert.equal(schedule.rows[0].locks[0], true);
  assert.equal(schedule.days.length, 28);
});

test("buildSchedule does not double-assign when a shift is locked", () => {
  const w1 = {
    id: "w1",
    name: "Alex",
    order: 0,
    maxHours: 168,
    shiftHours: 12,
    preference: "balanced",
    enforceHourCap: false,
    blockedShifts: {},
    noWeekends: false,
  };
  const w2 = { ...w1, id: "w2", name: "Bea", order: 1 };
  const lockedRows = [
    { id: "w1", name: "Alex", slots: [null, "D"], locks: [false, true] },
    { id: "w2", name: "Bea", slots: [null, null], locks: [false, false] },
  ];
  const schedule = buildSchedule([w1, w2], 2, 2025, lockedRows, {
    maxStreak: { D: 3, N: 2, ANY: 3 },
  });
  const day1Assignments = schedule.rows.map((r) => r.slots[1]).filter(Boolean);
  assert.equal(day1Assignments.filter((s) => s === "D").length, 1);
  assert.equal(day1Assignments.filter((s) => s === "N").length, 1);
});

test("deriveScheduleInsights detects night-to-day transitions", () => {
  const worker = {
    id: "w1",
    name: "Alex",
    order: 0,
    maxHours: 168,
    shiftHours: 12,
    preference: "balanced",
    enforceHourCap: false,
    blockedShifts: {},
    noWeekends: false,
  };
  const schedule = {
    days: [
      { day: 1, dow: "Nd", date: new Date(2025, 0, 1), isSaturday: false, isSunday: true },
      { day: 2, dow: "Pn", date: new Date(2025, 0, 2), isSaturday: false, isSunday: false },
    ],
    rows: [{ id: "w1", name: "Alex", slots: ["N", "D"], locks: [false, false] }],
    summary: [],
    warnings: [],
  };
  const insights = deriveScheduleInsights(schedule, 1, 2025, [worker], {
    maxStreak: { D: 3, N: 2, ANY: 3 },
  });
  assert.ok(insights.nightToDay.cells.some((cell) => cell.dayIndex === 1));
  assert.ok(insights.warnings.some((text) => text.includes("N→D")));
});

test("deriveScheduleInsights warns on blocked shifts", () => {
  const worker = {
    id: "w1",
    name: "Alex",
    order: 0,
    maxHours: 168,
    shiftHours: 12,
    preference: "balanced",
    enforceHourCap: false,
    blockedShifts: { 1: ["N"] },
    noWeekends: false,
  };
  const schedule = {
    days: [
      { day: 1, dow: "Nd", date: new Date(2025, 0, 1), isSaturday: false, isSunday: true },
      { day: 6, dow: "Pn", date: new Date(2025, 0, 6), isSaturday: false, isSunday: false },
    ],
    rows: [{ id: "w1", name: "Alex", slots: [null, "N"], locks: [false, false] }],
    summary: [],
    warnings: [],
  };
  const insights = deriveScheduleInsights(schedule, 1, 2025, [worker], {
    maxStreak: { D: 3, N: 2, ANY: 3 },
  });
  assert.ok(insights.warnings.some((text) => text.includes("blokadę na zmianę N")));
});

test("computeSummaryFromSchedule calculates totals and warnings", () => {
  const workers = [
    {
      id: "w1",
      name: "Alex",
      order: 0,
      maxHours: 18,
      shiftHours: 12,
      preference: "balanced",
      enforceHourCap: false,
      blockedShifts: {},
      noWeekends: false,
    },
  ];
  const schedule = {
    days: [],
    rows: [{ id: "w1", name: "Alex", slots: ["D", "N", "U"], locks: [false, false, false] }],
    summary: [],
    warnings: [],
  };
  const summary = computeSummaryFromSchedule(schedule, workers);
  assert.equal(summary[0].totalHours, 24);
  assert.equal(summary[0].overtimeHours, 6);
  assert.ok(summary[0].warnings.some((text) => text.includes("zaplanowano 24h")));
});

run();
