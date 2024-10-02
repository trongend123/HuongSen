import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
    {
        locationId: {
            type: Schema.Types.ObjectId,
            ref: "Locations",
            required: true,
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "CustomerAccounts",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


const Feedback = mongoose.model("feedbacks", feedbackSchema);


export default Feedbacks;
