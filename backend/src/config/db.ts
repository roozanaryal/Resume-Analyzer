import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully via PrismaPg TCP adapter");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
};

const disconnect = async () => {
  try {
    await prisma.$disconnect();
    await pool.end();
  } catch (error) {
    console.error("Database disconnection failed", error);
  }
};

export { prisma, connectDB, disconnect };
