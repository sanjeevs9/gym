import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// True singleton, in dev AND production. Aiven's plan caps max_connections
// at 20 (with several always reserved for its own internal processes), and
// every serverless instance that skips this cache opens its own connection
// pool — a couple of concurrent/warm invocations was enough to hit
// P2037 "too many clients already". Caching on globalThis means a warm
// Vercel instance reuses the same pool across invocations instead of
// creating a new one each time; a genuine cold start gets a fresh
// globalThis anyway, so this never leaks across real isolates.
function createClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    max: 1,
  });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();

globalForPrisma.prisma = db;
