import Role from "../models/roleModel.js";
import Permission from "../models/permissionModel.js";
import { permissionNames, userPermissionNames } from "../constants/permissions.js";

export const seedRoles = async () => {

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

    const userPermissions = await Promise.all(
        userPermissionNames.map((name) =>
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

    const userPermissionIds = userPermissions.map((permission) => permission._id);   

    await Role.findOneAndUpdate(
        { name: "user" },
        {
            name: "user",
            permissions: userPermissionIds,
        },
        {
            upsert: true,
            returnDocument: "after",
        }
    );
};