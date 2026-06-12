import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

const createCategoryService = async (data) => {
    try {
        const { name, parentCategory } = data;
        if (!name) {
            throw new Error("Category name is required");
        }
        if (parentCategory) {
            const parent = await Category.findById(parentCategory);

            if (!parent) {
                throw new Error("Parent category not found");
            }
        }

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            throw new Error("Category already exists");
        }

        const category = await Category.create({
            name,
            parentCategory: parentCategory || null
        });
        return category;
    } catch (error) {
        console.log("Error createCategory sevice=>" + error.message);
        throw error;
    }
}

const updateCategoryService = async (categoryId, updateData) => {

    const { name, parentCategory } = updateData;
    if (parentCategory) {
        if (categoryId === parentCategory) {
            throw new Error("Category cannot be its own parent");
        }

        const parent = await Category.findById(parentCategory);

        if (!parent) {
            throw new Error("Parent category not found");
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
        throw new Error("Category not found");
    }

    return category;
};

const getListCategoryService = async () => {
    try {
        const categories = await Category.find()
            .populate("parentCategory", "name");

        return categories;
    } catch (error) {
        console.error("Error getListCategoryService =>", error.message);
        throw error;
    }
};

const deleteCategoryService = async (categoryId) => {

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new Error("Category not found");
    }
    const subCategories = await Category.findOne({
        parentCategory: categoryId
    });
    if (subCategories) {
        throw new Error(
            "Cannot delete category because it has subcategories"
        );
    }
    const product = await Product.findOne({
        $or: [
            { category: categoryId },
            { subcategory: categoryId }
        ]
    });
    if (product) {
        throw new Error(
            "Cannot delete category because products are assigned to it"
        );
    }
    await Category.findByIdAndDelete(categoryId);
    return true;
};

export { createCategoryService, getListCategoryService, updateCategoryService, deleteCategoryService }