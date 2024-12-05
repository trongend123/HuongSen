import express from "express";
import Booking from "../models/booking.js"; // Assume Booking model exists
import OrderService from "../models/orderService.js"; // Assume OrderService model exists
import OtherServices from "../models/otherService.js";
import Customer from "../models/customer.js";
import OrderRoom from "../models/orderRoom.js";

const getAllServiceBookings = async (req, res) => {
  try {
    // Step 1: Fetch all service bookings (OrderService)
    const orderServices = await OrderService.find()
      .populate("otherServiceId", "name price") // Assuming you have a `Service` collection
      .lean();

    // Step 2: Loop through orderServices to fetch customer details via OrderRoom and bookingId
    const formattedBookings = [];

    for (let service of orderServices) {
      // Step 3: Fetch the related customer using the bookingId
      const orderRoom = await OrderRoom.findOne({ bookingId: service.bookingId })
        .populate("customerId", "fullname") // Assuming customerId is a reference to Customer
        .lean();

      if (orderRoom) {
        const customer = orderRoom.customerId;

        // Check if serviceId exists and has the necessary properties
        const serviceName = service.otherServiceId ? service.otherServiceId.name : "N/A";
        const servicePrice = service.otherServiceId ? service.otherServiceId.price : 0;

        const booking = {
          _id: service._id,
          bookingId: service.bookingId,
          customerName: customer ? customer.fullname : "N/A",
          serviceName: serviceName,
          unitPrice: servicePrice,
          time: service.time,
          quantity: service.quantity || 1,
          status: service.status || "N/A",
          note: service.note || "N/A",
        };
        formattedBookings.push(booking);
      }
    }

    // If no service bookings are found
    if (!formattedBookings.length) {
      return res.status(404).json({ message: "No service bookings found." });
    }

    // Return the formatted bookings list
    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error("Error fetching all service bookings:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
const getOrderServiceByBookingID = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Step 1: Find the order services by bookingId
    const orderServices = await OrderService.find({ bookingId }).exec();

    if (!orderServices || orderServices.length === 0) {
      return res.status(404).json({ message: "No services found for this bookingId" });
    }

    // Step 2: Fetch the associated customer details
    const orderRooms = await OrderRoom.find({ bookingId }).exec();

    if (!orderRooms || orderRooms.length === 0) {
      return res.status(404).json({ message: "No associated customer found for this bookingId" });
    }

    const customerId = orderRooms[0].customerId;
    const customer = await Customer.findById(customerId).exec();

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Step 3: Prepare the response with detailed service booking information
    const serviceBookings = await Promise.all(
      orderServices.map(async (service) => {
        const otherService = await OtherServices.findById(service.otherServiceId).exec();

        return {
          customerName: customer.fullname,
          serviceName: otherService?.name || "Unknown Service",
          unitPrice: otherService?.price || 0,
          quantity: service.quantity,
          status: service.status || "Unknown Status", // Default status if missing
          note: service.note || "No notes",
        };
      })
    );

    // Step 4: Send the response
    res.status(200).json(serviceBookings);
  } catch (error) {
    console.error("Error fetching service booking list:", error);
    res.status(500).json({ message: "An error occurred while fetching service bookings." });
  }
};


export default { getOrderServiceByBookingID, getAllServiceBookings };
