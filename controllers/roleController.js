import { createRoleService, getAllRolesService, updateRoleService, deleteRoleService} from "../services/roleService.js";

const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        const role = await createRoleService({ name, permissions });

        res.status(201).json({
            success: true,
            message: "Role created",
            role
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAllRoles = async (req, res) => {
    try {
        const roles = await getAllRolesService();

        res.status(200).json({
            success: true,
            message: "Roles retrieved",
            roles
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permissions } = req.body;

        const role = await updateRoleService({ id, name, permissions });

        res.status(200).json({
            success: true,
            message: "Role updated",
            role
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        await deleteRoleService(id);

        res.status(200).json({
            success: true,
            message: "Role deleted"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export { createRole, getAllRoles, updateRole, deleteRole };
