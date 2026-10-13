
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Connect to the TaskFlow PostgreSQL database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

// Check the database connection
pool.on("connect", () => {
  console.log("PostgreSQL client connected");
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error.message);
});

export default pool;
