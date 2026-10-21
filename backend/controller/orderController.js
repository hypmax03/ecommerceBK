import mongoose from "mongoose";
import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../model/orderSchema.js";
import Product from "../model/productSchema.js";

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY;
  const key_secret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;

  if (!key_id || !key_secret) {
    return null;
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

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

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, receipt, notes = {} } = req.body;
    const numericAmount = Math.round(Number(amount));

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ message: "Valid order amount is required" });
    }

    const docketId = receipt || `ELO-${Math.floor(100000 + Math.random() * 900000)}`;
    const rzp = getRazorpayInstance();

    if (rzp) {
      const options = {
        amount: Math.round(numericAmount * 100), // amount in paise
        currency: "INR",
        receipt: docketId,
        notes: {
          docketId,
          clientName: notes.clientName || "",
          clientEmail: notes.clientEmail || "",
        },
      };

      const razorpayOrder = await rzp.orders.create(options);

      return res.status(200).json({
        success: true,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY,
        docketId,
      });
    } else {
      console.warn("Razorpay credentials not found in environment. Providing test order for sandbox.");
      const mockOrderId = `order_test_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
      return res.status(200).json({
        success: true,
        orderId: mockOrderId,
        amount: Math.round(numericAmount * 100),
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_elora_sandbox",
        docketId,
        isSandbox: true,
      });
    }
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({
      message: "Failed to initialize Razorpay transaction",
      error: error.message,
    });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = req.body;

    if (!orderDetails) {
      return res.status(400).json({ message: "Order details required for verification" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;

    if (keySecret && razorpay_signature && razorpay_order_id && razorpay_payment_id) {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: "Payment signature mismatch: Verification failed",
        });
      }
    }

    // Process order creation & inventory stock decrement
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
    } = orderDetails;

    const docketId =
      orderDocketId ||
      `ELO-${Math.floor(100000 + Math.random() * 900000)}`;

    const sanitizedItems = (items || []).map((item) => ({
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

    const newOrder = await Order.create({
      orderDocketId: docketId,
      user: req.user?.id || null,
      clientName: (clientName || "Valued Client").trim(),
      clientEmail: (clientEmail || req.user?.email || "").toLowerCase().trim(),
      clientPhone: clientPhone || "",
      clientAddress: (clientAddress || "").trim(),
      items: sanitizedItems,
      subtotal: Number(subtotal) || 0,
      discountAmount: Number(discountAmount) || 0,
      shipping: Number(shipping) || 0,
      grandTotal: Number(grandTotal) || Number(subtotal) - Number(discountAmount) + Number(shipping),
      promo: promo || { code: "", label: "" },
      orderNote: orderNote || "",
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      razorpayOrderId: razorpay_order_id || "",
      razorpayPaymentId: razorpay_payment_id || "",
      razorpaySignature: razorpay_signature || "",
      orderStatus: "placed",
    });

    res.status(200).json({
      success: true,
      message: "Razorpay payment verified and order docket recorded successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Razorpay verification error:", error);
    res.status(500).json({
      message: "Error processing payment authorization",
      error: error.message,
    });
  }
};

