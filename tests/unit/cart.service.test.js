import { addToCartService, updateCartService } from "../../services/cartService.js";
import Product from "../../models/productModel.js";
import Cart from "../../models/cartModel.js";
import mongoose from "mongoose";

describe("addToCartService", () => {

    afterEach(async () => {
        await Product.deleteMany({});
        await Cart.deleteMany({});
    });

    it("should create a new cart with items", async () => {

        const product = await Product.create({
            name: "iPhone",
            sku: "IP15",
            price: 1000,
            stock: 10,
            description: "Phone",
            category: "64b9f8c2f1a123456789abcd"
        });

        const input = {
            userId: user._id,
            items: [
                {
                    productId: product._id,
                    quantity: 2
                }
            ]
        };

        const result = await addToCartService(input);

        expect(result).toHaveProperty("_id");
        expect(result.items.length).toBe(1);
        expect(result.totalPrice).toBe(2000);
    });

    it("should throw error if product not found", async () => {

        const input = {
            userId: "user123",
            items: [
                {
                    productId: "64b9f8c2f1a123456789abcd",
                    quantity: 1
                }
            ]
        };

        await expect(
            addToCartService(input)
        ).rejects.toThrow("Product not found");
    });

    it("should update existing cart and increase quantity", async () => {

        const product = await Product.create({
            name: "Laptop",
            sku: "LP1",
            price: 500,
            stock: 10,
            description: "Laptop",
            category: "64b9f8c2f1a123456789abcd"
        });

        await addToCartService({
            userId: user._id,
            items: [
                {
                    productId: product._id,
                    quantity: 1
                }
            ]
        });

        const result = await addToCartService({
            userId: user._id,
            items: [
                {
                    productId: product._id,
                    quantity: 2
                }
            ]
        });

        expect(result.items[0].quantity).toBe(3);
        expect(result.totalPrice).toBe(1500);
    });

    it("should add multiple different products", async () => {

        const p1 = await Product.create({
            name: "Phone",
            sku: "P1",
            price: 100,
            stock: 10,
            description: "Phone",
            category: "64b9f8c2f1a123456789abcd"
        });

        const p2 = await Product.create({
            name: "Tablet",
            sku: "P2",
            price: 200,
            stock: 10,
            description: "Tablet",
            category: "64b9f8c2f1a123456789abcd"
        });

        const result = await addToCartService({
            userId: user._id,
            items: [
                { productId: p1._id, quantity: 1 },
                { productId: p2._id, quantity: 2 }
            ]
        });

        expect(result.items.length).toBe(2);
        expect(result.totalPrice).toBe(100 * 1 + 200 * 2);
    });

});

describe("updateCartService", () => {

    it("should update product quantity in cart successfully", async () => {

        const userId = new mongoose.Types.ObjectId();

        const product = await Product.create({
            name: "Phone",
            sku: "P1",
            price: 500,
            stock: 10,
            description: "Test phone",
            category: new mongoose.Types.ObjectId()
        });

        const cart = await Cart.create({
            userId,
            status: "active",
            items: [
                {
                    productId: product._id,
                    quantity: 1,
                    price: product.price
                }
            ],
            totalPrice: 500
        });

        const result = await updateCartService({
            userId,
            productId: product._id.toString(),
            quantity: 3
        });

        expect(result.items[0].quantity).toBe(3);
        expect(result.totalPrice).toBe(1500);
    });

    it("should throw error if cart not found", async () => {

        const userId = new mongoose.Types.ObjectId();

        await expect(
            updateCartService({
                userId,
                productId: new mongoose.Types.ObjectId().toString(),
                quantity: 2
            })
        ).rejects.toThrow("Cart not found");
    });

    it("should throw error if item not found in cart", async () => {

        const userId = new mongoose.Types.ObjectId();

        await Cart.create({
            userId,
            status: "active",
            items: [],
            totalPrice: 0
        });

        await expect(
            updateCartService({
                userId,
                productId: new mongoose.Types.ObjectId().toString(),
                quantity: 2
            })
        ).rejects.toThrow("Item not found in cart");
    });

});