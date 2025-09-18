import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

// Optimized Prisma Client with better performance
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    errorFormat: 'minimal',
  });
}

export const prisma = globalForPrisma.__prisma__ || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma__ = prisma;
}

// Graceful shutdown
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}
