import mongoose, { Schema } from 'mongoose';

const staffSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true, // This can be optional if needed
    },
    avatarId: {
      type: Schema.Types.ObjectId,
      ref: 'Avatars', // Assuming it references the Avatar model
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Staff = mongoose.model('Staffs', staffSchema); // Use singular form for the model name
export default Staff;

