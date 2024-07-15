// src/server/db/client.ts
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from "@prisma/client";
import { env } from "../../env/server.mjs";
import ws from 'ws';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const initNeonPrismaServerlessAdapter = () => {
  const connectionString = `${process.env.DATABASE_URL}`;
  const url = new URL(connectionString);
  if (!url.host.endsWith('.neon.tech')) {
    return null
  }

  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  return adapter;
}

const initPrisma = () => {

  const prisma = new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    adapter: initNeonPrismaServerlessAdapter()
  })
  return prisma
}

export const prisma =
  global.prisma ||
  initPrisma();

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
