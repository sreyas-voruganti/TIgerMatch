const mongoose = require("mongoose");
const User = require("./User");

const matchSchema = new mongoose.Schema(
  {
    users: [{ type: String }],
    creator: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "dead", "matched"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
