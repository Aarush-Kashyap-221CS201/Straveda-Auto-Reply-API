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
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
