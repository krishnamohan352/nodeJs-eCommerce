import Permission from "../models/permissionModel.js";

const createPermissionService = async ({ name, description }) => {

    const existing = await Permission.findOne({ name });

    if (existing) {
        throw new Error("Permission already exists");
    }

    const permission = await Permission.create({
        name,
        description
    });

    return permission;
};

const getAllPermissionsService = async () => {
    const permissions = await Permission.find();
    return permissions;
};

const updatePermissionService = async (id, { name, description }) => {
    const permission = await Permission.findById(id);

    if (!permission) {
        throw new Error("Permission not found");
    }

    permission.name = name || permission.name;
    permission.description = description || permission.description;

    await permission.save();

    return permission;
};

const deletePermissionService = async (id) => {
    const permission = await Permission.findByIdAndDelete(id);

    if (!permission) {
        throw new Error("Permission not found");
    }

    return permission;
};

export { createPermissionService, getAllPermissionsService, updatePermissionService, deletePermissionService };