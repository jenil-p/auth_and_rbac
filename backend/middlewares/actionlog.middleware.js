import ActionLog from "../models/actionlog.model.js";

export const logAction = (tableName, operationName, objectIdField) => {
  return (req, res, next) => {

    res.on("finish", async () => {
      if (res.statusCode >= 300) return;

      try {
        let objectId = null;

        if (objectIdField && req.params?.[objectIdField]) {
          objectId = req.params[objectIdField];
        } else if (req.objectId) {
          objectId = req.objectId;
        }

        await ActionLog.create({
          userId: req.user.id,
          tableName,
          operationName,
          operationObjectID: objectId,
        });

      } catch (err) {
        console.error("Action log error:", err);
      }
    });

    next();
  };
};
