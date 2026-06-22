import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Order from "../models/orderModel.js";
import request from "supertest";
import app from "../app.js";

describe("POST /api/order/placeorder", () => {

    it("should place order successfully", async () => {
        const category = await createCategory();
        const subCategory = await createSubCategory(category._id);

        const product = await createProduct({
            name: "Test Product",
            category: category._id,
            subcategory: subCategory._id
        });

        await Cart.create({
            userId: user._id,
            status: "active",
            items: [
                {
                    productId: product._id,
                    quantity: 2,
                    price: 10
                }
            ],
            totalPrice: 20
        });

        const response = await request(app)
            .post("/api/order/placeorder")
            .set(
                "Authorization",
                `Bearer ${userToken}`
            )
            .send({
                address: "Delhi, India",
                paymentMethod: "cash_on_delivery"
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);

        expect(response.body.order).toBeDefined();
        expect(response.body.order.address)
            .toBe("Delhi, India");

        expect(response.body.order.paymentMethod)
            .toBe("cash_on_delivery");
    });

    it("should return 404 if active cart does not exist", async () => {

        const response = await request(app)
            .post("/api/order/placeorder")
            .set(
                "Authorization",
                `Bearer ${userToken}`
            )
            .send({
                address: "Delhi, India",
                paymentMethod: "cash_on_delivery"
            });

        expect(response.status).toBe(404);
    });

    it("should return 400 if address is missing", async () => {

        const response = await request(app)
            .post("/api/order/placeorder")
            .set(
                "Authorization",
                `Bearer ${userToken}`
            )
            .send({
                paymentMethod: "cash_on_delivery"
            });

        expect(response.status).toBe(400);
    });

    it("should return 400 if payment method is missing", async () => {

        const response = await request(app)
            .post("/api/order/placeorder")
            .set(
                "Authorization",
                `Bearer ${userToken}`
            )
            .send({
                address: "Delhi, India"
            });

        expect(response.status).toBe(400);
    });

});

describe("PUT /api/order/status/:id", () => {

    it("should update order status successfully", async () => {


        const category = await createCategory();
        const subCategory = await createSubCategory(category._id);

        const product = await createProduct({
            name: "Test Product",
            category: category._id,
            subcategory: subCategory._id
        });

        await Cart.create({
            userId: user._id,
            status: "active",
            items: [
                {
                    productId: product._id,
                    quantity: 2,
                    price: 10
                }
            ],
            totalPrice: 20
        });

        const order = await Order.create({
            userId: user._id,
            items: [
                {
                    productId: product._id,
                    quantity: 1,
                    price: 10
                }
            ],
            totalPrice: 10,
            address: "Delhi, India",
            paymentMethod: "cash_on_delivery",
            status: "pending"
        });

        const response = await request(app)
            .put(`/api/order/status/${order._id}`)
            .set(
                "Authorization",
                `Bearer ${adminToken}`
            )
            .send({
                status: "cancelled"
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        const updatedOrder = await Order.findById(order._id);

        expect(updatedOrder.status)
            .toBe("cancelled");
    });

});

const createCategory = async (name = "Electronics") => {
    return await Category.create({ name });
};

const createSubCategory = async (categoryId, name = "Mobile") => {
    return await Category.create({
        name,
        parentCategory: categoryId
    });
};

const createProduct = async (overrides = {}) => {
    return await Product.create({
        name: "Default Product",
        description: "test",
        price: 100,
        sku: "DEFAULT",
        stock: 10,
        imageUrl: "test.png",
        ...overrides
    });
};