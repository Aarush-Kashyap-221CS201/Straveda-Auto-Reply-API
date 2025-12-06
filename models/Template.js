const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    
    title: { 
      type: String, 
      required: true,
      trim: true 
    },

    message: { 
      type: String, 
      required: true,
      trim: true 
    },

    isActive: { 
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", templateSchema);
