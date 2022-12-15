import Customer from "../models/customerModel.js";

//for add or fetch
export const getCustomerController = async (req, res) => {
    try {
        const Customers = await Customer.find();
        res.status(200).send(Customers);

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

//for add
export const addCustomerController = async (req, res) => {
    try {
        const newCustomers = new Customer(req.body);
        await newCustomers.save();
        res.status(200).send("Customers Created Successfully!");

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

//for update
export const updateCustomerController = async (req, res) => {
    try {
        await Customer.findOneAndUpdate({ _id: req.body.customerId }, req.body, { new: true })
        res.status(201).json("Customer Updated!");
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
}

//for delete
export const deleteCustomerController = async (req, res) => {
    try {

        await Customer.findOneAndDelete({ _id: req.params.customerId })
        res.status(200).json("Customer Deleted!");
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
}