import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import AppError from "../utils/AppError.js";

const createCategoryService = async (data) => {
    try {
        const { name, parentCategory } = data;
        if (!name) {
            throw new AppError("Category name is required", 400);
        }
        if (parentCategory) {
            const parent = await Category.findById(parentCategory);

            if (!parent) {
                throw new AppError("Parent category not found", 400);
            }
        }

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            throw new AppError("Category already exists", 400);
        }

        const category = await Category.create({
            name,
            parentCategory: parentCategory || null
        });
        return category;
    } catch (error) {
        throw error;
    }
}

const updateCategoryService = async (categoryId, updateData) => {

    const { name, parentCategory } = updateData;
    if (parentCategory) {
        if (categoryId === parentCategory) {
            throw new AppError("Category cannot be its own parent", 400);
        }

        const parent = await Category.findById(parentCategory);

        if (!parent) {
            throw new AppError("Parent category not found", 400);
        }
    }

    const category = await Category.findByIdAndUpdate(
        categoryId,
        {
            name,
            parentCategory
        },
        {
            returnDocument: "after",
            runValidators: true
        }
    ).populate("parentCategory", "name");

    if (!category) {
        throw new AppError("Category not found", 400);
    }
    return category;
};

const getListCategoryService = async () => {
    try {
        const categories = await Category.find()
            .populate("parentCategory", "name");

        return categories;
    } catch (error) {
        throw error;
    }
};

const deleteCategoryService = async (categoryId) => {

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new AppError("Category not found", 400);
    }
    const subCategories = await Category.findOne({
        parentCategory: categoryId
    });
    if (subCategories) {
        throw new AppError(
            "Cannot delete category because it has subcategories", 400
        );
    }
    const product = await Product.findOne({
        $or: [
            { category: categoryId },
            { subcategory: categoryId }
        ]
    });
    if (product) {
        throw new AppError(
            "Cannot delete category because products are assigned to it", 400
        );
    }
    await Category.findByIdAndDelete(categoryId);
    return true;
};

export { createCategoryService, getListCategoryService, updateCategoryService, deleteCategoryService }