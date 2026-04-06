import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();
const adapter = new PrismaPg({
  connectionString:
    process.env.ENVIRONMENT === "dev"
      ? (process.env.DEV_DATABASE_URL ?? "")
      : process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
export default prisma;
