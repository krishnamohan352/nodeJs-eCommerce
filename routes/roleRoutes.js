import express from "express";
import { createRole, getAllRoles, updateRole, deleteRole } from "../controllers/roleController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/create", createRole);
router.get("/all", getAllRoles);
router.put("/update/:id", adminAuth, updateRole);
router.delete("/delete/:id", adminAuth, deleteRole);

export default router;