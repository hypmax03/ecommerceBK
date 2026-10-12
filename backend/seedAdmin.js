import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./model/userSchema.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    
    const existing = await User.findOne({ email: "admin@elora.com" });
    if (!existing) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Elena Rostova (Curator Admin)",
        email: "admin@elora.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Created default admin user: admin@elora.com / admin123");
    } else {
      existing.role = "admin";
      await existing.save();
      console.log("Admin account verified: admin@elora.com");
    }
    
    await mongoose.connection.close();
  } catch (err) {
    console.error("Admin seed error:", err);
    process.exit(1);
  }
};

createAdmin();
