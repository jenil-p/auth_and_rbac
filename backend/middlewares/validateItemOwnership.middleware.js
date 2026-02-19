import Item from "../models/item.model.js";

export const validateItemOwnership = async (req, res, next) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (user.roleName === "admin") {
      req.item = item;
      return next();
    }

    if (item.createdBy.toString() !== user.id) {
      return res.status(403).json({
        message: "You do not own this item",
      });
    }

    req.item = item;
    next();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ownership validation failed" });
  }
};
