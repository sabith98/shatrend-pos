import Supplier from "../models/supplierModel.js";

//for add or fetch
export const getSupplierController = async (req, res) => {
    try {
        const Suppliers = await Supplier.find();
        res.status(200).send(Suppliers);

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

//for add
export const addSupplierController = async (req, res) => {
    try {
        const newSuppliers = new Supplier(req.body);
        await newSuppliers.save();
        res.status(200).send("Suppliers Created Successfully!");

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

//for update
export const updateSupplierController = async (req, res) => {
    try {
        await Supplier.findOneAndUpdate({ _id: req.body.supplierId }, req.body, { new: true })
        res.status(201).json("Supplier Updated!");
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
}

//for delete
export const deleteSupplierController = async (req, res) => {
    try {
        await Supplier.findOneAndDelete({ _id: req.params.supplierId })
        res.status(200).json("Supplier Deleted!");
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
}