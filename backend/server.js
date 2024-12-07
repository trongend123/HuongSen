// import express module
import express, { json } from "express";
import * as dotenv from "dotenv";
import connectDB from "./database/database.js";
import cors from "cors";
import http from 'http';
import { Server } from 'socket.io';
import nodemailer from 'nodemailer';
import {
  ImageRouter,
  RoomRouter,
  // TourRouter,
  OtherServiceRouter,
  MenuRouter,
  LocationRouter,
  // IdentityCategoryRouter,
  IdentifycationRouter,
  // FeedbackRouter,
  HistoryRoutes,
  TaxRouter,
  BookingRouter,
  // MemberRouter,
  // AvatarRouter,
  CustomerRouter,
  StaffRouter,
  // VoucherRouter,
  // VoucherAccRouter,  
  RoomCategoryRouter,
  OrderRoomRouter,
  AgencyRouter,
  ContractRouter,
  OrderServiceRouter,
  paymentRoute,
  ServiceBookingRouter,
  Email,
  ChatRouter
} from "./routes/index.js";
//import { verifyAccessToken } from "./jwt_helper.js";
import { changePassword, loginUser, registerUser, verifyAccessToken } from "./authens/auth.js";
// import Avatar from "./models/avatar.js";
// Thực thi cấu hình ứng dụng sử dụng file .env
dotenv.config();
// Tạo đối tượng app để khởi tạo web container
const app = express();
app.use(json());

const server = http.createServer(app);

app.use(cors());
const io = new Server(server, {
  cors: {
    origin: process.env.REACT_URL,
    methods: ["GET", "POST"],
  },
  transports: ["polling", "websocket"], // Allow both transports
});
io.on("connection", (socket) => {
  console.log("Người dùng đã kết nối:", socket.id);

  // Phát thông báo tới client
  socket.emit("notification", { message: "Chào mừng bạn đến với ứng dụng!" });

  // Lắng nghe sự kiện từ client
  socket.on("send_notification", (data) => {
    console.log("Thông báo từ client:", data);
    io.emit("notification", data); // Phát thông báo tới tất cả client
  });

  socket.on("disconnect", () => {
    console.log("Người dùng đã ngắt kết nối:", socket.id);
  });
});


// Cấu hình hoạt động routing (định tuyến) các request gửi tới web server
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/images", ImageRouter);
app.use("/rooms", RoomRouter);
// app.use("/tours", TourRouter);
app.use("/otherservices", OtherServiceRouter);
app.use("/menus", MenuRouter);
app.use("/locations", LocationRouter);
// app.use("/avatars", AvatarRouter);
app.use("/customers", CustomerRouter);
app.use("/staffs", StaffRouter);
// app.use("/vouchers", VoucherRouter);
// // app.use("/vouchersaccs", VoucherAccRouter);
// app.use("/identityCategorys", IdentityCategoryRouter);
app.use("/identifycations", IdentifycationRouter);
// app.use("/feedbacks", FeedbackRouter);
app.use("/histories", HistoryRoutes);
app.use("/taxes", TaxRouter);
app.use("/bookings", BookingRouter);
// app.use("/members", MemberRouter);
app.use("/staffs", StaffRouter);
app.use("/roomCategories", RoomCategoryRouter);
app.use("/orderRooms", OrderRoomRouter);
// add route for agency and contract
app.use("/agencies", AgencyRouter);
app.use("/contracts", ContractRouter);
app.use("/orderServices", OrderServiceRouter);
// Khai báo port cho ứng dụng web
//authen
// Register route
app.post('/register', registerUser);
//service booking
app.use("/service-bookings", ServiceBookingRouter);


// Login route
app.post('/login', loginUser);
app.put('/change-password', changePassword);
//payment
app.use("/payment", paymentRoute);
// Chat route
app.use('/chats', ChatRouter);
app.use("/email", Email);

// Protected route (requires a valid access token)
app.get('/profile', verifyAccessToken, (req, res) => {
  res.json({ message: `Hello, ${req.payload.aud}` });
});

const port = process.env.PORT || 8080;

// app.use(function (req, res, next) {
//   req.io = io;
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });
//thêm api notify
// app.post('/notify', (req, res) => {
//   const { message, type } = req.body;

//   // Broadcast the notification to all clients
//   io.emit('receiveNotification', { message, type });
//   res.status(200).send({ status: 'Notification sent to all clients.' });
// });

//gửi feedback của khách hàng cho mail nhà khách
app.post('/send-feedback', async (req, res) => {
  const { hotelEmail, customerName, customerEmail, feedback } = req.body;

  // Validate từng trường
  if (!hotelEmail || typeof hotelEmail !== 'string' || !hotelEmail.includes('@')) {
    return res.status(400).send({ error: 'hotelEmail phải là một email hợp lệ.' });
  }
  if (!customerName || typeof customerName !== 'string' || customerName.length < 3 || customerName.length > 50) {
    return res.status(400).send({ error: 'Tên khách hàng phải từ 3 đến 50 ký tự.' });
  }
  if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.includes('@')) {
    return res.status(400).send({ error: 'customerEmail phải là một email hợp lệ.' });
  }
  if (!feedback || typeof feedback !== 'string' || feedback.length < 10 || feedback.length > 700) {
    return res.status(400).send({ error: 'Phản hồi phải từ 10 đến 500 ký tự.' });
  }
  if (!hotelEmail || !customerName || !customerEmail || !feedback) {
    return res.status(400).send({ error: 'Thiếu thông tin cần thiết' });
  }

  // Cấu hình transporter
  const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Không dùng SSL
      auth: {
          user: process.env.EMAIL_USER, // Email của bạn
          pass: process.env.EMAIL_PASS, // App Password
      },
  });

  // Tạo nội dung email
  const mailOptions = {
      from: '"Customer Feedback" <nhakhachhuongsen.business@gmail.com>',
      to: hotelEmail, // Email nhà khách nhận phản hồi
      subject: `Feedback từ ${customerName}`,
      html: `
          <p><strong>Phản Hồi Từ Khách Hàng:</strong></p>
          <p><strong>Tên:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Nội Dung Phản Hồi:</strong></p>
          <p>${feedback}</p>
      `,
  };

  try {
      await transporter.sendMail(mailOptions);
      res.status(200).send({ message: 'Phản hồi đã được gửi thành công!' });
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send({ error: 'Gửi email thất bại' });
  }
});

server.listen(port, async () => {
  connectDB();
  console.log(`Server is running on: http://localhost:${port}`);
});

export { server, io };
