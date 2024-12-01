import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
 content: {
     type: String,
     required: true
 }
}, { timestamps: true });

export default mongoose.model('messages', messageSchema);
