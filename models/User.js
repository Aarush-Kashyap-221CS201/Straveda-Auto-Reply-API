const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    username: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },

    password: { 
      type: String, 
      required: true 
      // hashed password will be stored here
    },

    role: {
      type: String,
      enum: ["user", "admin"],
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

    validTill: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
