import express from 'express';
import adminAuth from "../middleware/adminAuth.js";
import { createCategory, getListCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';

const categoryRouter = express.Router();

categoryRouter.post('/create', adminAuth, createCategory);
categoryRouter.get('/', getListCategory);
categoryRouter.put('/:id', adminAuth, updateCategory);
categoryRouter.delete("/:id", adminAuth, deleteCategory);

export default categoryRouter;
