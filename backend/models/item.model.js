import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, },
    description: { type: String, trim: true,},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    isDeleted: { type: Boolean, default: false, },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
export default Item;
