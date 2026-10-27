import mongoose, { Schema } from "mongoose";

const fakePaymentSchema = new mongoose.Schema(
  {
    user: {
      userID: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: "true",
    },
    items: [
      {
        product: {
          productID: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: "true",
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    shippingAddress: {
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
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Created", "Processing", "Paid", "Failed"],
      default: "Created",
    },
    razorPaymentId: {
      type: String,
      default: null,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
  },
  { timestamps: true },
);

const PaymentAttempt=mongoose.model(
    "PaymentAttempt",
    fakePaymentSchema
);

export default PaymentAttempt;
