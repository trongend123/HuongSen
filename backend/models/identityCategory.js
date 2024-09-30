import mongoose, { Schema } from "mongoose";

const identityCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const IdentityCategory = mongoose.model("IdentityCategory", identityCategorySchema);

export default IdentityCategory; 