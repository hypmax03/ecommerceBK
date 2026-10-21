import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controller/orderController.js";
import {
  adminMiddleware,
  authMiddleware,
  optionalAuth,
} from "../middleware/authMiddleware.js";

const route = express.Router();

// Client Checkout & Order Docket Endpoints
route.post("/create", optionalAuth, createOrder);
route.post("/razorpay/create-order", optionalAuth, createRazorpayOrder);
route.post("/razorpay/verify-payment", optionalAuth, verifyRazorpayPayment);
route.get("/my-orders", authMiddleware, getMyOrders);
route.get("/all", adminMiddleware, getAllOrders);
route.get("/:id", optionalAuth, getOrderById);

export default route;
