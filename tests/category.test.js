import Category from "../models/categoryModel.js";
import request from "supertest";
import app from "../app.js";

describe("POST /api/category/create", () => {
    it("should create category through API", async () => {
        const response = await request(app)
            .post("/api/category/create")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Electronics"
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);

        const savedCategory = await Category.findOne({
            name: "Electronics"
        });
        expect(savedCategory).not.toBeNull();
    });

    it("should return error if category already exists", async () => {
        await Category.create({
            name: "Electronics"
        });
        const response = await request(app)
            .post("/api/category/create")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Electronics"
            });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message)
            .toBe("Category already exists");
    });
});

describe("GET /api/category", () => {

    it("should return all categories for admin with permission", async () => {

        const response = await request(app)
            .get("/api/category")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(Array.isArray(response.body.categories)).toBe(true);
    });

});

describe("PUT /api/category/:id", () => {

    it("should update category successfully", async () => {

        const category = await Category.create({
            name: "Electronics"
        });

        const response = await request(app)
            .put(`/api/category/${category._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Electronics Update"
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message)
            .toBe("Category updated successfully");

        const updatedCategory = await Category.findById(category._id);

        expect(updatedCategory).not.toBeNull();
        expect(updatedCategory.name).toBe("Electronics Update");
    });

});

describe("DELETE /api/category/:id", () => {

    it("should delete category successfully", async () => {

        const category = await Category.create({
            name: "Electronics"
        });

        const response = await request(app)
            .delete(`/api/category/${category._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.message)
            .toBe("Category deleted successfully");

        const deletedCategory = await Category.findById(category._id);

        expect(deletedCategory).toBeNull();
    });

});