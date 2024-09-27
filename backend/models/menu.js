import mongoose, { Schema } from "mongoose";
const menuSchema = new Schema(
  {
    foodName: [{
      type: String,
      required: true,
    }],
    drinkName: {
      type: String,
    },
    price: {
      type: Number,
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

const Menus = mongoose.model("Menus", menuSchema);

export default Menus;
