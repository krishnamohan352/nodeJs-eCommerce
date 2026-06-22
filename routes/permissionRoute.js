import express from "express";
import { createPermission, getAllPermissions, updatePermission, deletePermission } from "../controllers/permissionController.js";
import adminAuth from "../middleware/adminAuth.js";
import { checkPermission } from '../middleware/checkPermission.js';
import { PERMISSIONS } from '../constants/permissions.js';

const router = express.Router();

router.post("/create", adminAuth, checkPermission(PERMISSIONS.CREATE_PERMISSION), createPermission);
router.get("/all", adminAuth, checkPermission(PERMISSIONS.VIEW_PERMISSIONS), getAllPermissions);
router.put("/update/:id", adminAuth, checkPermission(PERMISSIONS.UPDATE_PERMISSIONS), updatePermission);
router.delete("/delete/:id", adminAuth, checkPermission(PERMISSIONS.DELETE_PERMISSIONS), deletePermission);

export default router;