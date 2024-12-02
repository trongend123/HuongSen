import OrderRoomRepository from '../repositories/orderRoomRepository.js';
import RoomCategory from '../models/roomCategory.js';
import RoomRepository from '../repositories/room.js';
import Customers from '../models/customer.js';
import Booking from '../models/booking.js';
import Room from '../models/room.js';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';

// Hàm tạo OrderRoom mới
export const createOrderRoom = async (req, res) => {
  try {
    const { roomCateId, customerId, bookingId, quantity, receiveRoom,
      returnRoom } = req.body;

    // Kiểm tra sự tồn tại của RoomCategory
    const roomCategory = await RoomCategory.findById(roomCateId);
    if (!roomCategory) {
      return res.status(404).json({ message: 'RoomCategory không tồn tại' });
    }

    // Kiểm tra sự tồn tại của Customer
    const customer = await Customers.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer không tồn tại' });
    }

    // Kiểm tra sự tồn tại của Booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking không tồn tại' });
    }

    // Tạo OrderRoom mới
    const newOrderRoom = await OrderRoomRepository.create({
      roomCateId,
      customerId,
      bookingId,
      quantity,
      receiveRoom,
      returnRoom
    });

    res.status(201).json(newOrderRoom);
  } catch (error) {
    console.error('Lỗi khi tạo OrderRoom:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Hàm lấy tất cả OrderRooms với phân trang
export const getAllOrderRoomsbyPage = async (req, res) => {
  try {
    const orderRooms = await OrderRoomRepository.findAll();
    res.status(200).json(orderRooms);
  } catch (error) {
    console.error('Lỗi khi lấy OrderRooms:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
//lấy hết
export const getAllOrderRooms = async (req, res) => {
  try {
    const orderRoom = await OrderRoomRepository.findAll();
    if (!orderRoom) {
      return res.status(404).json({ message: 'OrderRoom không tồn tại' });
    }
    res.status(200).json(orderRoom);
  } catch (error) {
    console.error('Lỗi khi lấy OrderRoom:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


//getAll xong thêm danh sách vào file excel
// Định nghĩa __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllOrderRoomsByExcel = async (req, res) => {
  try {
    console.log('Bắt đầu xuất file doanh thu');
    // Lấy dữ liệu từ DB
    const rooms = await Room.find()
      .populate('roomCategoryId') // Lấy thông tin loại phòng (RoomCategories)
      .populate('bookingId'); // Lấy thông tin booking (Bookings)
    console.log('data rooms: ', rooms);

    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
    }

    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // Tháng hiện tại (1-12)
    const year = currentDate.getFullYear(); // Năm hiện tại
    const daysInMonth = new Date(year, month, 0).getDate();
    const workbook = new ExcelJS.Workbook();

    // ====== Nhóm dữ liệu theo ngày ======
    const groupedByDay = {};
    rooms.forEach((room) => {
      const booking = room.bookingId; // Lấy thông tin đặt phòng
      console.log('Booking data:', booking);

      // Kiểm tra có tồn tại booking và checkin không
      if (booking && booking.checkin) {
        const orderDate = new Date(booking.checkin); // Kiểm tra bookingId có tồn tại và có checkin
        const day = orderDate.getDate();

        if (!groupedByDay[day]) groupedByDay[day] = [];
        groupedByDay[day].push(room);
      }
    });

    // ====== Hàm áp dụng đường viền ======
    const applyBorderToRow = (row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    };

    // ====== Tạo sheet chi tiết từng ngày ======
    for (let day = 1; day <= daysInMonth; day++) {
      const sheet = workbook.addWorksheet(`Ngày ${day}.${month}`);

      // ====== Tiêu đề ======
      sheet.mergeCells('A1:I1');
      sheet.getCell('A1').value = `BẢNG KÊ DOANH THU`;
      sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getCell('A1').font = { bold: true, size: 16 };

      sheet.mergeCells('A2:I2');
      sheet.getCell('A2').value = `NGÀY ${day}/${month}/${year}`;
      sheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getCell('A2').font = { bold: true, size: 12 };

      // ====== Header ======
      sheet.addRow([
        'STT',
        'Phòng',
        'Đơn giá',
        'Số lượng',
        'Tiền phòng',
        'Thêm h+ Nghỉ h',
        'Dịch Vụ',
        'Nợ',
        'Đã TT',
        'Lễ Tân thu',
        'Ghi chú',
      ]);
      const headerRow = sheet.getRow(3);
      headerRow.font = { bold: true, size: 12 };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
      applyBorderToRow(headerRow);

      // ====== Dữ liệu ======
      const dayData = groupedByDay[day] || [];
      let totalRoomFee = 0;
      let totalExtraFee = 0;
      let totalServiceFee = 0;
      let totalDebt = 0;
      let totalPaid = 0;

      let totalQuantity = 0;
      let totalPrice = 0;
      let totalPriceString = 0;
      let totalQuantityString = 0;
      const quantities = [];
      const calculatedData = []; // Lưu thông tin tạm từ orderRooms

      const orderRooms = await OrderRoomRepository.findAll();
      orderRooms.forEach((orderRoom) => {
        const quantity = orderRoom.quantity;
        console.log('quantity: ', quantity);
        //const itemTotal = price * quantity; // Tổng tiền từng phòng
        calculatedData.push({
          quantity,
          //itemTotal,
        });
        quantities.push(quantity); // Lữa dữ liệu với mảng quantities
      });
      console.log('quantities: ', quantities);
      dayData.forEach((room, index) => {
        console.log(`Processing room ${index + 1}:`, room);
        console.log('Room category name: ', room.roomCategoryId?.name);
        const data = calculatedData[index] || {}; // Lấy dữ liệu từ mảng tạm
        const { quantity } = data;
        const booking = room.bookingId;
        const roomCategory = room.roomCategoryId;
        const roomFee = roomCategory?.price || 0; // Giá phòng từ RoomCategory
        const itemTotal = roomFee * quantity;
        console.log('itemTotal: ', itemTotal);
        //const extraFee = booking?.payment - roomFee || 0; // Giả sử extra fee là phần còn lại sau khi trừ tiền phòng
        const extraFee = 0;
        const serviceFee = 0; // Giả sử không có dịch vụ riêng (có thể thêm nếu cần)
        const debt = booking?.price - booking?.payment || 0; // Nợ từ booking
        //const paidAmount = booking?.payment || 0;
        const paidAmount = 0;


        dayData.forEach((order, index) => {
          const roomFee = order.roomCateId?.price || 0;
          const extraFee = order.extraHoursFee || 0;
          const serviceFee = order.serviceFee || 0;
          const debt = order.debt || 0;
          const paidAmount = order.paidAmount || 0;

          totalRoomFee += roomFee;
          totalExtraFee += extraFee;
          totalServiceFee += serviceFee;
          totalDebt += debt;
          totalPaid += paidAmount;

          totalPrice += itemTotal;
          totalQuantityString += quantity;
          const totalFee = totalQuantity * totalPrice;
          totalPriceString += totalFee;

          const dataRow = sheet.addRow([
            index + 1,
            roomCategory?.name || 'N/A', // Tên loại phòng
            roomCategory?.price.toLocaleString(),
            quantity ? quantity.toLocaleString() : 'N/A', // Số lượng từng phòng
            itemTotal.toLocaleString(), // Tổng tiền phòng
            '',
            //extraFee.toLocaleString(),
            '',
            //serviceFee.toLocaleString(),
            '',
            //debt.toLocaleString(),
            '',
            //paidAmount.toLocaleString(),
            '',
            //booking?.staffId || '',
            '',
            //booking?.note || '',
            '',
          ]);
          applyBorderToRow(dataRow);
        });

        //console.log('totalQuantityString: ', totalQuantityString);
        // ====== Dòng "Tổng" ======
        const totalRow = sheet.addRow([
          'Tổng:',
          '',
          //totalPrice.toLocaleString(),
          '',
          //totalQuantityString.toLocaleString(),
          '',
          totalPrice.toLocaleString(),
          //totalPriceString.toLocaleString(),
          '',
          //totalExtraFee.toLocaleString(),
          //totalServiceFee.toLocaleString(),
          //totalDebt.toLocaleString(),
          //totalPaid.toLocaleString(),
          '',
          '',
          '',
          '',
          '',
          '',
        ]);
        totalRow.font = { bold: true, size: 12 };
        totalRow.alignment = { horizontal: 'center', vertical: 'middle' };
        applyBorderToRow(totalRow);

        // ====== Dòng "Tổng doanh thu" ======
        // const totalRevenue = totalPrice + totalExtraFee + totalServiceFee;
        // const revenueRow = sheet.addRow([`Tổng doanh thu: ${totalRevenue.toLocaleString()}`]);
        const revenueRow = sheet.addRow([
          'Tổng doanh thu:',
          //{ formula: 'SUM(E4:E1000, F4:F1000, G4:G1000)' }, // Công thức Excel tính tổng
          { formula: 'SUM(E:E, F:F, G:G)' }
        ]);
        revenueRow.font = { bold: true, size: 12 };
        applyBorderToRow(revenueRow);

        // ====== Dòng "Số phòng" và "Số đoàn" ======
        const statsRow = sheet.addRow(['Số phòng:', totalQuantityString.toLocaleString()]);
        const groupStatsRow = sheet.addRow(['Số đoàn:', '']); // Số đoàn có thể được tính theo logic của bạn
        statsRow.font = groupStatsRow.font = { bold: true, size: 12 };
        applyBorderToRow(statsRow);
        applyBorderToRow(groupStatsRow);

        // ====== Định dạng chiều rộng và chiều cao ======
        sheet.columns.forEach((column) => {
          column.width = 20;
        });
        sheet.eachRow((row) => {
          row.height = 25;
        });
      },);

      // ====== Tạo sheet tổng doanh thu ======
      const summarySheet = workbook.addWorksheet('Tổng Doanh Thu');
      summarySheet.mergeCells('A1:F1');
      summarySheet.getCell('A1').value = `BẢNG KÊ DOANH THU`;
      summarySheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      summarySheet.getCell('A1').font = { bold: true, size: 16 };

      summarySheet.mergeCells('A2:F2');
      summarySheet.getCell('A2').value = `THÁNG ${month}/${year}`;
      summarySheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
      summarySheet.getCell('A2').font = { bold: true, size: 12 };

      summarySheet.addRow(['STT', 'Ngày', 'Số lượng phòng', 'Tổng nợ', 'Đã thanh toán', 'Tổng doanh thu']);
      const summaryHeaderRow = summarySheet.getRow(3);
      summaryHeaderRow.font = { bold: true, size: 12 };
      applyBorderToRow(summaryHeaderRow);

      Object.keys(groupedByDay).forEach((day, index) => {
        const dayData = groupedByDay[day];
        const dayRooms = dayData.length;
        const dayDebt = dayData.reduce((sum, room) => sum + (room.bookingId?.price - room.bookingId?.payment || 0), 0);
        const dayPaid = dayData.reduce((sum, room) => sum + (room.bookingId?.payment || 0), 0);
        const dayRevenue = dayData.reduce(
          (sum, room) => sum + (room.roomCategoryId?.price || 0),
          0
        );

        const summaryRow = summarySheet.addRow([
          index + 1,
          `${day}/${month}/${year}`,
          dayRooms,
          dayDebt,
          dayPaid,
          dayRevenue,
        ]);
        applyBorderToRow(summaryRow);
      });

      summarySheet.columns.forEach((column) => {
        column.width = 20;
      });
      summarySheet.eachRow((row) => {
        row.height = 25;
      });

      // ====== Lưu file ======
      const filePath = path.join(__dirname, '../exports', `Bao-cao-doanh-thu-Thang-${month}-${year}.xlsx`);

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath); // Xóa file cũ nếu tồn tại
        } catch (error) {
          console.error('File đang được mở hoặc sử dụng bởi chương trình khác.');
          return res.status(400).json({
            message: `Không thể ghi đè file. Vui lòng đóng file: Báo-cáo-doanh-thu-Tháng-${month}-${year}.xlsx và thử lại.`,
          });
        }
      }

      await workbook.xlsx.writeFile(filePath);
      console.log('File Excel đã được tạo:', filePath);
      res.status(200).json({ message: 'Xuất file thành công', filePath });
    }
  } catch (error) {
    console.error('Lỗi khi tạo file Excel:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};


// Hàm lấy OrderRoom theo ID
export const getOrderRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderRoom = await OrderRoomRepository.findById(id);
    if (!orderRoom) {
      return res.status(404).json({ message: 'OrderRoom không tồn tại' });
    }
    res.status(200).json(orderRoom);
  } catch (error) {
    console.error('Lỗi khi lấy OrderRoom:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Hàm lấy OrderRooms theo bookingId
export const getOrderRoomsByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const orderRooms = await OrderRoomRepository.findByBookingId(bookingId);
    if (!orderRooms.length) {
      return res.status(404).json({ message: 'Không có OrderRoom nào cho BookingId này' });
    }
    res.status(200).json(orderRooms);
  } catch (error) {
    console.error('Lỗi khi lấy OrderRoom theo BookingId:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Hàm cập nhật OrderRoom
export const updateOrderRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Nếu cập nhật các trường tham chiếu, kiểm tra sự tồn tại
    if (updateData.roomCateId) {
      const roomCategory = await RoomCategory.findById(updateData.roomCateId);
      if (!roomCategory) {
        return res.status(404).json({ message: 'RoomCategory không tồn tại' });
      }
    }

    if (updateData.customerId) {
      const customer = await Customers.findById(updateData.customerId);
      if (!customer) {
        return res.status(404).json({ message: 'Customer không tồn tại' });
      }
    }

    if (updateData.bookingId) {
      const booking = await Booking.findById(updateData.bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking không tồn tại' });
      }
    }

    const updatedOrderRoom = await OrderRoomRepository.update(id, updateData);

    if (!updatedOrderRoom) {
      return res.status(404).json({ message: 'OrderRoom không tồn tại' });
    }

    res.status(200).json(updatedOrderRoom);
  } catch (error) {
    console.error('Lỗi khi cập nhật OrderRoom:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Hàm xóa OrderRoom
export const deleteOrderRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrderRoom = await OrderRoomRepository.remove(id);

    if (!deletedOrderRoom) {
      return res.status(404).json({ message: 'OrderRoom không tồn tại' });
    }

    res.status(200).json({ message: 'OrderRoom đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa OrderRoom:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Hàm lấy tổng số phòng theo loại phòng trong khoảng thời gian
export const getTotalRoomsByCategoryInDateRange = async (req, res) => {
  try {
    const { checkInDate, checkOutDate } = req.query;


    // Gọi đến repository để lấy tổng số phòng theo loại trong khoảng thời gian
    const totalRoomsByCategory = await OrderRoomRepository.getTotalByCategoryInDateRange(checkInDate, checkOutDate);

    res.status(200).json(totalRoomsByCategory);
  } catch (error) {
    console.error('Lỗi khi lấy tổng số phòng theo loại phòng:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};