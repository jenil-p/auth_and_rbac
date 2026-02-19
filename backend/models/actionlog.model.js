import mongoose from "mongoose";

const actionLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
    tableName: String,
    operationName: String,
    operationObjectID: String,
  },
  { timestamps: true }
);

const ActionLog = mongoose.model("ActionLog", actionLogSchema);
export default ActionLog;
