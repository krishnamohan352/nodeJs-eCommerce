import express from "express";
import { placeOrder, updateOrderStatus, getUserOrders, getListOrders, getOrderById } from "../controllers/orderController.js";
import userAuth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

orderRouter.post("/placeorder", userAuth, placeOrder);
orderRouter.put("/status/:id", adminAuth, updateOrderStatus);
orderRouter.get("/", userAuth, getUserOrders);
orderRouter.get("/orders", adminAuth, getListOrders);
orderRouter.get("/:id", userAuth, getOrderById);

export default orderRouter;