import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
  // Convert "file:./dev.db" to "file:dev.db" for libsql (relative path)
  const libsqlUrl = rawUrl.replace("file:./", "file:");

  // Extract authToken from query string if present (e.g. libsql://...?authToken=...)
  let url = libsqlUrl;
  let authToken: string | undefined;
  try {
    const parsed = new URL(libsqlUrl);
    const token = parsed.searchParams.get("authToken");
    if (token) {
      authToken = token;
      parsed.searchParams.delete("authToken");
      url = parsed.toString();
    }
  } catch {
    // not a URL (e.g. file:dev.db) — leave as-is
  }

  const adapter = new PrismaLibSql({ url, authToken });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter: adapter as any });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
