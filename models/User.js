const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["user", "super_admin", "tenant_admin", "tenant_staff"],
      default: "user",
    },

    isSuspended: {
      type: Boolean,
      default: false,
    },

    /* =========================
       SUBSCRIPTION
    ========================= */
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },

    subscriptionTerm: {
      type: String,
      enum: ["monthly", "yearly"],
      default: null,
    },

    validTill: {
      type: Date,
      default: null,
    },

    /* =========================
      TENANT CONTEXT
    ========================= */
    isTenantAdmin: {
      type: Boolean,
      default: false,
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
