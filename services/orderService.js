import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

const placeOrderService = async (userId, address, paymentMethod) => {

    const cart = await Cart.findOne({
        userId,
        status: "active"
    });

    if (!address) {
        throw new AppError("Address is required", 400);
    }

    if (!paymentMethod) {
        throw new AppError("Payment method is required", 400);
    }

    if (!cart || cart.items.length === 0) {
        throw new AppError("Active cart is empty", 404);
    }

    for (let item of cart.items) {

        const product = await Product.findById(item.productId);
        if (!product) {
            throw new AppError("Product not found", 400);
        }

        if (product.stock < item.quantity) {
            throw new AppError(`Insufficient stock for ${product.name}`, 400);
        }
    }

    for (let item of cart.items) {
        await Product.findByIdAndUpdate(
            item.productId,
            {
                $inc: { stock: -item.quantity }
            }
        );
    }

    const order = await Order.create({
        userId,
        items: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        })),
        address,
        paymentMethod,
        totalPrice: cart.totalPrice,
        status: "pending"
    });
    cart.status = "ordered";
    await cart.save();
    return order;
};

const updateOrderStatusService = async (orderId, status) => {
    try {
        const allowedStatus = [
            "pending",
            "shipped",
            "delivered",
            "cancelled",
            "returned"
        ];

        if (!allowedStatus.includes(status)) {
            throw new AppError("Invalid status", 400);
        }

        const order = await Order.findById(orderId);

        if (!order) {
            throw new AppError("Order not found", 400);
        }

        const transitions = {
            pending: ["shipped", "cancelled"],
            shipped: ["delivered", "returned"],
            delivered: [],
            cancelled: [],
            returned: []
        };

        if (!transitions[order.status].includes(status)) {
            throw new AppError(`Cannot change ${order.status} → ${status}`, 400);
        }

        order.status = status;
        await order.save();

        return order;
    } catch (error) {
        throw error;
    }
};

const getUserOrdersService = async (userId) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError("Invalid userId", 400);
        }
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .populate("items.productId", "name price image");

        const totalOrders = await Order.countDocuments({ userId });

        return {
            orders,
            totalOrders
        };
    } catch (error) {
        throw error
    }
};

const getListOrdersService = async () => {

    const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate("items.productId", "name price image");

    const totalOrders = await Order.countDocuments();

    return {
        orders,
        totalOrders
    };
};


const getOrderByIdService = async (orderId, userId) => {

    const order = await Order.findById(orderId)
        .populate("items.productId", "name price image");

    if (!order) {
        throw new AppError("Order not found", 400);
    }

    if (order.userId.toString() !== userId) {
        throw new AppError("Not authorized to view this order", 400);
    }

    return order;
};

export { placeOrderService, updateOrderStatusService, getUserOrdersService, getListOrdersService, getOrderByIdService }