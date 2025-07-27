import { pool } from "../config/db.js";

export async function upsertUser(userId, email) {
  try {
    const result = await pool.query(
      `INSERT INTO users (id, email)
       VALUES ($1, $2)
       ON CONFLICT (id) DO NOTHING
       RETURNING id`,
      [userId, email]
    );
    return result.rowCount > 0; // true if inserted, false if already existed
  } catch (error) {
    console.error("Failed to upsert user:", error.message);
    throw error;
  }
}

