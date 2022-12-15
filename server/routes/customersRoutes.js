import express from "express";
import { getCustomerController, addCustomerController, updateCustomerController, deleteCustomerController } from "../controllers/CustomerController.js";

const customerRouter = express.Router();

customerRouter.get("/getcustomers", getCustomerController);

customerRouter.post("/addcustomers", addCustomerController);

customerRouter.put("/updatecustomers", updateCustomerController);

customerRouter.delete("/deletecustomers/:customerId", deleteCustomerController);

export default customerRouter;