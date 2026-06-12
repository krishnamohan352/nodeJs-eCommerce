import Role from "../models/roleModel.js";

export const seedRoles = async () => {

    await Role.create({
        name: "user",
        permissions: []
    });

    await Role.create({
        name: "admin",
        permissions: []
    });

};