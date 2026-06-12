import Role from "../models/roleModel.js";
import Permission from "../models/permissionModel.js";

export const createRoleAndPermission = async () => {
    try {
        const permissionNames = [
            "create_product",
            "delete_product",
            "update_product",
            "view_products",
            "view_orders",
            "create_permission",
            "view_permissions",
            "create_role",
            "view_roles"
        ];

        const permissions = await Promise.all(
            permissionNames.map((name) =>
                Permission.findOneAndUpdate(
                    { name },
                    { name },
                    {
                        upsert: true,
                        returnDocument: "after",
                    }
                )
            )
        );

        const permissionIds = permissions.map((p) => p._id);

        await Role.findOneAndUpdate(
            { name: "admin" },
            {
                name: "admin",
                permissions: permissionIds,
            },
            {
                upsert: true,
                returnDocument: "after",
            }
        );

        await Role.findOneAndUpdate(
            { name: "user" },
            {
                name: "user",
                permissions: [],
            },
            {
                upsert: true,
                returnDocument: "after",
            }
        );

        console.log("Created roles and permissions successfully");
    } catch (error) {
        console.error("Create roles and permissions error:", error.message);
    }
};