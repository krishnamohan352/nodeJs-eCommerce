import Role from "../models/roleModel.js";
import Permission from "../models/permissionModel.js";
import { permissionNames } from "../constants/permissions.js";

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

    await Role.create({
        name: "user",
        permissions: []
    });
};