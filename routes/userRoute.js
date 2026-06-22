import express from 'express';
import { loginUser, registerUser, getListUsers, updateUser, deleteUser } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';
import { checkPermission } from '../middleware/checkPermission.js';
import { PERMISSIONS } from '../constants/permissions.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.put("/:id", adminAuth, checkPermission(PERMISSIONS.UPDATE_USER), updateUser);
userRouter.delete("/:id", adminAuth, checkPermission(PERMISSIONS.DELETE_USER), deleteUser);
userRouter.get('/', adminAuth, checkPermission(PERMISSIONS.VIEW_USER), getListUsers)

export default userRouter;