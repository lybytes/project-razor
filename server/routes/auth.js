import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
const SALT_ROUNDS = 10;
const JWT_EXPIRY = "30d";

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

function userResponse(row) {
  return {
    id: row.id,
    email: row.email,
    display_name: row.display_name,
    current_streak: row.current_streak,
    longest_streak: row.longest_streak,
    total_xp: row.total_xp,
  };
}

// POST /auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, display_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (email, display_name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [email, display_name || null, passwordHash]
    );

    const user = result.rows[0];
    const token = signToken(user.id);

    res.status(201).json({ token, user: userResponse(user) });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user.id);

    res.json({ token, user: userResponse(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /auth/me (protected)
router.get("/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: userResponse(result.rows[0]) });
  } catch (err) {
    console.error("Auth/me error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
