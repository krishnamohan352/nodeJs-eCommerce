import express from 'express';
import { addProduct, getListProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import { checkPermission } from '../middleware/checkPermission.js';

const productRouter = express.Router();

productRouter.post('/', upload.single('image'), adminAuth, checkPermission("create_product"), addProduct);
productRouter.get('/', getListProducts);
productRouter.get('/:id', getProductById);
productRouter.put('/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);

export default productRouter;