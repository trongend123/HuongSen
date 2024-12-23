import express from "express";
import Booking from "../models/booking.js"; // Assume Booking model exists
import OrderService from "../models/orderService.js"; // Assume OrderService model exists
import OtherServices from "../models/otherService.js";
import Customer from "../models/customer.js";
import OrderRoom from "../models/orderRoom.js";

const getAllServiceBookings = async (req, res) => {
  try {
    // Step 1: Aggregate data using MongoDB's aggregation pipeline
    const orderServices = await OrderService.aggregate([
      {
        $lookup: {
          from: "otherservices", // Collection name for `otherServiceId`
          localField: "otherServiceId",
          foreignField: "_id",
          as: "otherServiceDetails",
        },
      },
      {
        $lookup: {
          from: "orderrooms", // Collection name for `OrderRoom`
          localField: "bookingId",
          foreignField: "bookingId",
          as: "orderRoomDetails",
        },
      },
      {
        $unwind: {
          path: "$otherServiceDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$orderRoomDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "customers", // Collection name for `customerId`
          localField: "orderRoomDetails.customerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: {
          path: "$customerDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          bookingId: 1,
          "customerName": "$customerDetails.fullname",
          "serviceName": "$otherServiceDetails.name",
          "unitPrice": "$otherServiceDetails.price",
          "time": 1,
          "quantity": { $ifNull: ["$quantity", 1] },
          "status": { $ifNull: ["$status", "N/A"] },
          "note": { $ifNull: ["$note", "N/A"] },
        },
      },
    ]);

    // Step 2: Remove duplicates based on `_id`
    const uniqueServices = [];
    const seenIds = new Set();

    for (const service of orderServices) {
      if (!seenIds.has(service._id.toString())) {
        seenIds.add(service._id.toString());
        uniqueServices.push(service);
      }
    }

    // If no service bookings are found
    if (!uniqueServices.length) {
      return res.status(404).json({ message: "No service bookings found." });
    }

    // Step 3: Return the unique service bookings
    res.status(200).json(uniqueServices);
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
