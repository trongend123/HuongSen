import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    avataid: { type: mongoose.Schema.Types.ObjectId, ref: 'Avatar'}  // Assuming this is a reference to an avatar image or file
});

const Staff = mongoose.model('Staffs', staffSchema);
export default Staff;
