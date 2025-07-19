const mongoose = require('mongoose');

const chatThreadSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true });

const ChatThread = mongoose.model('ChatThread', chatThreadSchema);
module.exports = ChatThread;
