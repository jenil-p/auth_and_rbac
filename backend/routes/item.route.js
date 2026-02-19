import express from "express";

import { createItem, getItems, getItemById, updateItem, deleteItem} from "../controllers/item.controller.js";

import { checkForAuthenticationCookie } from "../middlewares/authentication.middleware.js";
import { hasPermission } from "../middlewares/permission.middleware.js";
import { validateItemOwnership } from "../middlewares/validateItemOwnership.middleware.js"
import { logAction } from "../middlewares/actionlog.middleware.js";

const router = express.Router();

// create
router.post( "/", checkForAuthenticationCookie("token"), hasPermission("Item", "CREATE"), createItem, logAction("Item", "CREATE") );

// get all
router.get( "/", checkForAuthenticationCookie("token"), hasPermission("Item", "READ"), getItems);

// get one
router.get("/:id", checkForAuthenticationCookie("token"), hasPermission("Item", "READ"),validateItemOwnership, getItemById);

// update (own)
router.put( "/:id", checkForAuthenticationCookie("token"), hasPermission("Item", "UPDATE"), validateItemOwnership, updateItem,logAction("Item", "UPDATE", "id"));

// delete
router.delete( "/:id", checkForAuthenticationCookie("token"), hasPermission("Item", "DELETE"), validateItemOwnership, deleteItem, logAction("Item", "DELETE", "id"));


export default router;
