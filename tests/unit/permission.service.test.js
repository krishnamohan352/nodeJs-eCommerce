import { createPermissionService } from "../../services/permissionService.js";
import Role from "../../models/roleModel.js";
import Permission from "../../models/permissionModel.js";
import AppError from "../../utils/AppError.js";
 
import "../setup.js"; // ensures MongoMemoryServer is connected

describe("createPermissionService (real DB)", () => {
    
    it("should create permission successfully", async () => {

        const input = {
            name: "READ_USERS",
            description: "Can read users"
        };

        const result = await createPermissionService(input);

        expect(result).toHaveProperty("_id");
        expect(result.name).toBe("READ_USERS");
        expect(result.description).toBe("Can read users");

        const dbPermission = await Permission.findOne({ name: "READ_USERS" });

        expect(dbPermission).not.toBeNull();
    });

    it("should throw error if permission already exists", async () => {

        const input = {
            name: "READ_USERS",
            description: "Can read users"
        };

        await createPermissionService(input);

        await expect(createPermissionService(input))
            .rejects
            .toThrow("Permission already exists");
    });

});