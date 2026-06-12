import productModel from '../models/productModel.js';
import { addProductService, getListProductsService, getProductByIdService, updateProductService, deleteProductService } from "../services/productService.js";

const addProduct = async (req, res) => {
    try {
        const imageUrl = req.file
            ? `/catalog/product/${req.file.filename}`
            : null;

        const product = await addProductService({
            ...req.body,
            imageUrl
        });

        
        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            data: product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add product",
            error: error.message
        });
    }
};



const getListProducts = async (req, res) => {
    try {
        const products = await getListProductsService();

        return res.status(200).json({
            success: true,
            message: "List of products retrieved successfully",
            products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve products",
            error: error.message
        });
    }
};



const getProductById = async (req, res) => {
    try {
        const product = await getProductByIdService(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product details retrieved successfully",
            product,
        });
    } catch (error) {
        if (error.message === "Product not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to retrieve product",
            error: error.message,
        });
    }
};



const updateProduct = async (req, res) => {
    try {
        const product = await updateProductService(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to update product",
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await deleteProductService(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            product,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to delete product",
        });
    }
};

export { addProduct, getListProducts, getProductById, updateProduct, deleteProduct };
