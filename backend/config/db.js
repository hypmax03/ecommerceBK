import mongoose from "mongoose"
import Product from "../model/productSchema.js"
import User from "../model/userSchema.js"
import bcrypt from "bcrypt"
import { fashionProducts } from "../seed.js"

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("Warning: MONGO_URI environment variable is not defined.")
            return
        }
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully")

        // Auto-ensure adminmax@gmail.com account exists with password 1234
        const targetAdminEmail = "adminmax@gmail.com"
        const existingAdmin = await User.findOne({ email: targetAdminEmail })
        const hashedPassword = await bcrypt.hash("1234", 10)

        if (!existingAdmin) {
            await User.create({
                name: "Admin Max",
                email: targetAdminEmail,
                password: hashedPassword,
                role: "admin",
            })
            console.log("Created admin user: adminmax@gmail.com / 1234")
        } else {
            existingAdmin.password = hashedPassword
            existingAdmin.role = "admin"
            await existingAdmin.save()
            console.log("Updated admin user: adminmax@gmail.com with password 1234")
        }
    } catch (error) {
        console.error("MongoDB connection error:", error.message)
    }
}

export default connectDB