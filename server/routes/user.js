import { Router } from "express";
import pool from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// GET /user/stats (protected)
router.get("/stats", authenticate, async (req, res) => {
  try {
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [req.userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult.rows[0];

    const countResult = await pool.query(
      "SELECT COUNT(*) AS lessons_completed FROM progress WHERE user_id = $1",
      [req.userId]
    );

    res.json({
      current_streak: user.current_streak,
      longest_streak: user.longest_streak,
      total_xp: user.total_xp,
      lessons_completed: parseInt(countResult.rows[0].lessons_completed, 10),
      display_name: user.display_name,
      email: user.email,
    });
  } catch (err) {
    console.error("User stats error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
