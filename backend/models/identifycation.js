import mongoose, { Schema } from "mongoose";

const identifycationSchema = new Schema(
    {

        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "IdentityCategory",
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        dateStart: {
            type: Date,
            required: true,
        },
        dateEnd: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        memberId: {
            type: Schema.Types.ObjectId,
            ref: "Member",
            required: true,
        },
        cusAccId: {
            type: Schema.Types.ObjectId,
            ref: "CustomerAccount",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Identifycation = mongoose.model("Identifycation", identifycationSchema);

export default Identifycation;
