import { createCategoryService } from "../../services/categoryService.js";
import Category from "../../models/categoryModel.js";
import AppError from "../../utils/AppError.js";

describe("createCategoryService", () => {

    it("should create category successfully without parent", async () => {

        const input = {
            name: "Electronics"
        };

        const result = await createCategoryService(input);

        expect(result).toHaveProperty("_id");
        expect(result.name).toBe("Electronics");
        expect(result.parentCategory).toBeNull();

        const dbCategory = await Category.findOne({ name: "Electronics" });

        expect(dbCategory).not.toBeNull();
    });

    it("should create category with parent category", async () => {

        const parent = await Category.create({
            name: "Products"
        });

        const input = {
            name: "Mobiles",
            parentCategory: parent._id
        };

        const result = await createCategoryService(input);

        expect(result.name).toBe("Mobiles");
        expect(result.parentCategory.toString()).toBe(parent._id.toString());
    });

    it("should throw error if name is missing", async () => {

        await expect(
            createCategoryService({})
        ).rejects.toThrow("Category name is required");
    });

    it("should throw error if parent category not found", async () => {

        const fakeId = "64b9f8c2f1a123456789abcd";

        await expect(
            createCategoryService({
                name: "Mobiles",
                parentCategory: fakeId
            })
        ).rejects.toThrow("Parent category not found");
    });

    it("should throw error if category already exists", async () => {

        await Category.create({
            name: "Electronics"
        });

        await expect(
            createCategoryService({
                name: "Electronics"
            })
        ).rejects.toThrow("Category already exists");
    });

});