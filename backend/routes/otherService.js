import express from "express";
import { OtherServiceController } from "../controllers/index.js";

const otherServiceRouter = express.Router();

// GET: /otherServices -> Get all otherServices
otherServiceRouter.get("/", OtherServiceController.getOtherServices);

// GET: /otherServices/:id -> Get otherService by Id
otherServiceRouter.get("/:id", OtherServiceController.getOtherServiceById);

// POST: /otherServices -> Create a new otherService
otherServiceRouter.post("/", OtherServiceController.createOtherService);

// PUT: /otherServices/:id
otherServiceRouter.put("/:id", OtherServiceController.editOtherService);

// DELETE: /otherServices/:id
//otherServiceRouter.delete("/:id", OtherServiceController.deleteOtherService);

otherServiceRouter.delete("/:id", OtherServiceController.softDeleteOtherService);
otherServiceRouter.get("/location/:locationId", OtherServiceController.getOtherServicesByLocation);

export default otherServiceRouter;
