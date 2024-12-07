import mongoose, { Schema } from 'mongoose';

const staffSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    avatarId: {
      type: Schema.Types.ObjectId,
      ref: 'Avatars', // Assuming it references the Avatar model
    },
    role: {
      type: String,
      enum: ['admin', 'staff_mk', 'staff_ds', 'staff_cb', 'staff'],
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Staffs = mongoose.model('Staffs', staffSchema); // Use singular form for the model name
export default Staffs;

