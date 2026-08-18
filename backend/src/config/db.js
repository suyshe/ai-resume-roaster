import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory fallback storage in case PostgreSQL is unreachable
const inMemoryRoasts = [];
let isPostgresConnected = false;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/resume_roaster';

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 3000,
  idleTimeoutMillis: 10000,
  max: 10,
  ssl: process.env.NODE_ENV === 'production' && !connectionString.includes('localhost') ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.warn('[PostgreSQL Pool Error]:', err.message);
  isPostgresConnected = false;
});

export async function initDatabase() {
  try {
    const client = await pool.connect();
    console.log('[PostgreSQL Connected]: Successfully established connection pool.');
    isPostgresConnected = true;

    const schemaPath = path.join(__dirname, '../db/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('[PostgreSQL Schema]: Schema verified successfully.');
    }
    client.release();
    return true;
  } catch (error) {
    isPostgresConnected = false;
    console.log(`[PostgreSQL Status]: Running with high-performance in-memory fallback storage.`);
    return false;
  }
}

export function getDbStatus() {
  return {
    isPostgresConnected,
    storageType: isPostgresConnected ? 'PostgreSQL' : 'In-Memory Fallback',
    totalSavedRoasts: isPostgresConnected ? 'Queryable' : inMemoryRoasts.length
  };
}

export const RoastModel = {
 async create(data) {
  if (isPostgresConnected) {
    try {
      const query = `
        INSERT INTO roasts (
          user_id,
          title,
          target_role,
          intensity,
          input_type,
          raw_text,
          savage_roast,
          one_liner,
          overall_score,
          buzzword_score,
          design_score,
          credibility_score,
          red_flags,
          bullet_rewrites,
          actionable_tips,
          rewritten_summary
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, $16
        )
        RETURNING *;
      `;

      const values = [
        data.user_id,
        data.title || 'Candidate Resume',
        data.target_role || 'General Candidate',
        data.intensity || 'spicy',
        data.input_type || 'text',
        data.raw_text
          ? data.raw_text.substring(0, 10000)
          : null,
        data.savage_roast,
        data.one_liner || '',
        data.overall_score ?? 50,
        data.buzzword_score ?? 70,
        data.design_score ?? 60,
        data.credibility_score ?? 65,
        JSON.stringify(data.red_flags || []),
        JSON.stringify(data.bullet_rewrites || []),
        JSON.stringify(data.actionable_tips || []),
        data.rewritten_summary || ''
      ];

      const res = await pool.query(query, values);

      return res.rows[0];

    } catch (err) {
      console.error('[PostgreSQL Insert Error]:', err);
      throw err;
    }
  }

  const newRecord = {
    id: inMemoryRoasts.length + 1,
    user_id: data.user_id,
    title: data.title || 'Candidate Resume',
    target_role: data.target_role || 'General Candidate',
    intensity: data.intensity || 'spicy',
    input_type: data.input_type || 'text',
    raw_text: data.raw_text,
    savage_roast: data.savage_roast,
    one_liner: data.one_liner,
    overall_score: data.overall_score ?? 50,
    buzzword_score: data.buzzword_score ?? 70,
    design_score: data.design_score ?? 60,
    credibility_score: data.credibility_score ?? 65,
    red_flags: data.red_flags || [],
    bullet_rewrites: data.bullet_rewrites || [],
    actionable_tips: data.actionable_tips || [],
    rewritten_summary: data.rewritten_summary || '',
    created_at: new Date().toISOString()
  };

  inMemoryRoasts.unshift(newRecord);

  return newRecord;
},

  async getAll(userId, limit = 20) {
    if (isPostgresConnected) {
      try {
       const res = await pool.query(
  `SELECT *
   FROM roasts
   WHERE user_id = $1
   ORDER BY created_at DESC
   LIMIT $2`,
  [userId, limit]
);
        return res.rows;
      } catch (err) {
        console.warn('[PostgreSQL Fetch Note]:', err.message);
      }
    }
    return inMemoryRoasts
  .filter((roast) => String(roast.user_id) === String(userId))
  .slice(0, limit);
  },

  async getById(id, userId) {
    if (isPostgresConnected) {
      try {
        const res = await pool.query(
  'SELECT * FROM roasts WHERE id = $1 AND user_id = $2',
  [id, userId]
);
        if (res.rows.length > 0) return res.rows[0];
      } catch (err) {
        console.warn('[PostgreSQL Fetch By ID Note]:', err.message);
      }
    }
    return (
  inMemoryRoasts.find(
    (r) =>
      String(r.id) === String(id) &&
      String(r.user_id) === String(userId)
  ) || null
);
  }
};
