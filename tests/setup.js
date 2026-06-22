import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { MongoMemoryServer } from "mongodb-memory-server";
import { seedRoles } from "./testSeeder.js";
import Role from "../models/roleModel.js";
import User from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log("Test MongoDB Connected");
});

beforeEach(async () => {
    await seedRoles();

    const userRole = await Role.findOne({
        name: "user"
    });

    const adminRole = await Role.findOne({
        name: "admin"
    });

    const hashedPassword = await bcrypt.hash(
        "123456",
        10
    );

    user = await User.create({
        name: "Normal User",
        email: "user@test.com",
        password: hashedPassword,
        role: userRole._id
    });

    const admin = await User.create({
        name: "Admin User",
        email: "admin@test.com",
        password: hashedPassword,
        role: adminRole._id
    });

    userToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET
    );

    adminToken = jwt.sign(
        { id: admin._id },
        process.env.JWT_SECRET
    );
});

afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});