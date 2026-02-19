import Item from "../models/item.model.js";


// create item
export async function createItem(req, res) {
  try {
    const { title, description } = req.body;

    const item = await Item.create({
      title,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Item created successfully",
      item,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Item creation failed" });
  }
}



export async function getItems(req, res) {
  try {
    const user = req.user;

    let items;

    if (user.roleName === "admin") {
      items = await Item.find({ isDeleted: false }).populate("createdBy", "fullname email");
    } else {
      items = await Item.find({
        createdBy: user.id,
        isDeleted: false,
      });
    }

    res.status(200).json(items);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetching items failed" });
  }
}


// get item (only one)
export async function getItemById(req, res) {
  try {
    const { id } = req.params;

    const item = await Item.findById(id).populate("createdBy", "fullname email");

    if (!item || item.isDeleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetching item failed" });
  }
}


// update item
export async function updateItem(req, res) {
  try {
    const item = req.item;

    Object.assign(item, req.body);

    await item.save();

    res.status(200).json({
      message: "Item updated successfully",
      item,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Item update failed" });
  }
}


// delete item (only own)
export async function deleteItem(req, res, next) {
  try {
    const item = req.item;

    item.isDeleted = true;
    await item.save();

    req.objectId = item._id;

    res.status(200).json({
      message: "Item deleted successfully",
    });

    next();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Item delete failed" });
  }
}
