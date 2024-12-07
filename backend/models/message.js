import mongoose from 'mongoose';
import Location from "./location.js";

const messageSchema = new mongoose.Schema({
 content: {
     type: String,
     required: true
 },
 locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Location,
    required: true
  },
}, { timestamps: true });

export default mongoose.model('messages', messageSchema);
