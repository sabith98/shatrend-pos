import express from "express";
import { getSupplierController, addSupplierController, updateSupplierController, deleteSupplierController } from "../controllers/suppliersController.js";

const supplierRouter = express.Router();

supplierRouter.get("/getsuppliers", getSupplierController);

supplierRouter.post("/addsuppliers", addSupplierController);

supplierRouter.put("/updatesuppliers", updateSupplierController);

supplierRouter.delete("/deletesuppliers/:supplierId", deleteSupplierController);

export default supplierRouter;