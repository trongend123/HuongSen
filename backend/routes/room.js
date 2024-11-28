import express from "express";
import { RoomController } from "../controllers/index.js";

const roomRouter = express.Router();

// GET: /rooms -> Get all rooms
roomRouter.get("/", RoomController.getRooms);

// GET: /rooms/:id -> Get room by Id
roomRouter.get("/:id", RoomController.getRoomById);
roomRouter.get("/category/totals", RoomController.getTotalRoomsByCategory);

// GET: /rooms/category/:roomCategoryId
roomRouter.get("/category/:roomCategoryId", RoomController.getRoomsInCategory);

// POST: /rooms -> Create a new room
// roomRouter.post("/", RoomController.createRoom);

// PUT: /rooms/:id
roomRouter.put("/:id", RoomController.editRoom);

// DELETE: /rooms/:id
// roomRouter.delete("/:id", RoomController.deleteRoom);
roomRouter.get('/booking/:bookingId', RoomController.getRoomsByBookingId);
export default roomRouter;
