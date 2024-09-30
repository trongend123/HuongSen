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
            required: false,
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: false,
        },
        address: {
            type: String,
        },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const Member = mongoose.model("Member", memberSchema);

export default Member;
