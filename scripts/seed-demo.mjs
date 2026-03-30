/**
 * Demo Seed Script
 *
 * Creates realistic demo data:
 * - 1 active event (입주박람회)
 * - 5 days × 6 time slots per day = 30 slots (capacity 50/slot)
 * - 200 pre-made reservations spread across slots
 * - 1 admin account (admin / admin1234)
 *
 * Usage:
 *   DATABASE_URL="file:./prisma/dev.db" node scripts/seed-demo.mjs
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Load env
import { config } from "dotenv";
config();

import crypto from "crypto";

// ── Minimal encryption (mirrors src/lib/encryption.ts) ──────────────────────
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "a1b2c3d4e5f6789012345678901234ab";
const KEY = ENCRYPTION_KEY.length === 64
  ? Buffer.from(ENCRYPTION_KEY, "hex")
  : Buffer.from(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32));

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
  let enc = cipher.update(text, "utf8", "hex");
  enc += cipher.final("hex");
  return iv.toString("hex") + ":" + enc;
}

function generateTicketNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `TK${date}${rand}`;
}

function cuid() {
  return "c" + crypto.randomBytes(8).toString("hex");
}

// ── Prisma ────────────────────────────────────────────────────────────────────
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaLibSql } from "@prisma/adapter-libsql";

const rawUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
const libsqlUrl = rawUrl.replace("file:./", "file:");
const adapter = new PrismaLibSql({ url: libsqlUrl });
const prisma = new PrismaClient({ adapter });

// ── bcrypt (for admin password) ───────────────────────────────────────────────
import bcryptPkg from "bcryptjs";
const bcrypt = bcryptPkg;

// ── Data ──────────────────────────────────────────────────────────────────────

const KOREAN_NAMES = ["김민준","이서연","박도현","최지우","정민서","강하늘","윤서준","임지아","한예진","오시우","신지훈","홍다은","문태양","양수아","배준혁","서나연","고은찬","류하린","전민성","남지현","권태원","황아름","안준서","조하연","송민재","구나영","이준혁","박서현","최민규","정하영"];
const BUILDINGS = ["101동","102동","103동","104동","105동","106동","107동","108동","201동","202동"];
const INTERESTS_POOL = ["가구","방충망","에어컨/냉난방","입주청소","이사","인테리어","전동커튼/블라인드","조명","보안/방범","주방기기","욕실/위생","홈네트워크","기타"];

function randomName() { return KOREAN_NAMES[Math.floor(Math.random() * KOREAN_NAMES.length)]; }
function randomBuilding() { return BUILDINGS[Math.floor(Math.random() * BUILDINGS.length)]; }
function randomUnit() { return `${Math.floor(Math.random() * 19 + 1)}0${Math.floor(Math.random() * 9 + 1)}`; }
function randomPhone() { return `010${String(Math.floor(Math.random() * 90000000 + 10000000))}`; }
function randomInterests() {
  const count = Math.floor(Math.random() * 4) + 1;
  const shuffled = [...INTERESTS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).join(",");
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding demo data...\n");

  // Clean existing data
  await prisma.reservation.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.event.deleteMany();
  await prisma.admin.deleteMany();
  console.log("  ✓ Cleared existing data");

  // Admin account
  const hashedPw = await bcrypt.hash("admin1234", 10);
  await prisma.admin.create({
    data: { id: cuid(), username: "admin", password: hashedPw },
  });
  console.log("  ✓ Admin account created (admin / admin1234)");

  // Event: 5 days from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventStart = new Date(today);
  eventStart.setDate(today.getDate() + 3); // starts 3 days from now
  const eventEnd = new Date(eventStart);
  eventEnd.setDate(eventStart.getDate() + 4); // 5 days total

  const event = await prisma.event.create({
    data: {
      id: cuid(),
      title: "래미안 포레스트 입주박람회",
      description: "새 아파트 입주를 맞아 가구, 인테리어, 생활 서비스를 한 자리에서 만나보세요. 입주민 전용 특별 할인 혜택을 제공합니다.",
      location: "래미안 포레스트 커뮤니티센터 1층",
      startDate: eventStart,
      endDate: eventEnd,
      imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
      maxCapacity: 1500,
      status: "ACTIVE",
    },
  });
  console.log(`  ✓ Event created: "${event.title}"`);

  // Time slots: 5 days × 6 slots (10:00~18:00, every 90 min)
  const slotTimes = [
    { start: "10:00", end: "11:30" },
    { start: "11:30", end: "13:00" },
    { start: "13:00", end: "14:30" },
    { start: "14:30", end: "16:00" },
    { start: "16:00", end: "17:30" },
    { start: "17:30", end: "19:00" },
  ];

  const SLOT_CAPACITY = 50;
  const timeSlots = [];

  for (let day = 0; day < 5; day++) {
    const slotDate = new Date(eventStart);
    slotDate.setDate(eventStart.getDate() + day);

    for (const t of slotTimes) {
      const slot = await prisma.timeSlot.create({
        data: {
          id: cuid(),
          eventId: event.id,
          date: slotDate,
          startTime: t.start,
          endTime: t.end,
          maxCapacity: SLOT_CAPACITY,
          currentCount: 0,
        },
      });
      timeSlots.push(slot);
    }
  }
  console.log(`  ✓ ${timeSlots.length} time slots created (${SLOT_CAPACITY} capacity each)`);

  // Reservations: 200 spread across slots (simulate realistic pre-bookings)
  const TOTAL_RESERVATIONS = 200;
  let created = 0;

  // Group reservations: more in first 2 days (popular early slots)
  const weights = [0.28, 0.22, 0.18, 0.15, 0.17]; // day weights
  const daySlots = [0, 1, 2, 3, 4].map((d) =>
    timeSlots.slice(d * 6, d * 6 + 6)
  );

  for (let d = 0; d < 5; d++) {
    const dayCount = Math.round(TOTAL_RESERVATIONS * weights[d]);
    const slotsForDay = daySlots[d];

    for (let i = 0; i < dayCount; i++) {
      // Pick a slot (weighted towards midday)
      const slotIdx = Math.min(Math.floor(Math.abs(Math.random() * 6)), 5);
      const slot = slotsForDay[slotIdx];

      // Skip if slot is full
      if (slot.currentCount >= slot.maxCapacity) continue;

      const name = randomName();
      const status = Math.random() < 0.08 ? "CHECKED_IN" : "CONFIRMED"; // 8% already checked in

      await prisma.reservation.create({
        data: {
          id: cuid(),
          ticketNumber: generateTicketNumber(),
          eventId: event.id,
          timeSlotId: slot.id,
          name: encrypt(name),
          phone: encrypt(randomPhone()),
          email: encrypt(`${name.toLowerCase()}${Math.floor(Math.random()*999)}@demo.kr`),
          address: encrypt(`${randomBuilding()} ${randomUnit()}호`),
          interests: randomInterests(),
          partySize: 1,
          qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          privacyConsent: true,
          marketingConsent: Math.random() > 0.5,
          status,
          checkedInAt: status === "CHECKED_IN" ? new Date() : null,
        },
      });

      // Update slot count
      await prisma.timeSlot.update({
        where: { id: slot.id },
        data: { currentCount: { increment: 1 } },
      });

      slot.currentCount++;
      created++;
    }
  }
  console.log(`  ✓ ${created} reservations created`);

  // Print a few ticket numbers for manual kiosk testing
  const sampleReservations = await prisma.reservation.findMany({
    take: 10,
    where: { status: "CONFIRMED" },
    orderBy: { createdAt: "desc" },
  });

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Seed complete! Manual test info:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Event ID:    ${event.id}`);
  console.log(`  Admin login: admin / admin1234`);
  console.log(`  Admin URL:   http://localhost:3000/admin/login`);
  console.log("\n  Sample ticket numbers for kiosk testing:");
  sampleReservations.forEach((r, i) => {
    console.log(`  [${i + 1}] ${r.ticketNumber}`);
  });
  console.log("\n  Kiosk URL:   http://localhost:3000/kiosk");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
