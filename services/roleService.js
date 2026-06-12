import Role from "../models/roleModel.js";

const createRoleService = async ({ name, permissions }) => {

    const existing = await Role.findOne({ name });

    if (existing) {
        throw new Error("Role already exists");
    }

    const role = await Role.create({
        name,
        permissions
    });

    return role;
};

const getAllRolesService = async () => {
    const roles = await Role.find().populate("permissions");
    return roles;
};

const updateRoleService = async ({ id, name, permissions }) => {
    const role = await Role.findByIdAndUpdate(
        id,
        { name, permissions },
        { new: true }
    ).populate("permissions");

    if (!role) {
        throw new Error("Role not found");
    }

    return role;
};

const deleteRoleService = async (id) => {
    const role = await Role.findByIdAndDelete(id);

    if (!role) {
        throw new Error("Role not found");
    }

    return role;
};

export { createRoleService, getAllRolesService, updateRoleService, deleteRoleService };