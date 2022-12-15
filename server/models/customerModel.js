import mongoose from "mongoose";

//for create table into db
const customerSchema = new mongoose.Schema({

    code: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    email: { type: String, required: false },
    // subTotal: { type: Number, required: true },
    // totalAmount: { type: Number, required: true },
    // tax: { type: Number, required: true },
    // paymentMethod: { type: String, required: true },
    // cartItems: { type: Array, required: true }

}, {
    //for date
    timestamps: true
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;