import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentHistorySchema = new Schema(
  {
    // User reference (can be ObjectId or String for UUID)
    userId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    // YourSafe transaction identifiers
    saleID: {
      type: String,
      required: true,
    },
    referenceID: {
      type: String,
      required: true,
    },

    // Payment event information
    event: {
      type: String,
      required: true,
      enum: [
        "initial",
        "rebill",
        "cancel",
        "expiry",
        "credit",
        "chargeback",
        "extend",
        "upgrade",
        "downgrade",
      ],
    },

    // Financial details
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
    },

    // Subscription details
    planId: {
      type: String,
      required: true,
    },
    planTitle: {
      type: String,
      required: true,
    },
    subscriptionPhase: {
      type: String,
    },

    // Processing information
    status: {
      type: String,
      enum: ["processed", "failed", "pending"],
      default: "processed",
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },

    // Raw postback data for debugging
    rawData: {
      type: mongoose.Schema.Types.Mixed,
    },

    // Additional metadata
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },

    // Payment method (useful for reporting)
    paymentMethod: {
      type: String,
      default: "Credit Card",
    },

    // Transaction notes/description
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "paymenthistories",
  }
);

// Indexes for performance
paymentHistorySchema.index({ userId: 1, processedAt: -1 });
paymentHistorySchema.index({ saleID: 1 });
paymentHistorySchema.index({ referenceID: 1 });
paymentHistorySchema.index({ event: 1, processedAt: -1 });

export default mongoose.models.paymentHistory ||
  mongoose.model("paymentHistory", paymentHistorySchema);
