const chatService = require('../services/chatService');

const createThread = async (req, res) => {
    try {
        const { receiver } = req.body;
        const initiator = req.user._id;
        const thread = await chatService.createThread(initiator, receiver);
        res.status(201).json(thread);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { content, receiver } = req.body;
        const sender = req.user._id;
        const message = await chatService.sendMessage({ sender, content, receiver });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserThreads = async (req, res) => {
    try {
        const userId = req.user._id;
        const threads = await chatService.getUserThreads(userId);
        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMessagesByThreadId = async (req, res) => {
    try {
        const { threadId } = req.params;
        const userId = req.user._id;
        const messages = await chatService.getMessagesByThreadId(threadId, userId);
        if (!messages) {
            return res.status(404).json({ message: "Chat thread not found" });
        }
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createThread,
    sendMessage,
    getUserThreads,
    getMessagesByThreadId
};
