import express from "express";
import { TourController } from "../controllers/index.js";

const tourRouter = express.Router();

// GET: /tours -> Get all tours
tourRouter.get("/", TourController.getTours);

// GET: /tours/:id -> Get tour by Id
tourRouter.get("/:id", TourController.getTourById);

// POST: /tours -> Create a new tour
tourRouter.post("/", TourController.createTour);

// PUT: /tours/:id
tourRouter.put("/:id", TourController.editTour);

// DELETE: /tours/:id
tourRouter.delete("/:id", TourController.deleteTour);

export default tourRouter;
