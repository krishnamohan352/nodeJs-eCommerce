import express from "express";
import { createPermission, getAllPermissions, updatePermission, deletePermission } from "../controllers/permissionController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/create", adminAuth, createPermission);
router.get("/all", adminAuth, getAllPermissions);
router.put("/update/:id", adminAuth, updatePermission);
router.delete("/delete/:id", adminAuth, deletePermission);

export default router;