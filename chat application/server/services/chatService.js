const ChatThread = require('../models/ChatThread');
const Message = require('../models/Messages');
const { getUserSocket} = require('../socketStore');
const { Server } = require('socket.io')
const io = new Server({
    cors: true,
})
 const createThread = async (initiator, receiver) => {
    // Check if a thread between these two users already exists
    let thread = await ChatThread.findOne({
        participants: { $all: [initiator, receiver] }
    });
    
    // If no existing thread, create a new one
    if (!thread) {
        thread = await ChatThread.create({ participants: [initiator, receiver] });
    }
    return thread;
};

const sendMessage = async ({ sender, content, receiver }) => {
    let chatThread = await ChatThread.findOne({
        participants: { $all: [sender, receiver] }
    });

    if (!chatThread) {
        chatThread = await ChatThread.create({ participants: [sender, receiver] });
    }

    const message = await Message.create({
        sender,
        content,
        chatThread: chatThread._id,
        readBy: [sender] 
    });

    await ChatThread.findByIdAndUpdate(chatThread._id, {
        $push: { messages: message._id }
    });

    const allMessages = await Message.find({ chatThread: chatThread._id });
    const unreadCount = allMessages.filter(msg =>
        !msg.readBy.map(id => id.toString()).includes(receiver.toString())
    ).length;

    // Emit to receiver
     const recipientSocketId = getUserSocket(receiver); 
    console.log(recipientSocketId, "socketIDD.........");
    if (recipientSocketId) {
        console.log("Emitting receive-message to:", recipientSocketId);

        io.to(recipientSocketId).emit("update-count", {
            threadId: chatThread._id,
            message: {
                content,
                sender,
                createdAt: message.createdAt
            },
            unreadCount
        });
    }else{
        console.error("Recipient socket ID not found for user:", receiver);

    }

    return message;
};

const getUserThreads = async (userId) => {
    const threads = await ChatThread.find({ participants: userId })
        .populate({
            path: 'messages',
            populate: { path: 'sender', select: 'username' },
            select: 'sender content createdAt readBy'
        })
        .populate({
            path: 'participants',
            select: 'username'
        });

        const enhancedThreads = threads.map(thread => {
            const messages = thread.messages || [];
        
            const unreadCount = messages.filter(msg =>
                !msg.readBy?.map(id => id.toString()).includes(userId.toString())
            ).length;
        
            const lastMessage = messages[messages.length - 1];
        
            return {
                ...thread.toObject(),
                unreadCount,
                lastMessagePreview: lastMessage
                    ? {
                        content: lastMessage.content,
                        createdAt: lastMessage.createdAt,
                        sender: lastMessage.sender?.username
                    }
                    : null
            };
        });        

    return enhancedThreads;
};


const getMessagesByThreadId = async (threadId, userId) => {
    await Message.updateMany(
        {
            chatThread: threadId,
            readBy: { $ne: userId }
        },
        {
            $addToSet: { readBy: userId }
        }
    );
    const messages = await Message.find({ chatThread: threadId })
        .populate({ path: 'sender', select: 'username' })
        .sort({ createdAt: 1 });

    const chatThread = await ChatThread.findById(threadId)
        .populate({ path: 'participants', select: 'username' })
        .select('participants');

    return {
        messages: messages.map(msg => msg.toObject()),
        participants: chatThread?.participants.map(participant => ({
            _id: participant._id,
            username: participant.username
        })) || []
    };
};



module.exports = {
    createThread,
    sendMessage,
    getUserThreads,
    getMessagesByThreadId
};
