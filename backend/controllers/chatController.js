// controllers/chatController.js
import { saveMessage, getChatHistory } from '../repositories/chatRepository.js';
import { io } from '../server.js';

export const sendMessage = async (req, res) => {
    const { sender, senderModel, receiver, receiverModel, message } = req.body;
  
    try {
      const messageData = { sender, senderModel, receiver, receiverModel, message };
      const newMessage = await saveMessage(messageData);
  
      // Emit message to the specified receiver
      io.to(receiver.toString()).emit('newMessage', newMessage);
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error sending message:', error); // Log the error
      res.status(500).json({ error: 'Error sending message' });
    }
  };

export const getMessages = async (req, res) => {
  const { userId, otherUserId } = req.params;

  try {
    const messages = await getChatHistory(userId, otherUserId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving messages' });
  }
};
