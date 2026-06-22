import Product from '../models/productModel.js';
import Category from "../models/categoryModel.js";
import AppError from "../utils/AppError.js";

const addProductService = async ({
    name,
    sku,
    stock,
    description,
    price,
    category,
    subcategory,
    imageUrl
}) => {
    try {
        if (!name) {
            throw new AppError("Product name is required", 400);
        }

        if (!description) {
            throw new AppError("Description is required", 400);
        }

        if (!price || price <= 0) {
            throw new AppError("Valid price is required", 400);
        }

        if (!category) {
            throw new AppError("Category is required", 400);
        }

        if (Number(stock) < 0) {
            throw new AppError("Stock cannot be negative", 400);
        }

        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            throw new AppError("Category not found", 400);
        }

        if (subcategory) {
            const subCategoryExists = await Category.findById(subcategory);
            if (!subCategoryExists) {
                throw new AppError("Subcategory not found", 400);
            }
        }
        const product = await Product.create({
            name,
            sku,
            stock,
            description,
            price,
            category,
            subcategory,
            imageUrl
        });
        return product;
    } catch (error) {
        throw error;
    }
};

const getListProductsService = async () => {
    try {
        const products = await Product.find()
            .populate("category", "name")
            .populate("subcategory", "name");
        return products;
    } catch (error) {
        throw error;
    }
};

const getProductByIdService = async (productId) => {
    try {
        const product = await Product.findById(productId).populate("category", "name")
            .populate("subcategory", "name");
        if (!product) {
            throw new AppError("Product not found", 400);
        }
        return product;
    } catch (error) {
        throw error;
    }
};

const updateProductService = async (productId, updateData) => {
    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        ).populate("category", "name")
            .populate("subcategory", "name");;

        if (!product) {
            throw new AppError("Product not found", 404);
        }
        return product;
    } catch (error) {
        throw error;
    }
};

const deleteProductService = async (productId) => {
    try {
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            throw new Error("Product not found", 404);
        }
        return product;
    } catch (error) {
        throw error;
    }
};

export { addProductService, getListProductsService, getProductByIdService, updateProductService, deleteProductService }