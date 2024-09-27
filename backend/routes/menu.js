import express from "express";
import { MenuController } from "../controllers/index.js";

const menuRouter = express.Router();

// GET: /menus -> Get all menus
menuRouter.get("/", MenuController.getMenus);

// GET: /menus/:id -> Get menu by Id
menuRouter.get("/:id", MenuController.getMenuById);

// POST: /menus -> Create a new menu
menuRouter.post("/", MenuController.createMenu);

// PUT: /menus/:id
menuRouter.put("/:id", MenuController.editMenu);

// DELETE: /menus/:id
menuRouter.delete("/:id", MenuController.deleteMenu);

export default menuRouter;
