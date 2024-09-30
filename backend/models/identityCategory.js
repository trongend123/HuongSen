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

const IdentityCategory = mongoose.model("identitycategories", identityCategorySchema);

export default IdentityCategory; 