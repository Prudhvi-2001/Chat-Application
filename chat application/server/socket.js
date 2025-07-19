const { Server } = require('socket.io');
const io = new Server({ cors: { origin: "*" } });
const ChatThread = require('./models/ChatThread');
const Message = require('./models/Messages');

io.on('connection', (socket) => {    
    socket.on('join-thread', (data) => {
        const { threadId, userId } = data;
        socket.join(threadId);
        console.log(`User ${userId} joined thread ${threadId}`);
    });
    
    socket.on('send-message', async (data) => {
        // const { sender, content, chatThread } = data;
   
        // const message = await Message.create({ sender, content, chatThread });
        // await ChatThread.findByIdAndUpdate(chatThread, { $push: { messages: message._id } });
         console.log(data, "from sockettttt");
        // io.to(chatThread).emit('new-message', message); // Send message to all in room
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

module.exports = io;
