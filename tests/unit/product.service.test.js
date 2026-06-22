
import { addProductService } from "../../services/productService.js";
import Product from "../../models/productModel.js";
import Category from "../../models/categoryModel.js";

describe("addProductService", () => {

    afterEach(async () => {
        await Product.deleteMany({});
        await Category.deleteMany({});
    });

    it("should create product successfully", async () => {

        const category = await Category.create({
            name: "Electronics"
        });

        const input = {
            name: "iPhone 15",
            sku: "IPH15",
            stock: 10,
            description: "Latest iPhone",
            price: 999,
            category: category._id,
            imageUrl: "image.jpg"
        };

        const result = await addProductService(input);

        expect(result).toHaveProperty("_id");
        expect(result.name).toBe("iPhone 15");
        expect(result.price).toBe(999);

        const dbProduct = await Product.findOne({ sku: "IPH15" });

        expect(dbProduct).not.toBeNull();
    });

    it("should throw error if product name is missing", async () => {

        await expect(
            addProductService({
                sku: "P1",
                stock: 10,
                description: "Test",
                price: 100,
                category: "123"
            })
        ).rejects.toThrow("Product name is required");
    });

    it("should throw error if description is missing", async () => {

        await expect(
            addProductService({
                name: "Product",
                sku: "P1",
                stock: 10,
                price: 100,
                category: "123"
            })
        ).rejects.toThrow("Description is required");
    });

    it("should throw error if price is invalid", async () => {

        await expect(
            addProductService({
                name: "Product",
                sku: "P1",
                stock: 10,
                description: "Test",
                price: 0,
                category: "123"
            })
        ).rejects.toThrow("Valid price is required");
    });

    it("should throw error if stock is negative", async () => {

        await expect(
            addProductService({
                name: "Product",
                sku: "P1",
                stock: -5,
                description: "Test",
                price: 100,
                category: "123"
            })
        ).rejects.toThrow("Stock cannot be negative");
    });

    it("should throw error if category not found", async () => {

        const fakeCategoryId = "64b9f8c2f1a123456789abcd";

        await expect(
            addProductService({
                name: "Product",
                sku: "P1",
                stock: 10,
                description: "Test",
                price: 100,
                category: fakeCategoryId
            })
        ).rejects.toThrow("Category not found");
    });

    it("should throw error if subcategory not found", async () => {

        const category = await Category.create({
            name: "Electronics"
        });

        const fakeSubCategoryId = "64b9f8c2f1a123456789abcd";

        await expect(
            addProductService({
                name: "Product",
                sku: "P1",
                stock: 10,
                description: "Test",
                price: 100,
                category: category._id,
                subcategory: fakeSubCategoryId
            })
        ).rejects.toThrow("Subcategory not found");
    });

});