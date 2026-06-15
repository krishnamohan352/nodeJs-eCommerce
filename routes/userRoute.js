import express from 'express';
import { loginUser, registerUser, getListUsers, updateUser, deleteUser } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.put("/:id", adminAuth, updateUser);
userRouter.delete("/:id", adminAuth, deleteUser);
userRouter.get('/', adminAuth, getListUsers)

export default userRouter;