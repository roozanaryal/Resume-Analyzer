import { prisma, disconnect } from './src/config/db.js';

async function main() {
  await prisma.$executeRaw`ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'SHORTLISTED'`;
  await prisma.$executeRaw`UPDATE "Application" SET status = 'SHORTLISTED' WHERE status = 'REVIEWED'`;
  console.log('Status updated via RAW SQL');
}

main().catch(console.error).finally(() => disconnect());
