import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { registerUserService } from "../../services/userService.js";
import User from "../../models/userModel.js";
import Role from "../../models/roleModel.js";

describe("registerUserService", () => {

    it("should register user with provided role", async () => {

        const role = await Role.create({
            name: "seller"
        });

        const input = {
            name: "John",
            email: "john@test.com",
            password: "123456"
        };

        const result = await registerUserService(input);

        expect(result).toHaveProperty("user");
        expect(result).toHaveProperty("token");

        expect(result.user.email).toBe("john@test.com");

        const isMatch = await bcrypt.compare(
            "123456",
            result.user.password
        );

        expect(isMatch).toBe(true);

        const dbUser = await User.findOne({ email: "john@test.com" });
        expect(dbUser).not.toBeNull();
    });    

    it("should throw error if required fields are missing", async () => {

        await expect(
            registerUserService({
                email: "test@test.com",
                password: "123456"
            })
        ).rejects.toThrow("Name, email and password are required");
    });

    it("should throw error for invalid email format", async () => {

        await expect(
            registerUserService({
                name: "John",
                email: "invalid-email",
                password: "123456"
            })
        ).rejects.toThrow("Invalid email format");
    });

    it("should throw error for short password", async () => {

        await expect(
            registerUserService({
                name: "John",
                email: "john@test.com",
                password: "123"
            })
        ).rejects.toThrow("Password must be at least 6 characters long");
    });

    it("should throw error if email already exists", async () => {

        const role = await Role.create({ name: "seller" });

        await User.create({
            name: "John",
            email: "john@test.com",
            password: "hashedpass",
            role: role._id
        });

        await expect(
            registerUserService({
                name: "John",
                email: "john@test.com",
                password: "123456"
            })
        ).rejects.toThrow("Email already in use");
    });

    it("should throw error if role is invalid", async () => {

        await expect(
            registerUserService({
                name: "John",
                email: "john@test.com",
                password: "123456",
                role: new mongoose.Types.ObjectId()
            })
        ).rejects.toThrow("Invalid role provided");
    });
});
