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
            ref: "CustomerAccount",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
