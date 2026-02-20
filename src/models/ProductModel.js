const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        type: { type: String, required: true },
        brand: { type: String },
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        ratedUsers: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
                rating: { type: Number, required: true },
                comment: { type: String, default: "" },
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date }
            }
        ],
        rating: { type: Number, default: 0 },
        ratingCount: { type: Number, default: 0 },
        ratingSum: { type: Number, default: 0 },
        description: { type: String },
        discount: { type: Number },
        selled: { type: Number }
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
