import express from "express";
import {
  deleteProduct,
  getProduct,
  getProductById,
  productController,
  seedFashionProducts,
  updateProduct,
  getAdminProductDashboard,
  approveProduct,
  rejectProduct,
} from "../controller/productController.js";
import upload from "../middleware/uploadMiddleware.js";
import { adminMiddleware, optionalAuth } from "../middleware/authMiddleware.js";

const route = express.Router();

// Public / Guest Storefront Endpoints
route.get("/", getProduct);
route.get("/:id", getProductById);

// Submit Garment (Users / Guests submit as 'pending'; Admins can submit as 'approved')
route.post("/add", optionalAuth, upload.array("images", 5), productController);

// Admin-Only Moderation & CRUD Endpoints
route.get("/admin/dashboard", adminMiddleware, getAdminProductDashboard);
route.put("/approve/:id", adminMiddleware, approveProduct);
route.put("/reject/:id", adminMiddleware, rejectProduct);
route.put("/update/:id", adminMiddleware, updateProduct);
route.delete("/delete/:id", adminMiddleware, deleteProduct);
route.post("/seed", adminMiddleware, seedFashionProducts);

export default route;