import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import bcrypt from 'bcrypt';

export const createAdminUser = async () => {
    try {
        const adminRole = await Role.findOne({ name: "admin" });

        if (!adminRole) {
            throw new Error("Admin role not found. Run role seed first.");
        }

        const existingAdmin = await User.findOne({ email: "admin@gmail.com" });

        if (existingAdmin) {
            throw new Error("Admin user already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash("admin@123", 10);

        const adminUser = await User.create({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: adminRole._id,
        });

    } catch (error) {
        
    }
};