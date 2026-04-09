// db.js
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.NEON_CONNECTION_STRING;

if (!connectionString) {
  throw new Error(
    "Missing Postgres connection string. Set DATABASE_URL in backend/.env (e.g. DATABASE_URL=postgresql://user:pass@host/db)."
  );
}

export const sql = neon(connectionString);
