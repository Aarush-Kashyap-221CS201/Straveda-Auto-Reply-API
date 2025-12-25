const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    /* =========================
       REFERENCES
    ========================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },

    /* =========================
       SNAPSHOT DATA
    ========================= */
    subscriptionName: {
      type: String,
      required: true,
    },

    term: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },

    /* =========================
       VALIDITY
    ========================= */
    validFrom: {
      type: Date,
      required: true,
    },

    validTill: {
      type: Date,
      required: true,
    },

    /* =========================
       PAYMENT DETAILS
    ========================= */
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["success", "failed", "refunded"],
      default: "success",
    },

    paymentMethod: {
      type: String,
      enum: ["upi", "card", "netbanking", "wallet", "unknown"],
      default: "unknown",
    },

    transactionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
