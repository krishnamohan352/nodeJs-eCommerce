import { createPermissionService, getAllPermissionsService, updatePermissionService, deletePermissionService } from "../services/permissionService.js";

const createPermission = async (req, res) => {
    try {
        const { name, description } = req.body;

        const permission = await createPermissionService({ name, description });

        res.status(201).json({
            success: true,
            message: "Permission created",
            permission
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAllPermissions = async (req, res) => {
    try {
        const permissions = await getAllPermissionsService();

        res.status(200).json({
            success: true,
            permissions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updatePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const permission = await updatePermissionService(id, { name, description });

        res.status(200).json({
            success: true,
            message: "Permission updated",
            permission
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deletePermission = async (req, res) => {
    try {
        const { id } = req.params;

        await deletePermissionService(id);

        res.status(200).json({
            success: true,
            message: "Permission deleted"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export { createPermission, getAllPermissions, updatePermission, deletePermission };