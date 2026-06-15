import express from "express";
import { createRole, getAllRoles, updateRole, deleteRole } from "../controllers/roleController.js";
import adminAuth from "../middleware/adminAuth.js";
import { checkPermission } from '../middleware/checkPermission.js';

const router = express.Router();

router.post("/create", adminAuth, checkPermission("create_role"), createRole);
router.get("/all", adminAuth, checkPermission("view_role"), getAllRoles);
router.put("/update/:id", adminAuth, checkPermission("update_role"), updateRole);
router.delete("/delete/:id", adminAuth, checkPermission("delete_role"), deleteRole);

export default router;