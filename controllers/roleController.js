import { createRoleService, getAllRolesService, updateRoleService, deleteRoleService } from "../services/roleService.js";

const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        const role = await createRoleService({ name, permissions });

        return res.status(201).json({
            success: true,
            message: "Role created",
            role
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllRoles = async (req, res) => {
    try {
        const roles = await getAllRolesService();

        return res.status(200).json({
            success: true,
            message: "Roles retrieved",
            roles
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permissions } = req.body;

        const role = await updateRoleService({ id, name, permissions });

        return res.status(200).json({
            success: true,
            message: "Role updated",
            role
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        await deleteRoleService(id);

        return res.status(200).json({
            success: true,
            message: "Role deleted successfully"
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

export { createRole, getAllRoles, updateRole, deleteRole };
