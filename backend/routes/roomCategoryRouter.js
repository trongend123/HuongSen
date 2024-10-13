import express from "express";
import roomCategoryController from "../controllers/roomCategoryController.js";

const router = express.Router();

router.get("/", roomCategoryController.getAll);
router.get("/:id", roomCategoryController.getById);
router.post("/", roomCategoryController.create);
router.put("/:id", roomCategoryController.update);
router.delete("/:id", roomCategoryController.delete);

export default router;
