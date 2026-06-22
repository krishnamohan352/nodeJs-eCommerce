import express from 'express';
import { addProduct, getListProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import { checkPermission } from '../middleware/checkPermission.js';
import { PERMISSIONS } from '../constants/permissions.js';

const productRouter = express.Router();

productRouter.post('/', upload.single('image'), adminAuth, checkPermission(PERMISSIONS.CREATE_PRODUCT), addProduct);
productRouter.get('/', getListProducts);
productRouter.get('/:id', getProductById);
productRouter.put('/:id', upload.single('image'), adminAuth, checkPermission(PERMISSIONS.UPDATE_PRODUCT), updateProduct);
productRouter.delete('/:id', adminAuth, checkPermission(PERMISSIONS.DELETE_PRODUCT), deleteProduct);

export default productRouter;