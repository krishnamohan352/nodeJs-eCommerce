import User from "../models/userModel.js"
import Role from '../models/roleModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

const createToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const registerUserService = async ({
    name,
    email,
    password,
    role
}) => {
    try {
        if (!name || !email || !password) {
            throw new AppError("Name, email and password are required", 400);
        }
        if (!validator.isEmail(email)) {
            throw new AppError("Invalid email format", 400);
        }
        if (password.length < 6) {
            throw new AppError("Password must be at least 6 characters long", 400);
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError("Email already in use", 400);
        }
        let userRole;

        if (role) {
            userRole = await Role.findById(role);
            if (!userRole) {
                throw new AppError("Invalid role provided", 400);
            }
        } else {
            userRole = await Role.findOne({ name: "user" });
            if (!userRole) {
                throw new Error("Default user role not found");
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole._id,
        });

        const token = createToken(newUser);
        return {
            user: newUser,
            token
        };
    } catch (error) {
        throw error;
    }
};

const updateUserService = async (userId, updateData) => {
    const { name, email, password, role } = updateData;
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    const payload = {};
    if (name) {
        payload.name = name;
    }
    if (email) {
        if (!validator.isEmail(email)) {
            throw new AppError("Invalid email format", 400);
        }
        const existingUser = await User.findOne({
            email,
            _id: { $ne: userId }
        });
        if (existingUser) {
            throw new Error("Email already in use");
        }
        payload.email = email;
    }

    if (password) {
        if (password.length < 6) {
            throw new Error(
                "Password must be at least 6 characters long"
            );
        }
        payload.password = await bcrypt.hash(password, 10);
    }

    if (role) {
        const roleExists = await Role.findById(role);
        if (!roleExists) {
            throw new Error("Invalid role provided");
        }
        payload.role = role;
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        payload,
        {
            returnDocument: "after",
            runValidators: true
        }
    ).populate("role", "name");
    return updatedUser;
};

const deleteUserService = async (userId) => {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    await User.findByIdAndDelete(userId);
    return true;
};

const loginUserService = async ({ email, password }) => {
    if (!email || !password) {
        throw new AppError("Email and password are required", 400);

    }
    const user = await User.findOne({ email }).populate("role");
    if (!user) {
        throw new AppError("User not found.", 401);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }
    const token = createToken(user);
    return { user, token };
};

const getListUsersService = async () => {
    try {
        const users = await User.find().populate('role');
        return users;
    } catch (error) {
        console.log("Get User Service");
        throw error;
    }
}

export { loginUserService, registerUserService, getListUsersService, updateUserService, deleteUserService }