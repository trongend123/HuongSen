import express from "express";
import { IdentifycationController } from "../controllers/index.js";

const identifycationRouter = express.Router();

// GET: /identifycations -> Get all identifications
identifycationRouter.get("/", IdentifycationController.getIdentifycations);

// GET: /identifycations/:id -> Get identification by Id
identifycationRouter.get("/:id", IdentifycationController.getIdentifycationById);
// Route to get identifications by customer ID
identifycationRouter.get('/customer/:customerID', IdentifycationController.getIdentificationByCustomerId);

// POST: /identifycations -> Create a new identification
identifycationRouter.post("/", IdentifycationController.createIdentifycation);

// PUT: /identifycations/:id -> Update identification by Id
identifycationRouter.put("/:id", IdentifycationController.editIdentifycation);

// DELETE: /identifycations/:id -> Delete identification by Id
identifycationRouter.delete("/:id", IdentifycationController.deleteIdentifycation);

export default identifycationRouter;
