import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/productSchema.js";

dotenv.config();

const clearProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    const result = await Product.deleteMany({});
    console.log(`Cleared ${result.deletedCount} products from database.`);
    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Failed to clear database:", error);
    process.exit(1);
  }
};

clearProducts();
