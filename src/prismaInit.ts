import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();
const connectionString =
  process.env.ENVIRONMENT === "dev"
    ? (process.env.DEV_DATABASE_URL ?? "")
    : process.env.DATABASE_URL;

console.log("ENVIRONMENT:", process.env.ENVIRONMENT);
console.log("Using DATABASE_URL:", connectionString);

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export default prisma;
