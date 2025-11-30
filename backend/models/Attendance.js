import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ["Present", "Absent", "Late", "Half-day"], default: "Present" },
  checkInTime: { type: String },
  checkOutTime: { type: String },
  totalHours: { type: Number, default: 0 },
  date: { type: Date, default: () => new Date().toISOString().split('T')[0] },
  createdAt: { type: Date, default: Date.now }
});

// Prevent model overwrite in dev environments
const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
