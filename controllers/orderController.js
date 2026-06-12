import { placeOrderService, updateOrderStatusService, getUserOrdersService, getListOrdersService, getOrderByIdService } from "../services/orderService.js";

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { address, paymentMethod } = req.body;
        const order = await placeOrderService(
            userId,
            address,
            paymentMethod
        );
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.user.id;
        const order = await getOrderByIdService(orderId, userId);

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            order
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const order = await updateOrderStatusService(orderId, status);

        return res.status(200).json({
            success: true,
            message: "Order status updated",
            order
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await getUserOrdersService(userId);
        return res.status(200).json({
            success: true,
            message: "User orders fetched successfully",
            ...result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getListOrders = async (req, res) => {
    try {
        const result = await getListOrdersService();
        return res.status(200).json({
            success: true,
            message: "All orders fetched successfully",
            ...result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export {
    placeOrder,
    getOrderById,
    updateOrderStatus,
    getUserOrders,
    getListOrders
};