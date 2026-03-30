/**
 * Load Test Script
 *
 * Tests:
 * 1. Concurrent reservations (race condition / overbooking check)
 * 2. Concurrent kiosk check-in (double check-in prevention)
 * 3. Sustained reservation load (1000 users scenario)
 *
 * Usage:
 *   node scripts/load-test.mjs [baseUrl]
 *   node scripts/load-test.mjs http://localhost:3000
 */

const BASE_URL = process.argv[2] || "http://localhost:3000";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

function log(color, ...args) {
  console.log(color + args.join(" ") + colors.reset);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── helpers ──────────────────────────────────────────────────────────────────

async function getEvents() {
  const res = await fetch(`${BASE_URL}/api/events`);
  if (!res.ok) throw new Error(`GET /api/events failed: ${res.status}`);
  return res.json();
}

async function getTimeSlots(eventId) {
  const res = await fetch(`${BASE_URL}/api/events/${eventId}/timeslots`);
  if (!res.ok) throw new Error(`GET /api/events/${eventId}/timeslots failed: ${res.status}`);
  return res.json();
}

async function makeReservation(eventId, timeSlotId, suffix = "") {
  const res = await fetch(`${BASE_URL}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventId,
      timeSlotId,
      name: `테스트유저${suffix}`,
      phone: "01012345678",
      email: `test${suffix}@test.com`,
      address: `101동 ${suffix}호`,
      interests: "가구,인테리어",
      partySize: 1,
      privacyConsent: true,
      marketingConsent: false,
    }),
  });
  return { status: res.status, data: await res.json() };
}

async function kioskLookup(ticketNumber) {
  const res = await fetch(`${BASE_URL}/api/kiosk/${ticketNumber}`);
  return { status: res.status, data: await res.json() };
}

async function kioskCheckIn(ticketNumber) {
  const res = await fetch(`${BASE_URL}/api/kiosk/${ticketNumber}`, {
    method: "POST",
  });
  return { status: res.status, data: await res.json() };
}

// ── TEST 1: Concurrent reservation race condition ─────────────────────────────

async function testConcurrentReservations(eventId, timeSlotId, capacity) {
  log(colors.bold + colors.cyan, "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log(colors.bold + colors.cyan, "TEST 1: Concurrent Reservation Race Condition");
  log(colors.cyan, `Sending ${capacity + 5} simultaneous requests to a slot with capacity ${capacity}`);
  log(colors.bold + colors.cyan, "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const count = capacity + 5; // intentionally over capacity
  const start = Date.now();

  const results = await Promise.all(
    Array.from({ length: count }, (_, i) => makeReservation(eventId, timeSlotId, i))
  );

  const elapsed = Date.now() - start;
  const succeeded = results.filter((r) => r.status === 201);
  const rejected = results.filter((r) => r.status === 409);
  const errors = results.filter((r) => r.status >= 500);

  log(colors.green, `  ✓ Succeeded:       ${succeeded.length} (expected ≤ ${capacity})`);
  log(colors.yellow, `  ⚡ Capacity reject: ${rejected.length}`);
  log(colors.red,   `  ✗ Server errors:   ${errors.length}`);
  log(colors.cyan,  `  ⏱ Total time:      ${elapsed}ms`);
  log(colors.cyan,  `  ⚡ Avg per req:     ${Math.round(elapsed / count)}ms`);

  const passed = succeeded.length <= capacity && errors.length === 0;
  if (passed) {
    log(colors.green + colors.bold, "  ✅ PASS — No overbooking detected");
  } else {
    log(colors.red + colors.bold, `  ❌ FAIL — Overbooking! ${succeeded.length - capacity} extra reservations created`);
  }

  return { passed, ticketNumbers: succeeded.map((r) => r.data.ticketNumber) };
}

// ── TEST 2: Double check-in prevention ───────────────────────────────────────

async function testDoubleCheckIn(ticketNumbers) {
  log(colors.bold + colors.cyan, "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log(colors.bold + colors.cyan, "TEST 2: Concurrent Kiosk Double Check-in");
  log(colors.cyan, "Sending 5 simultaneous check-in requests for the same ticket");
  log(colors.bold + colors.cyan, "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (!ticketNumbers || ticketNumbers.length === 0) {
    log(colors.yellow, "  ⚠ Skipped — no tickets from Test 1");
    return { passed: false };
  }

  const ticket = ticketNumbers[0];
  const concurrency = 5;
  const start = Date.now();

  const results = await Promise.all(
    Array.from({ length: concurrency }, () => kioskCheckIn(ticket))
  );

  const elapsed = Date.now() - start;
  const succeeded = results.filter((r) => r.status === 200);
  const conflicts = results.filter((r) => r.status === 409);
  const errors = results.filter((r) => r.status >= 500);

  log(colors.green, `  ✓ Check-in success: ${succeeded.length} (expected exactly 1)`);
  log(colors.yellow, `  ⚡ Already checked: ${conflicts.length}`);
  log(colors.red,   `  ✗ Server errors:   ${errors.length}`);
  log(colors.cyan,  `  ⏱ Total time:      ${elapsed}ms`);

  const passed = succeeded.length === 1 && errors.length === 0;
  if (passed) {
    log(colors.green + colors.bold, "  ✅ PASS — Exactly one check-in succeeded");
  } else {
    log(colors.red + colors.bold, `  ❌ FAIL — ${succeeded.length} check-ins succeeded (expected 1)`);
  }

  return { passed };
}

// ── TEST 3: Kiosk lookup throughput (multiple kiosks) ────────────────────────

async function testKioskThroughput(ticketNumbers) {
  log(colors.bold + colors.cyan, "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log(colors.bold + colors.cyan, "TEST 3: Kiosk Lookup Throughput (2 kiosks simulation)");
  log(colors.cyan, "Sending 50 concurrent ticket lookups");
  log(colors.bold + colors.cyan, "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (!ticketNumbers || ticketNumbers.length === 0) {
    log(colors.yellow, "  ⚠ Skipped — no tickets available");
    return { passed: false };
  }

  const concurrency = 50;
  const start = Date.now();

  const results = await Promise.all(
    Array.from({ length: concurrency }, (_, i) =>
      kioskLookup(ticketNumbers[i % ticketNumbers.length])
    )
  );

  const elapsed = Date.now() - start;
  const succeeded = results.filter((r) => r.status === 200);
  const errors = results.filter((r) => r.status >= 500);
  const p95 = Math.round(elapsed * 0.95); // rough estimate

  log(colors.green, `  ✓ Lookups success: ${succeeded.length} / ${concurrency}`);
  log(colors.red,   `  ✗ Server errors:   ${errors.length}`);
  log(colors.cyan,  `  ⏱ Total time:      ${elapsed}ms`);
  log(colors.cyan,  `  ⚡ Avg per req:     ${Math.round(elapsed / concurrency)}ms`);

  const passed = errors.length === 0 && succeeded.length === concurrency;
  if (passed) {
    log(colors.green + colors.bold, "  ✅ PASS — All concurrent lookups succeeded");
  } else {
    log(colors.red + colors.bold, "  ❌ FAIL — Some lookups failed");
  }

  return { passed };
}

// ── TEST 4: Sustained load (wave of 100 reservations) ────────────────────────

async function testSustainedLoad(eventId, timeSlots) {
  log(colors.bold + colors.cyan, "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log(colors.bold + colors.cyan, "TEST 4: Sustained Load — 100 reservations in waves");
  log(colors.cyan, "Simulates peak signup period (10 waves × 10 concurrent)");
  log(colors.bold + colors.cyan, "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const waves = 10;
  const perWave = 10;
  let totalSuccess = 0;
  let totalErrors = 0;
  const allStart = Date.now();

  for (let w = 0; w < waves; w++) {
    const slot = timeSlots[w % timeSlots.length];
    const results = await Promise.all(
      Array.from({ length: perWave }, (_, i) =>
        makeReservation(eventId, slot.id, `wave${w}_${i}`)
      )
    );
    const ok = results.filter((r) => r.status === 201 || r.status === 409).length;
    const err = results.filter((r) => r.status >= 500).length;
    totalSuccess += results.filter((r) => r.status === 201).length;
    totalErrors += err;
    process.stdout.write(`  Wave ${w + 1}/${waves}: ${ok}/${perWave} ok  \r`);
    await sleep(100);
  }

  const elapsed = Date.now() - allStart;
  console.log();
  log(colors.green, `  ✓ Total reserved:  ${totalSuccess}`);
  log(colors.red,   `  ✗ Server errors:   ${totalErrors}`);
  log(colors.cyan,  `  ⏱ Total time:      ${elapsed}ms`);
  log(colors.cyan,  `  ⚡ Throughput:      ${Math.round((waves * perWave) / (elapsed / 1000))} req/s`);

  const passed = totalErrors === 0;
  if (passed) {
    log(colors.green + colors.bold, "  ✅ PASS — No server errors under sustained load");
  } else {
    log(colors.red + colors.bold, "  ❌ FAIL — Server errors detected under load");
  }

  return { passed };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  log(colors.bold, `\n🚀 Load Test — ${BASE_URL}`);
  log(colors.cyan, `   Time: ${new Date().toLocaleString("ko-KR")}\n`);

  // Fetch events & slots
  let events;
  try {
    events = await getEvents();
  } catch (e) {
    log(colors.red, `❌ Cannot reach server at ${BASE_URL}`);
    log(colors.red, "   Make sure dev server is running: npm run dev");
    process.exit(1);
  }

  if (!events || events.length === 0) {
    log(colors.red, "❌ No events found. Run seed first: node scripts/seed-demo.mjs");
    process.exit(1);
  }

  const event = events.find((e) => e.status === "ACTIVE") || events[0];

  // Fetch timeslots separately
  const timeSlots = await getTimeSlots(event.id);
  log(colors.cyan, `   Using event: "${event.title}" (${timeSlots.length} slots)`);

  if (!timeSlots || timeSlots.length === 0) {
    log(colors.red, "❌ Event has no time slots. Check seed data.");
    process.exit(1);
  }

  event.timeSlots = timeSlots;

  // Pick a fresh slot with available capacity for race condition test
  const testSlot = timeSlots.find((s) => s.maxCapacity - s.currentCount >= 10) || timeSlots[0];
  const testCapacity = Math.min(testSlot.maxCapacity - testSlot.currentCount, 10); // cap at 10 for speed

  const results = [];

  // Run tests
  const t1 = await testConcurrentReservations(event.id, testSlot.id, testCapacity);
  results.push(t1.passed);

  const t2 = await testDoubleCheckIn(t1.ticketNumbers);
  results.push(t2.passed);

  const t3 = await testKioskThroughput(t1.ticketNumbers);
  results.push(t3.passed);

  const t4 = await testSustainedLoad(event.id, event.timeSlots);
  results.push(t4.passed);

  // Summary
  const passed = results.filter(Boolean).length;
  log(colors.bold + colors.cyan, "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log(colors.bold, "SUMMARY");
  log(colors.bold + colors.cyan, "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log(passed === results.length ? colors.green + colors.bold : colors.red + colors.bold,
    `${passed} / ${results.length} tests passed`);

  if (passed < results.length) {
    log(colors.red, "  Some tests failed. Check logs above.");
    process.exit(1);
  } else {
    log(colors.green, "  All tests passed ✅");
    log(colors.cyan, "  System is safe for concurrent reservations and kiosk usage.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
