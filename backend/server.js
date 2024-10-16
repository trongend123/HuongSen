// Import express module
import express, { json } from "express";
import * as dotenv from "dotenv";
import connectDB from "./database/database.js";
import cors from "cors";
import {
  ImageRouter,
  RoomRouter,
  OtherServiceRouter,
  MenuRouter,
  LocationRouter,
  IdentifycationRouter,
  HistoryRoutes,
  TaxRouter,
  BookingRouter,
  CustomerRouter,
  StaffRouter,
  RoomCategoryRouter,
  OrderRoomRouter,
} from "./routes/index.js";
import { loginUser, registerUser, verifyAccessToken } from "./authens/auth.js"; // Import changePassword

// Execute application configuration using .env file
dotenv.config();

// Create app object to initialize web container
const app = express();
app.use(json());
app.use(cors());

// Configure routing for requests sent to the web server
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/images", ImageRouter);
app.use("/rooms", RoomRouter);
app.use("/otherservices", OtherServiceRouter);
app.use("/menus", MenuRouter);
app.use("/locations", LocationRouter);
app.use("/customers", CustomerRouter);
app.use("/staffs", StaffRouter);
app.use("/identifycations", IdentifycationRouter);
app.use("/histories", HistoryRoutes);
app.use("/taxes", TaxRouter);
app.use("/bookings", BookingRouter);
app.use("/roomCategories", RoomCategoryRouter);
app.use("/orderRooms", OrderRoomRouter);

// Auth routes
app.post('/register', registerUser); // Register route
app.post('/login', loginUser); // Login route

// Protected route (requires a valid access token)
app.get('/profile', verifyAccessToken, (req, res) => {
  res.json({ message: `Hello, ${req.payload.aud}` });
});

// Set up CORS headers
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Start the server
const port = process.env.PORT || 8080;

app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on: http://localhost:${port}`);
});