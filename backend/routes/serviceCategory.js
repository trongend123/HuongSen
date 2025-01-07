// routes/serviceCategoryRoutes.js
import express from "express";
import serviceCategoryController from "../controllers/serviceCategory.js";

const serviceCategoryRouter = express.Router();

serviceCategoryRouter.post("/", serviceCategoryController.createServiceCategory);
serviceCategoryRouter.get("/", serviceCategoryController.getAllServiceCategories);
serviceCategoryRouter.get("/:id", serviceCategoryController.getServiceCategoryById);
serviceCategoryRouter.put("/:id", serviceCategoryController.updateServiceCategory);
serviceCategoryRouter.delete("/:id", serviceCategoryController.deleteServiceCategory);

export default serviceCategoryRouter;
