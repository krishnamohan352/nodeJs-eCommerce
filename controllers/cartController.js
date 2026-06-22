import {
    addToCartService,
    getCartService,
    updateCartService,
    clearCartService,
    removeSingleItemService
} from "../services/cartService.js";

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items } = req.body;

        const cart = await addToCartService({
            userId,
            items
        });

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await getCartService({ userId });
        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }
        const cart = await updateCartService({
            userId,
            productId,
            quantity
        });
        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        await clearCartService({ userId });
        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const removeSingleItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const cart = await removeSingleItemService({
            userId,
            itemId
        });
        return res.status(200).json({
            success: true,
            message: "Item removed successfully",
            cart
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

export { addToCart, getCart, updateCart, removeSingleItem, clearCart };