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
            throw new Error("Product name is required");
        }

        if (!description) {
            throw new Error("Description is required");
        }

        if (!price || price <= 0) {
            throw new Error("Valid price is required");
        }

        if (!category) {
            throw new Error("Category is required");
        }

        if (Number(stock) < 0) {
            throw new Error("Stock cannot be negative");
        }

        if (!imageUrl) {
            throw new Error("Product image is required");
        }

        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            throw new Error("Category not found");
        }

        if (subcategory) {
            const subCategoryExists = await Category.findById(subcategory);
            if (!subCategoryExists) {
                throw new Error("Subcategory not found");
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
        console.log('Error getListProductsService');
    }
};

const getProductByIdService = async (productId) => {
    const product = await Product.findById(productId).populate("category", "name")
        .populate("subcategory", "name");
    if (!product) {
        throw new Error("Product not found");
    }
    return product;
};

const updateProductService = async (productId, updateData) => {
    const product = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true, runValidators: true }
    ).populate("category", "name")
        .populate("subcategory", "name");;

    if (!product) {
        throw new Error("Product not found", 404);
    }

    return product;
};


const deleteProductService = async (productId) => {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
        throw new Error("Product not found", 404);
    }

    return product;
};

export { addProductService, getListProductsService, getProductByIdService, updateProductService, deleteProductService }