import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Women", "Men", "Unisex"],
      default: "Women",
    },
    season: {
      type: String,
      enum: ["Winter", "Autumn", "Spring", "Summer", "All Season"],
      default: "Autumn",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    submittedBy: {
      name: { type: String, default: "Atelier Client" },
      email: { type: String, default: "" },
      note: { type: String, default: "" },
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
    },
    images: [
      {
        type: String,
        default: "",
      },
    ],
    description: {
      type: String,
      default: "",
    },
    material: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;