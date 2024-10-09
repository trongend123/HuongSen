import express from "express";
import { LocationController } from "../controllers/index.js";

const locationRouter = express.Router();

// GET: /locations -> Get all locations
locationRouter.get("/", LocationController.getLocations);

// GET: /locations/:id -> Get location by Id
locationRouter.get("/:id", LocationController.getLocationById);

// // POST: /locations -> Create a new location
// locationRouter.post("/", LocationController.createLocation);

// // PUT: /locations/:id
// locationRouter.put("/:id", LocationController.editLocation);

// // DELETE: /locations/:id
// locationRouter.delete("/:id", LocationController.deleteLocation);

export default locationRouter;
