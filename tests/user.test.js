import request from "supertest";
import app from "../app.js";
import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import mongoose from "mongoose";

describe("POST /api/user/register", () => {

    it("should register a new user", async () => {

        const response = await request(app)
            .post("/api/user/register")
            .send({
                name: "John",
                email: "john@test.com",
                password: "123456"
            });

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.user).toBeDefined();

        expect(response.body.token).toBeDefined();

        expect(response.body.user.email)
            .toBe("john@test.com");

        const savedUser = await User.findOne({
            email: "john@test.com"
        });

        expect(savedUser).not.toBeNull();
    });

    it("should return error if name is missing", async () => {

        const response = await request(app)
            .post("/api/user/register")
            .send({
                email: "john@test.com",
                password: "123456"
            });

        expect(response.status).toBe(400);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("Name, email and password are required");
    });

    it("should return error if email is invalid", async () => {

        const response = await request(app)
            .post("/api/user/register")
            .send({
                name: "John",
                email: "invalid-email",
                password: "123456"
            });

        expect(response.status).toBe(400);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("Invalid email format");
    });

    it("should return error if password is too short", async () => {

        const response = await request(app)
            .post("/api/user/register")
            .send({
                name: "John",
                email: "john@test.com",
                password: "123"
            });

        expect(response.status).toBe(400);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("Password must be at least 6 characters long");
    });

    it("should return error if email already exists", async () => {

        const userRole = await Role.findOne({
            name: "user"
        });

        await User.create({
            name: "John",
            email: "john@test.com",
            password: "hashedpassword",
            role: userRole._id
        });

        const response = await request(app)
            .post("/api/user/register")
            .send({
                name: "John",
                email: "john@test.com",
                password: "123456"
            });

        expect(response.status).toBe(400);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("Email already in use");
    });

    it("should return error for invalid role", async () => {

        const response = await request(app)
            .post("/api/user/register")
            .send({
                name: "John",
                email: "john@test.com",
                password: "123456",
                role: "507f1f77bcf86cd799439011"
            });

        expect(response.status).toBe(400);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("Invalid role provided");
    });

});

describe("POST /api/user/login", () => {

    it("should login user", async () => {

        const response = await request(app)
            .post("/api/user/login")
            .send({
                email: "user@test.com",
                password: "123456"
            });

        expect(response.status).toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(response.body.token)
            .toBeDefined();
    });

    it("should return error if user does not exist", async () => {

        const response = await request(app)
            .post("/api/user/login")
            .send({
                email: "notfound@test.com",
                password: "123456"
            });

        expect(response.status).toBe(401);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("User not found.");
    });

    it("should return error if password is incorrect", async () => {

        const response = await request(app)
            .post("/api/user/login")
            .send({
                email: "user@test.com",
                password: "wrongpassword"
            });

        expect(response.status).toBe(401);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("Invalid email or password");
    });

    it("should return error if email is missing", async () => {

        const response = await request(app)
            .post("/api/user/login")
            .send({
                password: "123456"
            });

        expect(response.status).toBe(400);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("Email and password are required");
    });

});

describe("PUT /api/user/:id", () => {

    it("should update user successfully", async () => {

        const response = await request(app)
            .put(`/api/user/${user._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "John Updated",
                email: "johnupdated@test.com"
            });

        expect(response.status).toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(response.body.message)
            .toBe("User updated successfully");

        const updatedUser = await User.findById(
            user._id
        );

        expect(updatedUser.name)
            .toBe("John Updated");

        expect(updatedUser.email)
            .toBe("johnupdated@test.com");
    });

    it("should return 404 if user not found", async () => {

        const nonExistingUserId =
            new mongoose.Types.ObjectId();

        const response = await request(app)
            .put(`/api/user/${nonExistingUserId}`)
            .set(
                "Authorization",
                `Bearer ${adminToken}`
            )
            .send({
                name: "Updated User"
            });

        expect(response.status).toBe(404);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("User not found");
    });

    it("should return 400 for invalid data", async () => {

        const response = await request(app)
            .put(`/api/user/${user._id}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "John Updated",
                email: "invalid-email"
            });

        expect(response.status).toBe(400);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("Invalid email format");
    });
});

describe("DELETE /api/user/:id", () => {

    it("should delete user successfully", async () => {

        const response = await request(app)
            .delete(`/api/user/${user._id}`)
            .set(
                "Authorization",
                `Bearer ${adminToken}`
            );

        expect(response.status).toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(response.body.message)
            .toBe("User deleted successfully");

        const deletedUser = await User.findById(
            user._id
        );

        expect(deletedUser).toBeNull();
    });

    it("should return 401 if token is not provided", async () => {

        const response = await request(app)
            .delete(`/api/user/${user._id}`);

        expect(response.status).toBe(401);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("No token provided");
    });

    it("should return 403 if user is not admin", async () => {

        const response = await request(app)
            .delete(`/api/user/${user._id}`)
            .set(
                "Authorization",
                `Bearer ${userToken}`
            );

        expect(response.status).toBe(403);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("Access denied: admin only");
    });

    it("should return 404 if user does not exist", async () => {

        const nonExistingUserId =
            new mongoose.Types.ObjectId();

        const response = await request(app)
            .delete(`/api/user/${nonExistingUserId}`)
            .set(
                "Authorization",
                `Bearer ${adminToken}`
            );

        expect(response.status).toBe(404);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("User not found");
    });

    it("should return 400 if user id is invalid", async () => {

        const response = await request(app)
            .delete("/api/user/invalid-id")
            .set(
                "Authorization",
                `Bearer ${adminToken}`
            );

        expect(response.status).toBe(400);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("Invalid user ID");
    });

});

describe("GET /api/user", () => {

    it("should return all users", async () => {

        const response = await request(app)
            .get("/api/user")
            .set(
                "Authorization",
                `Bearer ${adminToken}`
            );

        expect(response.status).toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(response.body.users)
            .toBeDefined();

        expect(Array.isArray(response.body.users))
            .toBe(true);

        expect(response.body.users.length)
            .toBeGreaterThan(0);
    });

    it("should return 401 without token", async () => {

        const response = await request(app)
            .get("/api/user");

        expect(response.status).toBe(401);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("No token provided");
    });

    it("should return 403 for non-admin user", async () => {

        const response = await request(app)
            .get("/api/user/")
            .set(
                "Authorization",
                `Bearer ${userToken}`
            );

        expect(response.status).toBe(403);

        expect(response.body.success)
            .toBe(false);

        expect(response.body.message)
            .toBe("Access denied: admin only");
    });

});