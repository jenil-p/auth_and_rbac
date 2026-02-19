import mongoose from "mongoose";

const rolePermissionSchema = new mongoose.Schema({
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true, },
  table: { type: mongoose.Schema.Types.ObjectId, ref: "AppTable", required: true, },
  operation: { type: mongoose.Schema.Types.ObjectId, ref: "Operation", required: true, },
});

const RolePermission = mongoose.model("RolePermission", rolePermissionSchema);
export default RolePermission;
