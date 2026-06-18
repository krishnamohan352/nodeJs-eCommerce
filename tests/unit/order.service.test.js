import { placeOrderService, getUserOrdersService, updateOrderStatusService } from "../../services/orderService.js";
import Product from "../../models/productModel.js";
import Cart from "../../models/cartModel.js";
import Order from "../../models/orderModel.js";
import mongoose from "mongoose";

describe("placeOrderService", () => {

    afterEach(async () => {
        await Product.deleteMany({});
        await Cart.deleteMany({});
        await Order.deleteMany({});
    });

    it("should place order successfully", async () => {

        const product = await Product.create({
            name: "Laptop",
            sku: "LP1",
            price: 1000,
            stock: 10,
            description: "Gaming laptop",
            category: "64b9f8c2f1a123456789abcd"
        });

        const cart = await Cart.create({
            userId: user._id,
            status: "active",
            items: [
                {
                    productId: product._id,
                    quantity: 2,
                    price: product.price
                }
            ],
            totalPrice: 2000
        });

        const result = await placeOrderService(
            user._id,
            "Delhi, India",
            "cash_on_delivery"
        );

        expect(result).toHaveProperty("_id");
        expect(result.userId.toString()).toBe(user._id.toString());
        expect(result.totalPrice).toBe(2000);
        expect(result.status).toBe("pending");

        const updatedCart = await Cart.findById(cart._id);
        expect(updatedCart.status).toBe("ordered");

        const updatedProduct = await Product.findById(product._id);
        expect(updatedProduct.stock).toBe(8);
    });

    it("should throw error if address is missing", async () => {

        await expect(
            placeOrderService(user._id, "", "cash_on_delivery")
        ).rejects.toThrow("Address is required");
    });

    it("should throw error if payment method is missing", async () => {

        await expect(
            placeOrderService(user._id, "Delhi", "")
        ).rejects.toThrow("Payment method is required");
    });

    it("should throw error if cart is empty", async () => {

        await expect(
            placeOrderService(user._id, "Delhi", "cash_on_delivery")
        ).rejects.toThrow("Active cart is empty");
    });

    it("should throw error if product not found", async () => {

        const product = await Product.create({
            name: "Phone",
            sku: "P1",
            price: 500,
            stock: 10,
            description: "Phone",
            category: "64b9f8c2f1a123456789abcd"
        });

        await Cart.create({
            userId: user._id,
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

        await Product.deleteOne({ _id: product._id });

        await expect(
            placeOrderService(user._id, "Delhi", "cash_on_delivery")
        ).rejects.toThrow("Product not found");
    });

    it("should throw error if stock is insufficient", async () => {

        const product = await Product.create({
            name: "Laptop",
            sku: "LP2",
            price: 1000,
            stock: 1,
            description: "Laptop",
            category: "64b9f8c2f1a123456789abcd"
        });

        await Cart.create({
            userId: user._id,
            status: "active",
            items: [
                {
                    productId: product._id,
                    quantity: 5,
                    price: product.price
                }
            ],
            totalPrice: 5000
        });

        await expect(
            placeOrderService(user._id, "Delhi", "cash_on_delivery")
        ).rejects.toThrow("Insufficient stock for Laptop");
    });

});

describe("getUserOrdersService", () => {

    afterEach(async () => {
        await Order.deleteMany({});
        await Product.deleteMany({});
    });

    it("should return user orders with total count", async () => {

        const userId = user._id;

        const product = await Product.create({
            name: "Laptop",
            sku: "LP1",
            price: 1000,
            stock: 10,
            description: "Gaming laptop",
            category: "64b9f8c2f1a123456789abcd"
        });

        await Order.create([
            {
                userId,
                items: [
                    {
                        productId: product._id,
                        quantity: 1,
                        price: product.price
                    }
                ],
                totalPrice: 1000,
                status: "pending",
                address: "delhi",
                paymentMethod: "cash_on_delivery",

            },
            {
                userId,
                items: [
                    {
                        productId: product._id,
                        quantity: 2,
                        price: product.price
                    }
                ],
                totalPrice: 2000,
                status: "pending",
                address: "delhi",
                paymentMethod: "cash_on_delivery",
            }
        ]);

        const result = await getUserOrdersService(userId);

        expect(result).toHaveProperty("orders");
        expect(result).toHaveProperty("totalOrders");

        expect(result.totalOrders).toBe(2);

        expect(result.orders.length).toBe(2);

        expect(result.orders[0].items[0].productId).toHaveProperty("name");
        expect(result.orders[0].items[0].productId).toHaveProperty("price");
    });

    it("should return empty orders if user has no orders", async () => {
        const userId = new mongoose.Types.ObjectId();
        const result = await getUserOrdersService(userId);

        expect(result.orders).toEqual([]);
        expect(result.totalOrders).toBe(0);
    });

});


describe("updateOrderStatusService", () => {

    afterEach(async () => {
        await Order.deleteMany({});
    });

    it("should update status from pending → shipped", async () => {

        const order = await Order.create({
            userId: new mongoose.Types.ObjectId(),
            items: [],
            totalPrice: 1000,
            status: "pending",
            address: "delhi",
            paymentMethod: "cash_on_delivery",
        });

        const result = await updateOrderStatusService(
            order._id,
            "shipped"
        );

        expect(result.status).toBe("shipped");
    });

    it("should throw error for invalid status", async () => {

        const order = await Order.create({
            userId: new mongoose.Types.ObjectId(),
            items: [],
            totalPrice: 1000,
            status: "pending",
            address: "delhi",
            paymentMethod: "cash_on_delivery",
        });

        await expect(
            updateOrderStatusService(order._id, "processing")
        ).rejects.toThrow("Invalid status");
    });

    it("should throw error if order not found", async () => {

        const fakeId = new mongoose.Types.ObjectId();

        await expect(
            updateOrderStatusService(fakeId, "shipped")
        ).rejects.toThrow("Order not found");
    });

    it("should throw error for invalid transition pending → delivered", async () => {

        const order = await Order.create({
            userId: new mongoose.Types.ObjectId(),
            items: [],
            totalPrice: 1000,
            status: "pending",
            address: "delhi",
            paymentMethod: "cash_on_delivery",
        });

        await expect(
            updateOrderStatusService(order._id, "delivered")
        ).rejects.toThrow("Cannot change pending → delivered");
    });

    it("should allow shipped → delivered", async () => {

        const order = await Order.create({
            userId: new mongoose.Types.ObjectId(),
            items: [],
            totalPrice: 1000,
            status: "shipped",
            address: "delhi",
            paymentMethod: "cash_on_delivery",
        });

        const result = await updateOrderStatusService(
            order._id,
            "delivered"
        );

        expect(result.status).toBe("delivered");
    });

    it("should allow pending → cancelled", async () => {

        const order = await Order.create({
            userId: new mongoose.Types.ObjectId(),
            items: [],
            totalPrice: 1000,
            status: "pending",
            address: "delhi",
            paymentMethod: "cash_on_delivery",
        });

        const result = await updateOrderStatusService(
            order._id,
            "cancelled"
        );

        expect(result.status).toBe("cancelled");
    });

});