
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./db.js";

// Get the current file's location
const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

// Find the schema.sql file in the database folder
const schemaPath = path.join(
  currentDirectory,
  "../database/schema.sql"
);

// Read all table creation queries
const sql = fs.readFileSync(schemaPath, "utf8");

// Execute the queries in PostgreSQL
async function setupDatabase() {
  try {
    await pool.query(sql);
    console.log("Database tables created successfully!");
  } catch (error) {
    console.error("Database setup failed:", error.message);
  } finally {
    await pool.end();
  }
}

setupDatabase();
