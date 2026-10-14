import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./model/userSchema.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    
    const admins = [
      { name: "Admin Max", email: "adminmax@gmail.com", pass: "1234" },
      { name: "Elena Rostova (Curator Admin)", email: "admin@elora.com", pass: "admin123" },
    ];

    for (const a of admins) {
      const existing = await User.findOne({ email: a.email });
      const hashedPassword = await bcrypt.hash(a.pass, 10);
      if (!existing) {
        await User.create({
          name: a.name,
          email: a.email,
          password: hashedPassword,
          role: "admin",
        });
        console.log(`Created admin user: ${a.email} / ${a.pass}`);
      } else {
        existing.password = hashedPassword;
        existing.role = "admin";
        await existing.save();
        console.log(`Verified & refreshed admin user: ${a.email}`);
      }
    }
    
    await mongoose.connection.close();
  } catch (err) {
    console.error("Admin seed error:", err);
    process.exit(1);
  }
};

createAdmin();
