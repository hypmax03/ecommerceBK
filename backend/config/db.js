import mongoose from "mongoose"
import Product from "../model/productSchema.js"
import { fashionProducts } from "../seed.js"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("db connected")
    } catch (error) {
        console.log("DB connection error:", error)
    }
}

export default connectDB