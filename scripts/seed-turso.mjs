/**
 * Turso Seed Script
 *
 * Creates:
 * - 1 admin account (admin / admin1234)
 * - 5 events with time slots
 * - 1000 reservations spread across events/slots
 *
 * Usage (PowerShell):
 *   node scripts/seed-turso.mjs
 */

import crypto from "crypto";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcryptPkg from "bcryptjs";
const bcrypt = bcryptPkg;

// ── Connect to Turso ─────────────────────────────────────────────────────────

const RAW_URL =
  "libsql://reverse-edencns.aws-ap-northeast-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQ4NTE2MjYsImlkIjoiMDE5ZDNkNjUtNDUwMS03NDcyLWFhMTMtODE2MjUwNDE0NjhiIiwicmlkIjoiNzc1ZTdiMjUtY2QwYy00ZDliLTk5OTQtYTgwNWY4YTk1ZjJlIn0.5BPYypnzpzPTiEt08QbS0seZ4i0DEC0Dvm0ojTu_C3qMpbTruxPmE6fNpbuHKMWrPGXpur9cJVpVSAgzHU1qDw";

const parsed = new URL(RAW_URL);
const TURSO_AUTH_TOKEN = parsed.searchParams.get("authToken");
parsed.searchParams.delete("authToken");
const TURSO_URL = parsed.toString();

const adapter = new PrismaLibSql({ url: TURSO_URL, authToken: TURSO_AUTH_TOKEN });
const prisma = new PrismaClient({ adapter });

// ── Helpers ──────────────────────────────────────────────────────────────────

function cuid() {
  return "c" + crypto.randomBytes(8).toString("hex");
}

function generateTicketNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `TK${date}${rand}`;
}

// Simple mock encrypt (mirrors src/lib/encryption.ts pattern)
const ENC_KEY = Buffer.from("a1b2c3d4e5f6789012345678901234ab".padEnd(32, "0").slice(0, 32));
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, iv);
  let enc = cipher.update(text, "utf8", "hex");
  enc += cipher.final("hex");
  return iv.toString("hex") + ":" + enc;
}

const NAMES = ["김민준","이서연","박도현","최지우","정민서","강하늘","윤서준","임지아","한예진","오시우","신지훈","홍다은","문태양","양수아","배준혁","서나연","고은찬","류하린","전민성","남지현","권태원","황아름","안준서","조하연","송민재","구나영","이준혁","박서현","최민규","정하영","김태희","이종호","박수빈","최현우","정다은","강민철","윤하은","임성진","한소희","오민준","신예원","홍준서","문지수","양민호","배서아","서준영","고다현","류민서","전지호","남수아"];
const BUILDINGS = ["101동","102동","103동","104동","105동","106동","107동","108동","201동","202동","203동","204동"];
const INTERESTS = ["가구","방충망","에어컨/냉난방","입주청소","이사","인테리어","전동커튼/블라인드","조명","보안/방범","주방기기","욕실/위생","홈네트워크","기타"];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randName = () => rand(NAMES);
const randPhone = () => `010${randInt(10000000, 99999999)}`;
const randUnit = () => `${rand(BUILDINGS)} ${randInt(1, 20)}0${randInt(1, 9)}호`;
const randInterests = () => {
  const n = randInt(1, 4);
  return [...INTERESTS].sort(() => Math.random() - 0.5).slice(0, n).join(",");
};

const SLOT_TIMES = [
  { start: "10:00", end: "11:30" },
  { start: "11:30", end: "13:00" },
  { start: "13:00", end: "14:30" },
  { start: "14:30", end: "16:00" },
  { start: "16:00", end: "17:30" },
  { start: "17:30", end: "19:00" },
];

// ── Event definitions ────────────────────────────────────────────────────────

function makeEventDates(offsetDays, durationDays) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  const end = new Date(d);
  end.setDate(d.getDate() + durationDays - 1);
  return { startDate: d, endDate: end };
}

