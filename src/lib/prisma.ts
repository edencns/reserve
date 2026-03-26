import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";
  // Convert "file:./dev.db" to "file:dev.db" for libsql (relative path)
  const libsqlUrl = rawUrl.replace("file:./", "file:");

  // PrismaLibSql factory accepts config with url
  const adapter = new PrismaLibSql({ url: libsqlUrl });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter: adapter as any });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
