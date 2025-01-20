const mongoose = require("mongoose");

const latestMessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    senderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const LatestMessage = mongoose.model("latestMessage", latestMessageSchema);

module.exports = LatestMessage;