const EVENTS = [
  {
    title: "래미안 포레스트 입주박람회",
    slug: "raemian-forest-expo",
    description: "새 아파트 입주를 맞아 가구, 인테리어, 생활 서비스를 한 자리에서 만나보세요. 입주민 전용 특별 할인 혜택을 제공합니다.",
    location: "래미안 포레스트 커뮤니티센터 1층",
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
    maxCapacity: 1500,
    status: "ACTIVE",
    daysOffset: 3,
    duration: 5,
  },
  {
    title: "힐스테이트 리빙 페스타",
    slug: "hillstate-living-festa",
    description: "프리미엄 라이프스타일 브랜드 총집합. 주방, 욕실, 스마트홈까지 한눈에 비교하고 계약하세요.",
    location: "힐스테이트 서울 커뮤니티홀",
    imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80",
    maxCapacity: 1200,
    status: "ACTIVE",
    daysOffset: 10,
    duration: 3,
  },
  {
    title: "자이 인테리어 & 스마트홈 쇼",
    slug: "xi-smart-home-show",
    description: "AI 홈네트워크, 자동화 조명, 프리미엄 가전까지. 미래형 주거 트렌드를 직접 체험하세요.",
    location: "자이 갤러리 B동 4층",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80",
    maxCapacity: 800,
    status: "ACTIVE",
    daysOffset: 17,
    duration: 2,
  },
  {
    title: "푸르지오 이사·청소 서비스 박람회",
    slug: "prugio-moving-service",
    description: "입주 시 필요한 이사, 청소, 에어컨 설치까지. 검증된 업체들과 현장에서 바로 계약하고 할인 혜택을 받으세요.",
    location: "푸르지오 센트럴파크 지하 1층",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
    maxCapacity: 600,
    status: "UPCOMING",
    daysOffset: 25,
    duration: 2,
  },
  {
    title: "더샵 리빙 & 가든 엑스포",
    slug: "thesharp-living-garden",
    description: "발코니 확장, 조경, 홈가드닝 전문 업체 대거 참여. 나만의 공간을 꾸미는 아이디어를 얻어가세요.",
    location: "더샵 아트리움 컨벤션홀",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80",
    maxCapacity: 1000,
    status: "UPCOMING",
    daysOffset: 33,
    duration: 3,
  },
];

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding Turso database...\n");

  // Clear existing data
  await prisma.reservation.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.event.deleteMany();
  await prisma.admin.deleteMany();
  console.log("  Cleared existing data");

  // Admin account
  const hashedPw = await bcrypt.hash("admin1234", 10);
  await prisma.admin.create({
    data: { id: cuid(), username: "admin", password: hashedPw },
  });
  console.log("  Admin created: admin / admin1234");

  // Events + slots
  const allSlots = []; // { slot, eventId, eventTitle }
  for (const def of EVENTS) {
    const { startDate, endDate } = makeEventDates(def.daysOffset, def.duration);
    const event = await prisma.event.create({
      data: {
        id: cuid(),
        title: def.title,
        slug: def.slug,
        description: def.description,
        location: def.location,
        imageUrl: def.imageUrl,
        maxCapacity: def.maxCapacity,
        status: def.status,
        startDate,
        endDate,
        updatedAt: new Date(),
      },
    });

    for (let day = 0; day < def.duration; day++) {
      const slotDate = new Date(startDate);
      slotDate.setDate(startDate.getDate() + day);
      for (const t of SLOT_TIMES) {
        const slot = await prisma.timeSlot.create({
          data: {
            id: cuid(),
            eventId: event.id,
            date: slotDate,
            startTime: t.start,
            endTime: t.end,
            maxCapacity: 50,
            currentCount: 0,
          },
        });
        allSlots.push({ slot, eventId: event.id, eventTitle: def.title });
      }
    }
    console.log(`  Event: "${def.title}" (${def.duration * SLOT_TIMES.length} slots)`);
  }

  // 1000 reservations spread across all slots
  const TARGET = 1000;
  let created = 0;
  const slotCountMap = {};
  const sampleTickets = [];

  while (created < TARGET) {
    const { slot, eventId } = allSlots[randInt(0, allSlots.length - 1)];
    const count = slotCountMap[slot.id] || 0;
    if (count >= slot.maxCapacity) continue;

    const name = randName();
    const status = Math.random() < 0.08 ? "CHECKED_IN" : "CONFIRMED";
    const ticketNumber = generateTicketNumber();

    await prisma.reservation.create({
      data: {
        id: cuid(),
        ticketNumber,
        eventId,
        timeSlotId: slot.id,
        name: encrypt(name),
        phone: encrypt(randPhone()),
        email: encrypt(`${name}${randInt(1, 999)}@demo.kr`),
        address: encrypt(randUnit()),
        unitAddress: randUnit(),
        interests: randInterests(),
        partySize: 1,
        status,
        qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        privacyConsent: true,
        marketingConsent: Math.random() > 0.5,
        checkedInAt: status === "CHECKED_IN" ? new Date() : null,
      },
    });

    await prisma.timeSlot.update({
      where: { id: slot.id },
      data: { currentCount: { increment: 1 } },
    });

    slotCountMap[slot.id] = count + 1;
    if (sampleTickets.length < 5) sampleTickets.push(ticketNumber);
    created++;

    if (created % 100 === 0) process.stdout.write(`\r  Reservations: ${created} / ${TARGET}`);
  }
  console.log(`\r  Reservations: ${created} / ${TARGET} - done     `);

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Admin login : admin / admin1234");
  console.log("  Events      : 5개");
  console.log("  Reservations: " + created + "개");
  console.log("\n  Sample ticket numbers (kiosk test):");
  sampleTickets.forEach((t, i) => console.log(`    [${i + 1}] ${t}`));
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
