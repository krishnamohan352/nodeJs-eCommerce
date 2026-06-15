import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import AppError from "../utils/AppError.js";

const placeOrderService = async (userId, address, paymentMethod) => {

    const cart = await Cart.findOne({
        userId,
        status: "active"
    });

    if (!cart || cart.items.length === 0) {
        throw new Error("Active cart is empty");
    }

    if (!address) {
        throw new Error("Address is required");
    }

    if (!paymentMethod) {
        throw new Error("Payment method is required");
    }

    for (let item of cart.items) {

        const product = await Product.findById(item.productId);
        if (!product) {
            throw new Error("Product not found");
        }

        if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
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

    console.log(orderId);
    const allowedStatus = [
        "pending",
        "shipped",
        "delivered",
        "cancelled",
        "returned"
    ];

    if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    const transitions = {
        pending: ["shipped", "cancelled"],
        shipped: ["delivered", "returned"],
        delivered: [],
        cancelled: [],
        returned: []
    };

    if (!transitions[order.status].includes(status)) {
        throw new Error(`Cannot change ${order.status} → ${status}`);
    }

    order.status = status;
    await order.save();

    return order;
};

const getUserOrdersService = async (userId) => {
    const orders = await Order.find({ userId })
        .sort({ createdAt: -1 })
        .populate("items.productId", "name price image");

    const totalOrders = await Order.countDocuments({ userId });

    return {
        orders,
        totalOrders
    };
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
        throw new Error("Order not found");
    }

    if (order.userId.toString() !== userId) {
        throw new Error("Not authorized to view this order");
    }

    return order;
};

export { placeOrderService, updateOrderStatusService, getUserOrdersService, getListOrdersService, getOrderByIdService }