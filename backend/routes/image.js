import express from "express";
import { ImageController } from "../controllers/index.js";

const imageRouter = express.Router();

// GET: /images -> Get all images
imageRouter.get("/", ImageController.getImages);

// GET: /images/:id -> Get image by Id
imageRouter.get("/:id", ImageController.getImageById);

// POST: /images -> Create a new image
imageRouter.post("/", ImageController.createImage);

// PUT: /images/:id
imageRouter.put("/:id", ImageController.editImage);

// DELETE: /images/:id
imageRouter.delete("/:id", ImageController.deleteImage);

export default imageRouter;
