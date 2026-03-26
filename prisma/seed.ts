import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const rawUrl = process.env.DATABASE_URL || "file:./dev.db";
const libsqlUrl = rawUrl.replace("file:./", "file:");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url: libsqlUrl }) as any });

async function main() {
  console.log("Seeding database...");

  // Create admin
  const hashedPassword = await bcrypt.hash("admin1234", 12);
  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });
  console.log("Admin created:", admin.username);

  // Create Events
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextMonth = new Date(now);
  nextMonth.setDate(nextMonth.getDate() + 30);

  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const event1 = await prisma.event.upsert({
    where: { id: "event-001" },
    update: {},
    create: {
      id: "event-001",
      title: "2024 강남 프리미엄 아파트 입주박람회",
      description: "강남 최고의 프리미엄 아파트 단지들이 한자리에 모이는 대규모 입주박람회입니다. 래미안, 힐스테이트, 자이 등 주요 브랜드 아파트의 입주 정보를 한 번에 확인하고 특별 혜택을 받아보세요. 실내 인테리어 상담, 이사 서비스 할인, 가전 패키지 특가 등 다양한 혜택을 제공합니다.",
      location: "COEX 전시관 A·B홀 (서울 강남구 영동대로 513)",
      startDate: now,
      endDate: nextWeek,
      maxCapacity: 500,
      status: "ACTIVE",
      imageUrl: null,
    },
  });

  const event2 = await prisma.event.upsert({
    where: { id: "event-002" },
    update: {},
    create: {
      id: "event-002",
      title: "2024 판교 신도시 아파트 분양 박람회",
      description: "판교 테크노밸리 인근 신규 아파트 단지 분양 정보를 한 곳에서 확인하세요. IT 기업 종사자를 위한 특별 할인과 편리한 교통 여건을 갖춘 프리미엄 주거 단지들을 소개합니다. 스마트홈 시스템 시연 및 VR 모델하우스 체험 가능.",
      location: "판교 알파돔시티 컨벤션홀 (경기 성남시 분당구)",
      startDate: nextWeek,
      endDate: nextMonth,
      maxCapacity: 300,
      status: "UPCOMING",
      imageUrl: null,
    },
  });

  const event3 = await prisma.event.upsert({
    where: { id: "event-003" },
    update: {},
    create: {
      id: "event-003",
      title: "2024 인천 검단 신도시 입주 박람회",
      description: "GTX-D 노선 개통 예정으로 서울 접근성이 대폭 향상되는 검단 신도시의 신규 아파트 입주 정보를 확인하세요. 합리적인 가격의 대단지 아파트들을 소개합니다.",
      location: "인천 서구 검단스포츠컴플렉스 전시장",
      startDate: lastWeek,
      endDate: tomorrow,
      maxCapacity: 200,
      status: "CLOSED",
      imageUrl: null,
    },
  });

  console.log("Events created:", event1.title, event2.title, event3.title);

  // Create Time Slots for Event 1 (Active)
  const dates = [now, tomorrow];
  const times = [
    { start: "10:00", end: "11:00", cap: 30 },
    { start: "11:00", end: "12:00", cap: 30 },
    { start: "13:00", end: "14:00", cap: 40 },
    { start: "14:00", end: "15:00", cap: 40 },
    { start: "15:00", end: "16:00", cap: 30 },
    { start: "16:00", end: "17:00", cap: 25 },
  ];

  const slots = [];
  for (let d = 0; d < dates.length; d++) {
    for (let t = 0; t < times.length; t++) {
      const slotDate = new Date(dates[d]);
      slotDate.setHours(0, 0, 0, 0);
      const slot = await prisma.timeSlot.upsert({
        where: { id: `slot-e1-d${d}-t${t}` },
        update: {},
        create: {
          id: `slot-e1-d${d}-t${t}`,
          eventId: "event-001",
          date: slotDate,
          startTime: times[t].start,
          endTime: times[t].end,
          maxCapacity: times[t].cap,
          currentCount: Math.floor(Math.random() * (times[t].cap * 0.6)),
        },
      });
      slots.push(slot);
    }
  }

  // Create Time Slots for Event 2 (Upcoming)
  const futureDate1 = new Date(nextWeek);
  futureDate1.setHours(0, 0, 0, 0);
  const futureDate2 = new Date(nextWeek);
  futureDate2.setDate(futureDate2.getDate() + 1);
  futureDate2.setHours(0, 0, 0, 0);

  const futureTimes = [
    { start: "10:00", end: "12:00" },
    { start: "13:00", end: "15:00" },
    { start: "15:00", end: "17:00" },
  ];

  for (let d = 0; d < 2; d++) {
    for (let t = 0; t < futureTimes.length; t++) {
      await prisma.timeSlot.upsert({
        where: { id: `slot-e2-d${d}-t${t}` },
        update: {},
        create: {
          id: `slot-e2-d${d}-t${t}`,
          eventId: "event-002",
          date: d === 0 ? futureDate1 : futureDate2,
          startTime: futureTimes[t].start,
          endTime: futureTimes[t].end,
          maxCapacity: 30,
          currentCount: 0,
        },
      });
    }
  }

  console.log("Time slots created");
  console.log("\nSeed completed!");
  console.log("Admin login: admin / admin1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
