import OrderRoomRepository from '../repositories/orderRoomRepository.js';
import RoomCategory from '../models/roomCategory.js';
import Customers from '../models/customer.js';
import Booking from '../models/booking.js';
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


export const generateExcel = async (req, res) => {
  try {
    console.log('Bắt đầu xuất file doanh thu');

    // Lấy dữ liệu từ DB
    const orderRooms = await OrderRoomRepository.findAll();

    if (!orderRooms || orderRooms.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
    }

    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // Tháng hiện tại (1-12)
    const year = currentDate.getFullYear(); // Năm hiện tại
    const daysInMonth = new Date(year, month, 0).getDate();

    const workbook = new ExcelJS.Workbook();

    // ====== Nhóm dữ liệu theo ngày ======
    const groupedByDay = {};
    orderRooms.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const day = orderDate.getDate();

      if (!groupedByDay[day]) groupedByDay[day] = [];
      groupedByDay[day].push(order);
    });

    let grandTotalRooms = 0;
    let grandTotalDebt = 0;
    let grandTotalPaid = 0;
    let grandTotalRevenue = 0;

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

        const dataRow = sheet.addRow([
          index + 1,
          order.roomCateId?.name || 'N/A',
          roomFee.toLocaleString(),
          extraFee.toLocaleString(),
          serviceFee.toLocaleString(),
          debt.toLocaleString(),
          paidAmount.toLocaleString(),
          order.receptionist || '',
          order.note || '',
        ]);
        applyBorderToRow(dataRow);
      });

      // ====== Dòng "Tổng" ======
      const totalRow = sheet.addRow([
        'Tổng:',
        '',
        totalRoomFee.toLocaleString(),
        totalExtraFee.toLocaleString(),
        totalServiceFee.toLocaleString(),
        totalDebt.toLocaleString(),
        totalPaid.toLocaleString(),
        '',
        '',
      ]);
      totalRow.font = { bold: true, size: 12 };
      totalRow.alignment = { horizontal: 'center', vertical: 'middle' };
      applyBorderToRow(totalRow);

      // ====== Dòng "Tổng doanh thu" ======
      const totalRevenue = totalRoomFee + totalExtraFee + totalServiceFee;
      const revenueRow = sheet.addRow([`Tổng doanh thu: ${totalRevenue.toLocaleString()}`]);
      revenueRow.font = { bold: true, size: 12 };
      applyBorderToRow(revenueRow);

      // ====== Dòng "Số phòng" và "Số đoàn" ======
      const statsRow = sheet.addRow(['Số phòng:', dayData.length]);
      const groupStatsRow = sheet.addRow(['Số đoàn:', 0]);
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
    }

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
      const dayDebt = dayData.reduce((sum, order) => sum + (order.debt || 0), 0);
      const dayPaid = dayData.reduce((sum, order) => sum + (order.paidAmount || 0), 0);
      const dayRevenue = dayData.reduce(
        (sum, order) => sum + ((order.quantity || 0) * (order.roomCateId?.price || 0)),
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
    const filePath = path.join(__dirname, '../exports', `Báo-cáo-doanh-thu-Tháng-${month}-${year}.xlsx`);

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