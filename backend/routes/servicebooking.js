import express from "express";
import ServiceBookingListController from "../controllers/servicesbookinglist.js";

const ServiceBookingRouter = express.Router();

// Route to get service bookings by bookingId
ServiceBookingRouter.get("/:bookingId", ServiceBookingListController.getOrderServiceByBookingID);
ServiceBookingRouter.get("/", ServiceBookingListController.getAllServiceBookings);
export default ServiceBookingRouter;
