import Role from "../models/roleModel.js";
import Permission from "../models/permissionModel.js";
import request from "supertest";
import app from "../app.js";

describe("POST /api/role/create", () => {

    it("should create role through API", async () => {

        const response = await request(app)
            .post("/api/role/create")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "manager",
                permissions: []
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);

        const savedRole = await Role.findOne({
            name: "manager"
        });

        expect(savedRole).not.toBeNull();
    });

    it("should return error if role already exists", async () => {
        await Role.create({
            name: "manager",
            permissions: []
        });
        const response = await request(app)
            .post("/api/role/create")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "manager",
                permissions: []
            });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message)
            .toBe("Role already exists");
    });

});


describe("GET /api/role/all", () => {

    it("should return all roles for admin with permission", async () => {

        const response = await request(app)
            .get("/api/role/all")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(Array.isArray(response.body.roles)).toBe(true);
    });

});

describe("PUT /api/role/update/:id", () => {

    it("should update role with existing permissions", async () => {

        role = await Role.findOne({
            name: "user"
        });

        permission1 = await Permission.findOne({
            name: "view_role"
        });

        permission2 = await Permission.findOne({
            name: "create_role"
        });

        const response = await request(app)
            .put(`/api/role/update/${role._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "user",
                permissions: [
                    permission1._id,
                    permission2._id
                ]
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        const updatedRole = await Role.findById(role._id)
            .populate("permissions");

        expect(updatedRole.permissions.length).toBe(2);
    });

});

describe("DELETE /api/role/delete/:id", () => {


    it("should delete role successfully", async () => {

        role = await Role.findOne({
            name: "user"
        });

        const response = await request(app)
            .delete(`/api/role/delete/${role._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message)
            .toBe("Role deleted successfully");

        const deletedRole = await Role.findById(role._id);

        expect(deletedRole).toBeNull();
    });

});