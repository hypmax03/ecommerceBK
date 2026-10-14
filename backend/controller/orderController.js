import mongoose from "mongoose";
import Order from "../model/orderSchema.js";
import Product from "../model/productSchema.js";

export const createOrder = async (req, res) => {
  try {
    const {
      orderDocketId,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      items,
      subtotal,
      discountAmount = 0,
      shipping = 0,
      grandTotal,
      promo,
      orderNote = "",
      paymentMethod = "card",
    } = req.body;

    if (!clientName || !clientAddress || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Client name, address, and at least one item are required to place an order.",
      });
    }

    const docketId =
      orderDocketId ||
      `ELO-${Math.floor(100000 + Math.random() * 900000)}`;

    const sanitizedItems = items.map((item) => ({
      productId: mongoose.Types.ObjectId.isValid(item.id || item._id)
        ? item.id || item._id
        : null,
      name: item.name || "Atelier Piece",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      size: item.size || "M",
      color: item.color || "Signature",
      image: item.image || "",
    }));

    // 1. Decrement inventory stock in MongoDB for all valid products
    for (const item of sanitizedItems) {
      if (item.productId) {
        try {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -Math.max(1, item.quantity) },
          });
        } catch (stockErr) {
          console.warn(`Could not update stock for product ${item.productId}:`, stockErr.message);
        }
      }
    }

    // 2. Persist order record
    const newOrder = await Order.create({
      orderDocketId: docketId,
      user: req.user?.id || null,
      clientName: clientName.trim(),
      clientEmail: (clientEmail || req.user?.email || "").toLowerCase().trim(),
      clientPhone: clientPhone || "",
      clientAddress: clientAddress.trim(),
      items: sanitizedItems,
      subtotal: Number(subtotal) || 0,
      discountAmount: Number(discountAmount) || 0,
      shipping: Number(shipping) || 0,
      grandTotal: Number(grandTotal) || Number(subtotal) - Number(discountAmount) + Number(shipping),
      promo: promo || { code: "", label: "" },
      orderNote: orderNote || "",
      paymentMethod: paymentMethod || "card",
      paymentStatus: paymentMethod === "cod" ? "cod_due" : "paid",
      orderStatus: "placed",
    });

    res.status(201).json({
      message: "Order placed and docket logged successfully.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      message: "Failed to place order docket",
      error: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userEmail = req.user?.email?.toLowerCase();
    const userId = req.user?.id;

    const query = {
      $or: [],
    };

    if (userId) query.$or.push({ user: userId });
    if (userEmail) query.$or.push({ clientEmail: userEmail });

    if (query.$or.length === 0) {
      return res.status(200).json({ orders: [] });
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders fetched successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching user orders",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "All order dockets fetched for administration",
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching orders",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      $or: [{ orderDocketId: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }],
    });

    if (!order) {
      return res.status(404).json({ message: "Order docket not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching order",
      error: error.message,
    });
  }
};
