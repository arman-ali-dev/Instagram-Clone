const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { getReceiverSocketID, io } = require("../socket/socket");
const LatestMessage = require("../models/latestMessageModel");

const handleSendMessage = async (req, res) => {
  try {
    const senderID = req.user?._id;
    const receiverID = req.params.id;
    console.log("Sender: ", senderID, "Receiver iD: ", receiverID);

    const { text } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderID, receiverID] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderID, receiverID],
      });
    }

    const newMessage = await Message.create({
      senderID,
      receiverID,
      content: text,
    });

    await LatestMessage.create({
      content: text,
      senderID,
      receiverID,
    });

    conversation.messages.push(newMessage._id);

    await conversation.save();

    // implement real time chating
    const receiverSocketID = getReceiverSocketID(receiverID);

    if (receiverSocketID) {
      io.to(receiverSocketID).emit("newMessage", newMessage);
      io.to(receiverSocketID).emit("latestMessage", newMessage);
    }

    return res.status(201).json({ newMessage });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleGetMessages = async (req, res) => {
  try {
    const senderID = req.user._id;
    const receiverID = req.params.id;

    let conversation;
    if (senderID && receiverID) {
      conversation = await Conversation.findOne({
        participants: { $all: [senderID, receiverID] },
      }).populate("messages");
    }

    if (!conversation) {
      return res.status(200).json({ messages: [] });
    }

    return res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.log(error.message, "67");

    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleGetLatestMessages = async (req, res) => {
  try {
    const userID = req.user._id;

    const messages = await LatestMessage.find({ receiverID: userID });

    return res.status(200).json({ latestMessages: messages });
  } catch (error) {
    console.log(error.message, "81 ");
    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleDropLatestMessages = async (req, res) => {
  try {
    console.log("chalaaaaaaaaaaaa!");

    const receiverID = req.user._id;
    const senderID = req.params.id;

    const result = await LatestMessage.deleteMany({ receiverID, senderID });
    console.log(result);

    if (result.deletedCount > 0) {
      return res.status(200).json({ msg: "messages deleted!" });
    } else {
      return res.status(404).json({ msg: "not message found to delete!" });
    }
  } catch (error) {
    return res.status(500).json({ msg: "internal server error!" });
  }
};

module.exports = {
  handleSendMessage,
  handleGetMessages,
  handleGetLatestMessages,
  handleDropLatestMessages,
};
