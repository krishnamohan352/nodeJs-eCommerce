import express from 'express';
import adminAuth from "../middleware/adminAuth.js";
import { checkPermission } from '../middleware/checkPermission.js';
import { PERMISSIONS } from '../constants/permissions.js';
import { createCategory, getListCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';

const categoryRouter = express.Router();

categoryRouter.post('/create', adminAuth, checkPermission(PERMISSIONS.CREATE_CATEGORY), createCategory);
categoryRouter.get('/', adminAuth, checkPermission(PERMISSIONS.VIEW_CATEGORY), getListCategory);
categoryRouter.put('/:id', adminAuth, checkPermission(PERMISSIONS.UPDATE_CATEGORY), updateCategory);
categoryRouter.delete("/:id", adminAuth, checkPermission(PERMISSIONS.DELETE_CATEGORY), deleteCategory);

export default categoryRouter;
