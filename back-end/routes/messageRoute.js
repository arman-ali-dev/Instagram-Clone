const { Router } = require("express");
const router = Router();

const {
  handleSendMessage,
  handleGetMessages,
  handleGetLatestMessages,
  handleDropLatestMessages,
} = require("../controllers/messageController");

router.post("/send/:id", handleSendMessage);
router.get("/fetch/:id", handleGetMessages);
router.get("/latest", handleGetLatestMessages);
router.delete("/drop/:id", handleDropLatestMessages);

module.exports = router;
