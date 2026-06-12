import express from "express";
import { createPermission, getAllPermissions,updatePermission,deletePermission } from "../controllers/permissionController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/create", createPermission);
router.get("/all", getAllPermissions);
router.put("/update/:id", updatePermission);
router.delete("/delete/:id", deletePermission);

export default router;