import mongoose from "mongoose";

//for create table into db
const productSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: false },
    price: { type: Number, required: true },
}, {
    //for date
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);
export default Product;