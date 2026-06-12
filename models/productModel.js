import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    imageUrl: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Stock cannot be negative"]
    }
}, {
    timestamps: true
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;