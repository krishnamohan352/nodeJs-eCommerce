import { createRoleService } from "../../services/roleService.js";
import Role from "../../models/roleModel.js";
import AppError from "../../utils/AppError.js";

describe("createRoleService", () => {

    it("should create a role successfully", async () => {

        const input = {
            name: "manager",
            permissions: []
        };

        const result = await createRoleService(input);

        expect(result).toHaveProperty("_id");
        expect(result.name).toBe("manager");

        const dbRole = await Role.findOne({ name: "manager" });

        expect(dbRole).not.toBeNull();
    });

    it("should throw error if role already exists", async () => {

        const input = {
            name: "manager",
            permissions: []
        };

        await createRoleService(input);

        await expect(createRoleService(input))
            .rejects
            .toThrow("Role already exists");
    });

});