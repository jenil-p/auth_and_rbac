import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, },
});

const AppTable = mongoose.model("AppTable", tableSchema);
export default AppTable;
