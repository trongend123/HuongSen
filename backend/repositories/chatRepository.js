// repositories/chatRepository.js
import Message from '../models/message.js';

export const saveMessage = async (messageData) => {
  try {
    const message = new Message(messageData);
    return await message.save(); // Ensure this is working correctly
  } catch (error) {
    console.error('Error saving message to database:', error); // Log any errors here
    throw error; // Re-throw the error to be handled in the controller
  }
};

// export const sendMessage = async (req, res) => {
//   const { sender, senderModel, receiver, receiverModel, content } = req.body;

//   try {
//     const messageData = { sender, senderModel, receiver, receiverModel, content };
//     console.log('Message Data:', messageData); // Log the data being sent to the database

//     const newMessage = await saveMessage(messageData);

//     // Emit message to the specified receiver
//     io.to(receiver.toString()).emit('newMessage', newMessage);

//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.error('Error sending message:', error); // Log the error
//     res.status(500).json({ error: 'Error sending message' });
//   }
// };

export const getChatHistory = async (userId, otherUserId) => {
  return await Message.find().populate('locationId').sort({ createdAt: -1 });
};
