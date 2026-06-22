import {
    loginUserService,
    registerUserService,
    getListUsersService,
    updateUserService,
    deleteUserService
} from '../services/userService.js';

const registerUser = async (req, res) => {
    try {
        const result = await registerUserService(req.body);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: result.user,
            token: result.token
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await updateUserService(
            req.params.id,
            req.body
        );
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        await deleteUserService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUserService({ email, password });
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: result.user,
            token: result.token
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getListUsers = async (req, res) => {
    try {
        const users = await getListUsersService();
        return res.status(200).json({
            success: true,
            message: "List of users fetched successfully",
            users
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
}

export { loginUser, registerUser, getListUsers, updateUser, deleteUser };
