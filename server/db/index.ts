import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("⚠️ Warning: DATABASE_URL environment variable is not defined!");
}

// Configured for optimal connection pooling and SSL on Neon PostgreSQL
const client = postgres(connectionString || "", {
  ssl: "require",
  max: 20,                 
  idle_timeout: 30,        
  connect_timeout: 30,     
  onparameter: (key, val) => {
  }
});

export const db = drizzle(client, { schema });

