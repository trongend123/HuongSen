import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel', required: true },
  senderModel: { type: String, enum: ['Customer', 'Staff'], required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, refPath: 'receiverModel', required: true },
  receiverModel: { type: String, enum: ['Customer', 'Staff'], required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('messages', messageSchema);
