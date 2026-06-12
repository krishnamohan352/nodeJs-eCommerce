import express from 'express';
import { loginUser, registerUser, getListUsers, updateUser, deleteUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.get('/', getListUsers)

export default userRouter;