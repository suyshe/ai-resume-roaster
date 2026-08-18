import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );
}

export const AuthController = {
  async register(req, res) {
    try {
      const { email, password } = req.body;

      const normalizedEmail = email?.trim().toLowerCase();

      if (!normalizedEmail || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required.'
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters.'
        });
      }

      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [normalizedEmail]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email already exists.'
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const result = await pool.query(
        `INSERT INTO users (email, password_hash)
         VALUES ($1, $2)
         RETURNING id, email, created_at`,
        [normalizedEmail, passwordHash]
      );

      const user = result.rows[0];

      const token = createToken(user);

      return res.status(201).json({
        success: true,
        data: {
          user,
          token
        }
      });
    } catch (error) {
      console.error('[Register Error]:', error);

      return res.status(500).json({
        success: false,
        error: 'Unable to create account.'
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const normalizedEmail = email?.trim().toLowerCase();

      if (!normalizedEmail || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required.'
        });
      }

      const result = await pool.query(
        `SELECT id, email, password_hash, created_at
         FROM users
         WHERE email = $1`,
        [normalizedEmail]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password.'
        });
      }

      const user = result.rows[0];

      const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password.'
        });
      }

      const token = createToken(user);

      return res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            created_at: user.created_at
          },
          token
        }
      });
    } catch (error) {
      console.error('[Login Error]:', error);

      return res.status(500).json({
        success: false,
        error: 'Unable to log in.'
      });
    }
  }
};