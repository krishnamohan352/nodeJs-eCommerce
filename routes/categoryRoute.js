import express from 'express';
import { createCategory, getListCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';

const categoryRouter = express.Router();

categoryRouter.post('/create', createCategory);
categoryRouter.get('/', getListCategory);
categoryRouter.put('/:id', updateCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
