import express from "express";
import { placeOrder, updateOrderStatus, getUserOrders, getListOrders, getOrderById } from "../controllers/orderController.js";
import userAuth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import { checkPermission } from '../middleware/checkPermission.js';
import { PERMISSIONS, USER_PERMISSIONS } from '../constants/permissions.js';

const orderRouter = express.Router();

orderRouter.post("/placeorder", userAuth, checkPermission(USER_PERMISSIONS.CREATE_ORDER), placeOrder);
orderRouter.put("/status/:id", adminAuth, checkPermission(PERMISSIONS.UPDATE_ORDER_STATUS), updateOrderStatus);
orderRouter.get("/", userAuth, checkPermission(USER_PERMISSIONS.VIEW_ORDERS), getUserOrders);
orderRouter.get("/orders", adminAuth, checkPermission(PERMISSIONS.VIEW_ALL_ORDERS), getListOrders);
orderRouter.get("/:id", userAuth, checkPermission(USER_PERMISSIONS.VIEW_ORDER), getOrderById);

export default orderRouter;
