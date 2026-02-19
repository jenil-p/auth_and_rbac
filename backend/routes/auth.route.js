import express from 'express';
import { createUser, deleteUser, getUser, logOutHelper, loginUser, getallUsers } from '../controllers/auth.controller.js'
import { checkForAuthenticationCookie } from '../middlewares/authentication.middleware.js'
import { hasPermission } from '../middlewares/permission.middleware.js';
import { logAction } from '../middlewares/actionlog.middleware.js';

const router = express.Router();

// signup
router.post('/signup' , createUser);

router.post("/login", loginUser);

router.get('/logout' , logOutHelper);

router.get('/me' , checkForAuthenticationCookie("token") , getUser);

// only admin can do this.
router.get('/' , checkForAuthenticationCookie("token") , hasPermission("User" , "READ") , getallUsers);

router.delete('/:userId' , checkForAuthenticationCookie("token") , hasPermission("User" , "DELETE") , deleteUser , logAction("User" , "DELETE" , "userId"));

export default router;