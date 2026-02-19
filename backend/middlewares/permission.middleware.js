import Role from "../models/role.model.js";
import AppTable from "../models/apptable.model.js";
import Operation from "../models/operation.model.js";
import RolePermission from "../models/rolePermission.model.js";

export const hasPermission = (tableName, operationName) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const role = await Role.findById(user.role);
      if (!role) {
        return res.status(403).json({ message: "Role not found" });
      }

      const table = await AppTable.findOne({ name: tableName });
      if (!table) {
        return res.status(500).json({ message: "Invalid table metadata" });
      }

      const operation = await Operation.findOne({ name: operationName });
      if (!operation) {
        return res.status(500).json({ message: "Invalid operation metadata" });
      }

      const allowed = await RolePermission.findOne({
        role: role._id,
        table: table._id,
        operation: operation._id,
      });

      if (!allowed) {
        return res.status(403).json({ message: "Permission denied" });
      }

      next();

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Permission check failed" });
    }
  };
};
