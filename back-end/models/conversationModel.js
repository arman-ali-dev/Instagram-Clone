const mongoose = require("mongoose");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
    },
  ],
});

const Conversation = mongoose.model("conversation", conversationSchema);

module.exports = Conversation;
