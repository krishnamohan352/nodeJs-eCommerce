import Permission from "../models/permissionModel.js";
import request from "supertest";
import app from "../app.js";

describe("POST /api/permission/create", () => {
    it("should create permission through API", async () => {

        const response = await request(app)
            .post("/api/permission/create")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "create_products",
                description: "Allows user to create product"
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);

        const savedPermission = await Permission.findOne({
            name: "create_products"
        });

        expect(savedPermission).not.toBeNull();
    });

    it("should return error if permission already exists", async () => {
        await Permission.create({
            name: "create_products",
            description: "Allows user to create product"
        });
        const response = await request(app)
            .post("/api/permission/create")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "create_products",
                description: "Allows user to create product"
            });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message)
            .toBe("Permission already exists");
    });
});

describe("GET /api/permission/all", () => {

    it("should return all permissions for admin with permission", async () => {

        const response = await request(app)
            .get("/api/permission/all")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(Array.isArray(response.body.permissions)).toBe(true);
    });

});

describe("PUT /api/permission/update/:id", () => {

    it("should update permission successfully", async () => {

        const permission = await Permission.findOne({
            name: "view_role"
        });

        const response = await request(app)
            .put(`/api/permission/update/${permission._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "create_products_update",
                description: "Allows user to create product"
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        const updatedPermission = await Permission.findById(permission._id);

        expect(updatedPermission.name).toBe("create_products_update");
        expect(updatedPermission.description)
            .toBe("Allows user to create product");
    });

});

describe("DELETE /api/permission/delete/:id", () => {

    it("should delete permission successfully", async () => {

        const permission = await Permission.findOne({
            name: "view_role"
        });

        const response = await request(app)
            .delete(`/api/permission/delete/${permission._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        expect(response.body.message)
            .toBe("Permission deleted successfully");

        const deletedPermission = await Permission.findById(permission._id);

        expect(deletedPermission).toBeNull();
    });

});