import User from "../models/userModel.js"
import Role from '../models/roleModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

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
            throw new Error("Name, email and password are required");
        }
        if (!validator.isEmail(email)) {
            throw new Error("Invalid email format");
        }
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("Email already in use");
        }
        let userRole;

        if (role) {
            userRole = await Role.findById(role);
            if (!userRole) {
                throw new Error("Invalid role provided");
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
        // console.error("Error registering user:", error.message);
        throw error;
    }
};

const updateUserService = async (userId, updateData) => {
    const { name, email, password, role } = updateData;
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const payload = {};
    if (name) {
        payload.name = name;
    }
    if (email) {
        if (!validator.isEmail(email)) {
            throw new Error("Invalid email format");
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
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    await User.findByIdAndDelete(userId);
    return true;
};

const loginUserService = async ({ email, password }) => {
    const user = await User.findOne({ email }).populate("role");
    console.log(user)
    if (!user) {
        throw new Error("User not found.");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
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