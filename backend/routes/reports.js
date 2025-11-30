import express from "express";
import { exportAttendanceCSV } from "../controllers/reportsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Export CSV (protected)
router.get("/export", protect, exportAttendanceCSV);

export default router;
