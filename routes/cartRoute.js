import express from "express";
import { addToCart, getCart, updateCart, removeSingleItem, clearCart } from "../controllers/cartController.js";
import userAuth from "../middleware/auth.js";
import { checkPermission } from '../middleware/checkPermission.js';
import { PERMISSIONS, USER_PERMISSIONS } from '../constants/permissions.js';

const cartRouter = express.Router();

cartRouter.post('/add', userAuth, checkPermission(USER_PERMISSIONS.ADD_TO_CART), addToCart);
cartRouter.get('/', userAuth, checkPermission(USER_PERMISSIONS.VIEW_CART), getCart);
cartRouter.put('/update', userAuth, checkPermission(USER_PERMISSIONS.UPDATE_CART), updateCart);
cartRouter.delete('/remove/:itemId', userAuth, checkPermission(USER_PERMISSIONS.REMOVE_FROM_CART), removeSingleItem);
cartRouter.delete('/clearcart', userAuth, checkPermission(USER_PERMISSIONS.CLEAR_CART), clearCart);

export default cartRouter;
