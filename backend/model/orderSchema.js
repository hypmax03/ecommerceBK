import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    size: { type: String, default: "M" },
    color: { type: String, default: "Signature" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderDocketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    clientPhone: {
      type: String,
      trim: true,
      default: "",
    },
    clientAddress: {
      type: String,
      required: true,
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        "Order must contain at least one item",
      ],
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    promo: {
      code: { type: String, default: "" },
      label: { type: String, default: "" },
    },
    orderNote: {
      type: String,
      default: "",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "cod"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "cod_due"],
      default: "paid",
    },
    orderStatus: {
      type: String,
      enum: ["placed", "tailoring", "dispatched", "delivered", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
