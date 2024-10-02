import mongoose, { Schema } from "mongoose";

const memberSchema = new Schema(
    {

        fullname: {
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
        dob: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },
        address: {
            type: String,
            required: true
        },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Member = mongoose.model("members", memberSchema);

export default Member;
