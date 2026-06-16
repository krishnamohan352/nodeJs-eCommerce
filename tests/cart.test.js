import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Cart from "../models/cartModel.js";
import request from "supertest";
import app from "../app.js";

describe("POST /api/cart/add", () => {

    it("should add product to cart successfully", async () => {

        const category = await createCategory();
        const subCategory = await createSubCategory(category._id);

        const product = await createProduct({
            name: "Test Product",
            category: category._id,
            subcategory: subCategory._id
        });

        const response = await request(app)
            .post("/api/cart/add")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                items: [
                    {
                        productId: product._id,
                        quantity: 1
                    }
                ]
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Product added to cart");

        const cart = await Cart.findOne({ userId: user._id });

        expect(cart).not.toBeNull();
        expect(cart.items.length).toBe(1);
        expect(cart.items[0].productId.toString()).toBe(product._id.toString());
        expect(cart.items[0].quantity).toBe(1);
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