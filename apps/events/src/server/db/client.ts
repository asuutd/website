// src/server/db/client.ts
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated';
import { env } from '../../env/server.mjs';
import ws from 'ws';

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

const initAdapter = () => {
	const connectionString = env.DATABASE_URL;
	const url = new URL(connectionString);
	if (!url.host.endsWith('.neon.tech')) {
		return new PrismaPg({connectionString})
	}

	neonConfig.webSocketConstructor = ws;
  return new PrismaNeon({ connectionString });
};

console.log("abc")
const initPrisma = () => {
	const prisma = new PrismaClient({
		log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
		adapter: initAdapter()
	});
	return prisma;
};
console.log("def")

export const prisma = global.prisma || initPrisma();
console.log("get")

if (env.NODE_ENV !== 'production') {
	global.prisma = prisma;
}
