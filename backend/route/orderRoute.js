import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
} from "../controller/orderController.js";
import {
  adminMiddleware,
  authMiddleware,
  optionalAuth,
} from "../middleware/authMiddleware.js";

const route = express.Router();

// Client Checkout & Order Docket Endpoints
route.post("/create", optionalAuth, createOrder);
route.get("/my-orders", authMiddleware, getMyOrders);
route.get("/all", adminMiddleware, getAllOrders);
route.get("/:id", optionalAuth, getOrderById);

export default route;
