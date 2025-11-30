import express from "express";

const router = express.Router();

// Manager stats
router.get("/stats", (req, res) => {
  res.json({ totalEmployees: 10, todayPresent: 8, lateArrivals: 1 });
});

// Export attendance (mock)
router.get("/export", (req, res) => {
  res.send("Exported CSV"); 
});

export default router;
