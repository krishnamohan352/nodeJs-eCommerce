import express from "express";
import { createRole, getAllRoles, updateRole, deleteRole } from "../controllers/roleController.js";
import adminAuth from "../middleware/adminAuth.js";
import { checkPermission } from '../middleware/checkPermission.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = express.Router();

router.post("/create", adminAuth, checkPermission(PERMISSIONS.CREATE_ROLE), createRole);
router.get("/all", adminAuth, checkPermission(PERMISSIONS.VIEW_ROLES), getAllRoles);
router.put("/update/:id", adminAuth, checkPermission(PERMISSIONS.UPDATE_ROLE), updateRole);
router.delete("/delete/:id", adminAuth, checkPermission(PERMISSIONS.DELETE_ROLE), deleteRole);

export default router;