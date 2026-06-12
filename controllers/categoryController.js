import {
    createCategoryService,
    getListCategoryService,
    updateCategoryService,
    deleteCategoryService
} from "../services/categoryService.js";

const createCategory = async (req, res) => {
    try {
        const category = await createCategoryService(req.body);

        return res.status(201).json({
            success: true,
            category
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await updateCategoryService(
            req.params.id,
            req.body
        );
        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getListCategory = async (req, res) => {
    try {
        const categories = await getListCategoryService();
        return res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const deleteCategory = async (req, res) => {
    try {
        await deleteCategoryService(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export { createCategory, getListCategory, updateCategory, deleteCategory }
