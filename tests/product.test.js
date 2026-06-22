import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import request from "supertest";
import path from "path";
import app from "../app.js";

describe("POST /api/product (file upload)", () => {
    it("should create product with image upload", async () => {

        const category = await createCategory();
        const subCategory = await createSubCategory(category._id);

        const imagePath = path.join(process.cwd(), "tests/image/test.png");

        const response = await request(app)
            .post("/api/product")
            .set("Authorization", `Bearer ${adminToken}`)
            .field("name", "iPhone 15")
            .field("description", "Latest Apple iPhone")
            .field("price", "999")
            .field("category", category._id.toString())
            .field("subcategory", subCategory._id.toString())
            .field("sku", "IPHONE15")
            .field("stock", "100")
            .attach("image", imagePath);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);

        const product = await Product.findOne({ name: "iPhone 15" });
        expect(product).not.toBeNull();
        expect(product.imageUrl).toBeDefined();
    });
});

describe("PUT /api/product/:id", () => {

    it("should update product with image upload", async () => {

        const category = await createCategory();
        const subCategory = await createSubCategory(category._id);

        const product = await Product.create({
            name: "Old Phone",
            description: "old",
            price: 500,
            category: category._id,
            subcategory: subCategory._id,
            sku: "OLD123",
            stock: 10
        });

        const imagePath = path.join(process.cwd(), "tests/image/test.png");

        const response = await request(app)
            .put(`/api/product/${product._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .field("name", "iPhone 15 Pro")
            .field("description", "updated")
            .field("price", "999")
            .field("category", category._id.toString())
            .field("subcategory", subCategory._id.toString())
            .field("sku", "IP15")
            .field("stock", "50")
            .attach("image", imagePath);

        expect(response.status).toBe(200);

        const updatedProduct = await Product.findById(product._id);
        expect(updatedProduct.name).toBe("iPhone 15 Pro");
    });
});

describe("DELETE /api/product/:id", () => {

    it("should delete product successfully", async () => {

        const category = await createCategory();
        const subCategory = await createSubCategory(category._id);

        const product = await createProduct({
            name: "Test Product",
            category: category._id,
            subcategory: subCategory._id
        });

        const response = await request(app)
            .delete(`/api/product/${product._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        const deletedProduct = await Product.findById(product._id);
        expect(deletedProduct).toBeNull();
    });
});

describe("GET /api/product", () => {

    it("should return all products", async () => {

        const category = await createCategory();
        const subCategory = await createSubCategory(category._id);

        const product = await createProduct({
            name: "Test Product",
            category: category._id,
            subcategory: subCategory._id
        });

        const response = await request(app)
            .get("/api/product");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.products).toBeDefined();
        expect(response.body.products.length).toBeGreaterThanOrEqual(1);
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