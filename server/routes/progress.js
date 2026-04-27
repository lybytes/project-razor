import { Router } from "express";
import pool from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

const BASE_XP = 50;
const BONUS_XP_THRESHOLD = 80;
const BONUS_XP = 10;

// POST /progress/complete (protected)
router.post("/complete", authenticate, async (req, res) => {
  const client = await pool.connect();
  try {
    const { lesson_id, module_id, score } = req.body;
    const userId = req.userId;

    if (!lesson_id || module_id === undefined) {
      return res.status(400).json({ error: "lesson_id and module_id are required" });
    }

    await client.query("BEGIN");

    // Check if lesson was already completed
    const existing = await client.query(
      "SELECT id FROM progress WHERE user_id = $1 AND lesson_id = $2",
      [userId, lesson_id]
    );
    const isFirstCompletion = existing.rows.length === 0;

    // Upsert progress (update score only if higher)
    await client.query(
      `INSERT INTO progress (user_id, lesson_id, module_id, score)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, lesson_id)
       DO UPDATE SET score = GREATEST(progress.score, EXCLUDED.score),
                     completed_at = NOW()`,
      [userId, lesson_id, module_id, score || 0]
    );

    // Only grant XP on first completion
    const xpGain = isFirstCompletion
      ? BASE_XP + (score >= BONUS_XP_THRESHOLD ? BONUS_XP : 0)
      : 0;

    // Streak logic
    const userResult = await client.query("SELECT * FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    let newStreak = user.current_streak;
    let newLongest = user.longest_streak;

    if (user.last_activity_date) {
      const lastDate = new Date(user.last_activity_date);
      lastDate.setUTCHours(0, 0, 0, 0);
      const lastStr = lastDate.toISOString().split("T")[0];

      if (lastStr === todayStr) {
        // Already active today — no streak change
      } else {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        if (lastStr === yesterdayStr) {
          newStreak = user.current_streak + 1;
          if (newStreak > newLongest) newLongest = newStreak;
        } else {
          newStreak = 1;
        }
      }
    } else {
      newStreak = 1;
    }

    // Update user stats
    await client.query(
      `UPDATE users
       SET total_xp = total_xp + $1,
           current_streak = $2,
           longest_streak = $3,
           last_activity_date = $4
       WHERE id = $5`,
      [xpGain, newStreak, newLongest, todayStr, userId]
    );

    await client.query("COMMIT");

    res.json({
      current_streak: newStreak,
      longest_streak: newLongest,
      total_xp: user.total_xp + xpGain,
      xp_gained: xpGain,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Progress complete error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

// GET /progress (protected)
router.get("/", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT lesson_id, module_id, score, completed_at
       FROM progress
       WHERE user_id = $1
       ORDER BY completed_at ASC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get progress error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
