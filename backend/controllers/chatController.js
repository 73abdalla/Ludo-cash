const Chat = require('../models/Chat');
const User = require('../models/User');

class ChatController {
  constructor(io) {
    this.io = io;
    this.initialize();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      socket.on('joinChat', (data) => {
        const { matchId } = data;
        socket.join(`chat_${matchId}`);
      });

      socket.on('sendMessage', async (data) => {
        const { matchId, userId, message } = data;
        try {
          const user = await User.findById(userId);
          const timestamp = '2025-08-10 20:34:03';

          await Chat.findOneAndUpdate(
            { matchId },
            {
              $push: {
                messages: {
                  userId,
                  text: message,
                  timestamp
                }
              }
            },
            { upsert: true }
          );

          this.io.to(`chat_${matchId}`).emit('newMessage', {
            userId,
            username: user.username,
            text: message,
            timestamp
          });
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });
    });
  }
}

module.exports = ChatController;