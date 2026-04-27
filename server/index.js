import "dotenv/config";
import express from "express";
import cors from "cors";
import { initDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import progressRoutes from "./routes/progress.js";
import userRoutes from "./routes/user.js";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:8080")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/progress", progressRoutes);
app.use("/user", userRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Start
async function start() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
