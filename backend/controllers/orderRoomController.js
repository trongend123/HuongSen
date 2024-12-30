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
import OrderRoom from '../models/orderRoom.js';

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
      roomCategory: roomCategory.toObject(),
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
    const { locationId } = req.params;

    if (!locationId) {
      return res.status(400).json({ message: 'Vui lòng cung cấp locationId' });
    }
    console.log('Bắt đầu xuất file doanh thu');
    const orderRooms = await OrderRoom.find()
      .populate('roomCateId')   // Thông tin loại phòng
      .populate('customerId')   // Thông tin khách hàng
      .populate('bookingId');   // Thông tin booking

    const orderRoomFilter = orderRooms.filter((orderRoom) => {

      return orderRoom.roomCateId?.locationId.toString() === locationId
    })

    if (!orderRoomFilter || orderRoomFilter.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
    }

    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // Tháng hiện tại
    const year = currentDate.getFullYear(); // Năm hiện tại
    const workbook = new ExcelJS.Workbook();

    // Nhóm dữ liệu theo ngày
    const groupedByDay = {};
    const uniqueOrders = [];
    const seenOrderIds = new Set();

    orderRoomFilter.forEach((order) => {
      if (!seenOrderIds.has(order._id.toString())) {
        uniqueOrders.push(order);
        seenOrderIds.add(order._id.toString());
      }
    });

    uniqueOrders.forEach((order) => {
      const booking = order.bookingId;
      if (booking && booking.updatedAt) {
        const updatedDate = new Date(booking.updatedAt);

        // Lấy tháng và năm hiện tại
        const currentMonth = new Date().getMonth(); // Tháng hiện tại (0-11)
        const currentYear = new Date().getFullYear(); // Năm hiện tại

        // Kiểm tra nếu tháng và năm khớp
        if (updatedDate.getMonth() === currentMonth && updatedDate.getFullYear() === currentYear) {
          const formattedDate = updatedDate
            .toISOString()
            .slice(0, 10)
            .split('-')
            .reverse()
            .join('-'); // Chuyển thành dd-MM-yyyy

          if (!groupedByDay[formattedDate]) {
            groupedByDay[formattedDate] = [];
          }
          groupedByDay[formattedDate].push(order);
        }
      }
    });

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

    Object.keys(groupedByDay).forEach((formattedDate) => {
      const sheet = workbook.addWorksheet(`Ngày ${formattedDate}`);
      sheet.mergeCells('A1:I1');
      sheet.getCell('A1').value = `BẢNG KÊ DOANH THU`;
      sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getCell('A1').font = { bold: true, size: 16 };

      sheet.mergeCells('A2:I2');
      sheet.getCell('A2').value = `NGÀY ${formattedDate}`;
      sheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
      sheet.getCell('A2').font = { bold: true, size: 12 };

      sheet.addRow([
        'STT',
        'Mã đơn',
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

      const dayData = groupedByDay[formattedDate];
      let totalRoomFee = 0;
      let totalQuantity = 0;

      dayData.forEach((order, index) => {
        const bookingId = order.bookingId?._id;
        const roomCategory = order.roomCateId;
        const roomFee = order.roomCateId?.price || 0;
        const quantity = order?.quantity || 1;
        const itemTotal = roomFee * quantity;

        totalRoomFee += itemTotal;
        totalQuantity += quantity;

        const dataRow = sheet.addRow([
          index + 1,
          bookingId,
          roomCategory?.name || 'N/A',
          roomFee.toLocaleString(),
          quantity,
          itemTotal.toLocaleString(),
          '',
          '',
          '',
          '',
          '',
          '',
        ]);
        applyBorderToRow(dataRow);
      });

      const totalRow = sheet.addRow([
        'Tổng:',
        '',
        '',
        '',
        '',
        totalRoomFee.toLocaleString(),
        '',
        '',
        '',
        '',
      ]);
      totalRow.font = { bold: true, size: 12 };
      applyBorderToRow(totalRow);

      // Dòng "Tổng doanh thu"
      const revenueRow = sheet.addRow([
        'Tổng doanh thu:',
        { formula: 'SUM( F:F, G:G, H:H)' },
      ]);
      revenueRow.font = { bold: true, size: 12 };
      applyBorderToRow(revenueRow);

      // Dòng "Số phòng" và "Số đoàn"
      const statsRow = sheet.addRow(['Số phòng:', totalQuantity.toLocaleString()]);
      const groupStatsRow = sheet.addRow(['Số đoàn:', '']);
      statsRow.font = groupStatsRow.font = { bold: true, size: 12 };
      applyBorderToRow(statsRow);
      applyBorderToRow(groupStatsRow);

      sheet.columns.forEach((column) => {
        column.width = 30;
      });
      sheet.eachRow((row) => {
        row.height = 25;
      });
    });

    // Tạo sheet tổng doanh thu
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
      const dayData = groupedByDay[day] || [];
      const dayRooms = dayData.length;
      const dayDebt = dayData.reduce((sum, room) => sum + (room.bookingId?.price - room.bookingId?.payment || 0), 0);
      const dayPaid = dayData.reduce((sum, room) => sum + (room.bookingId?.payment || 0), 0);
      const dayRevenue = dayData.reduce((sum, room) => sum + (room.roomCateId?.price || 0), 0);

      const summaryRow = summarySheet.addRow([
        index + 1,
        `${day}/${month}/${year}`,
        dayRooms,
        dayDebt.toLocaleString(),
        dayPaid.toLocaleString(),
        dayRevenue.toLocaleString(),
      ]);
      applyBorderToRow(summaryRow);
    });

    summarySheet.columns.forEach((column) => {
      column.width = 20;
    });
    summarySheet.eachRow((row) => {
      row.height = 25;
    });

    const filePath = path.join(__dirname, '../exports', `Bao-cao-doanh-thu-Thang-${month}-${year}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Bao-cao-doanh-thu-Thang-${month}-${year}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
    console.log('File Excel đã được gửi tới client.');
  } catch (error) {
    console.error('Lỗi khi tạo file Excel:', error);
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
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