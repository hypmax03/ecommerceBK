import express from "express";
import {
  deleteProduct,
  getProduct,
  getProductById,
  getMySubmissions,
  productController,
  seedFashionProducts,
  clearAllProducts,
  updateProduct,
  getAdminProductDashboard,
  approveProduct,
  rejectProduct,
} from "../controller/productController.js";
import upload from "../middleware/uploadMiddleware.js";
import { adminMiddleware, authMiddleware, optionalAuth } from "../middleware/authMiddleware.js";

const route = express.Router();

// Public / Guest Storefront Endpoints
route.get("/", getProduct);
route.get("/my-submissions", authMiddleware, getMySubmissions);
route.get("/:id", getProductById);

// Submit Garment (Users / Guests submit as 'pending'; Admins can submit as 'approved')
route.post("/add", optionalAuth, upload.array("images", 5), productController);

// Database Seeding (Admin Only)
route.post("/seed", adminMiddleware, seedFashionProducts);

// Admin-Only Moderation & CRUD Endpoints
route.get("/admin/dashboard", adminMiddleware, getAdminProductDashboard);
route.put("/approve/:id", adminMiddleware, approveProduct);
route.put("/reject/:id", adminMiddleware, rejectProduct);
route.put("/update/:id", adminMiddleware, updateProduct);
route.delete("/delete/:id", adminMiddleware, deleteProduct);
route.delete("/clear", adminMiddleware, clearAllProducts);
route.post("/clear", adminMiddleware, clearAllProducts);

export default route;