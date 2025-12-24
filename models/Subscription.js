const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: [String], // list of points/features
      required: true,
    },

    monthlyPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    yearlyPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    staffLimit: {
      type: Number,
      required: true,
      min: 0, // 0 can mean "no staff users allowed"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
