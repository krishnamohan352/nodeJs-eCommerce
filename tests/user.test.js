import request from "supertest";
import bcrypt from 'bcrypt';

import app from "../app.js";
import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import { registerUserService, loginUserService } from "../services/userService.js";

describe("registerUserService", () => {

    it("should register a new user", async () => {
        const result = await registerUserService({
            name: "John",
            email: "john@test.com",
            password: "123456"
        });
        expect(result.user).toBeDefined();
        expect(result.token).toBeDefined();
        expect(result.user.email).toBe("john@test.com");
    });

    it("should throw error if name is missing", async () => {

        await expect(
            registerUserService({
                email: "john@test.com",
                password: "123456"
            })
        ).rejects.toThrow("Name, email and password are required");
    });

    it("should throw error if email is invalid", async () => {

        await expect(
            registerUserService({
                name: "John",
                email: "invalid-email",
                password: "123456"
            })
        ).rejects.toThrow("Invalid email format");
    });

    it("should throw error if password is too short", async () => {

        await expect(
            registerUserService({
                name: "John",
                email: "john@test.com",
                password: "123"
            })
        ).rejects.toThrow(
            "Password must be at least 6 characters long"
        );
    });

    it("should throw error if email already exists", async () => {

        const userRole = await Role.findOne({
            name: "admin"
        });

        await User.create({
            name: "John",
            email: "john@test.com",
            password: "hashedpassword",
            role: userRole._id
        });

        await expect(
            registerUserService({
                name: "John",
                email: "john@test.com",
                password: "123456"
            })
        ).rejects.toThrow("Email already in use");
    });

    it("should register user with provided role", async () => {

        const adminRole = await Role.findOne({
            name: "admin"
        });

        const result = await registerUserService({
            name: "Admin",
            email: "admin@test.com",
            password: "123456",
            role: adminRole._id
        });

        expect(result.user.role.toString())
            .toBe(adminRole._id.toString());

    });

    it("should throw error for invalid role", async () => {

        await expect(
            registerUserService({
                name: "John",
                email: "john@test.com",
                password: "123456",
                role: "507f1f77bcf86cd799439011"
            })
        ).rejects.toThrow("Invalid role provided");
    });


});

describe("loginUserService", () => {

    it("should login user", async () => {

        const hashedPassword = await bcrypt.hash("123456", 10);

        const userRole = await Role.findOne({
            name: "user"
        });

        await User.create({
            name: "John",
            email: "john@test.com",
            password: hashedPassword,
            role: userRole._id
        });

        const result = await loginUserService({
            email: "john@test.com",
            password: "123456"
        });

        expect(result.token).toBeDefined();
    });

});