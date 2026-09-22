import mongoose from "mongoose";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    userID: {
      type: String,
    },
    username: {
      type: String,
    },
    firstName: {
      type: String,
    },
    last_name: {
      type: String,
    },
    role: {
      type: String,
    },
    status: {
      type: String,
    },
    phone_number: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    dob: {
      type: String,
    },
    image: {
      type: String,
    },
    passwordPin: {
      type: String,
    },
    loginType: {
      type: String,
      enum: ["password", "google", "twitter"],
      default: "password",
    },
    googleId: {
      type: String,
      default: null,
    },
    subscription: {
      planId: { type: String, default: null },
      planName: { type: String, default: null },
      type: { type: String, default: null }, // Plan name/type (for backward compatibility)
      status: { type: String, default: "inactive" }, // active, inactive, cancelled, expired, pending_cancellation
      active: { type: Boolean, default: false }, // Quick boolean check
      subscriptionType: { type: String, default: null }, // recurring, onetime
      startDate: { type: Date, default: null },
      expiryDate: { type: Date, default: null },
      lastPaymentDate: { type: Date, default: null },
      nextChargeDate: { type: Date, default: null },
      amount: { type: Number, default: null },
      currency: { type: String, default: "USD" },
      saleID: { type: String, default: null },
      referenceID: { type: String, default: null },
      autoRenew: { type: Boolean, default: false },
      cancelDate: { type: Date, default: null },
      cancelReason: { type: String, default: null },
      refundDate: { type: Date, default: null },
      refundReason: { type: String, default: null },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
    checkedout: { type: Boolean, default: false },
    checkoutDate: { type: Date, default: null },
    ratings: [{ type: String, ref: "videoRating" }],
  },
  {
    timestamps: true,
    strict: false, // Allow fields not defined in schema
  }
);

export default mongoose.models.Customers ||
  mongoose.model("Customers", userSchema);
