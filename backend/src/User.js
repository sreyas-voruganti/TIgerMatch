const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now },
    yesUsers: [{ type: String }],
    noUsers: [{ type: String }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
