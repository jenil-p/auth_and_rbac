import mongoose from "mongoose";

const operationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, },
});

const Operation = mongoose.model("Operation", operationSchema);
export default Operation;
