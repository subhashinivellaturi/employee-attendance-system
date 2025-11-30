import Attendance from "../models/Attendance.js";
import Papa from "papaparse";
import User from "../models/User.js";

export const exportAttendanceCSV = async (req, res) => {
  try {
    const records = await Attendance.find().lean();
    // populate users manually to avoid mongoose populate on lean
    const userIds = [...new Set(records.map(r => String(r.userId)))];
    const users = await User.find({ _id: { $in: userIds } }).lean();
    const userMap = Object.fromEntries(users.map(u => [String(u._id), u]));

    // convert to CSV:
    const csv = Papa.unparse(records.map(r => ({
      id: r._id,
      userId: r.userId || "",
      name: userMap[String(r.userId)]?.name || "",
      email: userMap[String(r.userId)]?.email || "",
      date: r.date,
      checkIn: r.checkInTime,
      checkOut: r.checkOutTime,
      status: r.status,
      hours: r.totalHours
    })));
    res.setHeader("Content-Type", "text/csv");
    res.attachment("attendance.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
