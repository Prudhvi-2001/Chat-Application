const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io')
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
// const io = require('./socket');
const { setUserSocket, getUserSocket,removeUserSocket  } = require('./socketStore')
const rateLimit = require('express-rate-limit');


dotenv.config();

const io = new Server({
    cors: true,
})
const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per minute
    message: "Too many requests, please try again later."
  });
  app.use(limiter);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));




app.listen(8000,() =>{
    console.log(`Server is running at 8000`);
})

io.on("connection", (socket) => {
  socket.on("register-user", (userId) => {
      if (userId) {
          setUserSocket(userId, socket.id);
      }
  });
  socket.on("send-message", (messageData, receiver) => { 
      const { content, sender } = messageData;
      const recipientSocketId = getUserSocket(receiver); 
      console.log(content, sender, "Message data"); 
      if (recipientSocketId) {
          io.to(recipientSocketId).emit("receive-message", { content, sender });
      }
  });

  socket.on("disconnect", () => {
    removeUserSocket(socket.id);
});
});

io.listen(8001, () =>{
    console.log("Socket is connected");
})

