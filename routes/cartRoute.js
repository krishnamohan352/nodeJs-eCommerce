import express from "express";
import { addToCart, getCart, updateCart, removeSingleItem, clearCart } from "../controllers/cartController.js";
import userAuth from "../middleware/auth.js";
import { checkPermission } from '../middleware/checkPermission.js';
import { PERMISSIONS } from '../constants/permissions.js';

const cartRouter = express.Router();

cartRouter.post('/add', userAuth, addToCart);
cartRouter.get('/', userAuth, getCart);
cartRouter.put('/update', userAuth, updateCart);
cartRouter.delete('/remove/:itemId', userAuth, removeSingleItem);
cartRouter.delete('/clearcart', userAuth, clearCart);

export default cartRouter;