import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import dashboardRoutes from "./routes/dashboard.js";
import authRoutes from "./routes/auth.js";
import attendanceRoutes from "./routes/attendance.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo Connected"))
  .catch((err) => console.log("❌ Mongo connection error:", err));

app.listen(process.env.PORT, () => console.log(`🚀 Server running on ${process.env.PORT}`));
