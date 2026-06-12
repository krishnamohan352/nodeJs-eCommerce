import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { seedRoles } from "./testSeeder.js";
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