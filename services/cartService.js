import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';
import AppError from "../utils/AppError.js";

const addToCartService = async ({ userId, items }) => {

    let totalPrice = 0;
    const updatedItems = [];
    for (const item of items) {
        const product = await Product.findById(item.productId);

        if (!product) {
            throw new Error("Product not found");
        }

        const itemTotal = product.price * item.quantity;
        totalPrice += itemTotal;

        updatedItems.push({
            productId: item.productId,
            quantity: item.quantity,
            price: product.price
        });
    }

    let cart = await Cart.findOne({
        userId,
        status: "active"
    });

    if (!cart) {
        cart = new Cart({
            userId,
            status: "active",
            items: updatedItems,
            totalPrice
        });
    } else {

        for (const newItem of updatedItems) {

            const existingItem = cart.items.find(
                (i) => i.productId.toString() === newItem.productId.toString()
            );

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                cart.items.push(newItem);
            }
        }

        cart.totalPrice = cart.items.reduce(
            (sum, i) => sum + i.price * i.quantity,
            0
        );
    }

    await cart.save();
    return cart;
};

const getCartService = async ({ userId }) => {
    const cart = await Cart.findOne({
        userId,
        status: "active"
    });

    if (!cart) {
        return {
            userId,
            items: [],
            totalPrice: 0
        };
    }
    return cart;
};

const updateCartService = async ({ userId, productId, quantity }) => {
    const cart = await Cart.findOne({
        userId,
        status: "active"
    });
    if (!cart) {
        throw new Error("Cart not found");
    }
    const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
        throw new Error("Item not found in cart");
    }

    cart.items[itemIndex].quantity = quantity;

    cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    await cart.save();
    return cart;
};

const clearCartService = async ({ userId }) => {

    const cart = await Cart.findOneAndDelete({
        userId,
        status: "active"
    });

    if (!cart) {
        throw new Error("Cart not found");
    }

    return true;
};

const removeSingleItemService = async ({ userId, itemId }) => {

    const cart = await Cart.findOne({
        userId,
        status: "active"
    });

    if (!cart) {
        throw new Error("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
        item => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
        throw new Error("Item not found in cart");
    }

    cart.items.splice(itemIndex, 1);

    cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    await cart.save();

    return cart;
};

export { addToCartService, getCartService, updateCartService, clearCartService, removeSingleItemService }