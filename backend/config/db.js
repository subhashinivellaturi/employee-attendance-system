import mongoose from "mongoose";

const connectDB = async (uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/attendanceDB") => {
  try {
    await mongoose.connect(uri, { });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
