import { z } from "zod";

export const reservationSchema = z.object({
  eventId: z.string().min(1, "행사를 선택해주세요"),
  timeSlotId: z.string().min(1, "시간대를 선택해주세요"),
  name: z.string().min(2, "이름은 2자 이상이어야 합니다").max(20, "이름은 20자 이하여야 합니다"),
  phone: z
    .string()
    .regex(/^01[0-9]-?\d{3,4}-?\d{4}$/, "올바른 휴대폰 번호를 입력해주세요"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  address: z.string().optional(),
  partySize: z.number().min(1).max(10),
  privacyConsent: z.boolean().refine((v) => v === true, { message: "개인정보 수집에 동의해주세요" }),
  marketingConsent: z.boolean().optional().default(false),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, "아이디를 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

export const eventSchema = z.object({
  title: z.string().min(2, "행사명은 2자 이상이어야 합니다"),
  description: z.string().min(10, "행사 설명은 10자 이상이어야 합니다"),
  location: z.string().min(2, "장소를 입력해주세요"),
  startDate: z.string().min(1, "시작일을 입력해주세요"),
  endDate: z.string().min(1, "종료일을 입력해주세요"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  maxCapacity: z.number().min(1, "최대 수용인원을 입력해주세요"),
  status: z.enum(["UPCOMING", "ACTIVE", "CLOSED"]),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type EventInput = z.infer<typeof eventSchema>;
