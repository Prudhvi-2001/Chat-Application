const express = require("express");
const router = express.Router();
const {
  createThread,
  sendMessage,
  getUserThreads,
  getMessagesByThreadId
} = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create-thread", authMiddleware, createThread);
router.post("/send-message", authMiddleware, sendMessage);
router.get("/threads", authMiddleware, getUserThreads);
router.get("/thread/messages/:threadId", authMiddleware, getMessagesByThreadId);

module.exports = router;
