import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServiceBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchBookingId, setSearchBookingId] = useState('');
  const [searchCustomerName, setSearchCustomerName] = useState('');
  const [searchServiceName, setSearchServiceName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    const fetchServiceBookings = async () => {
      try {
        const response = await axios.get('http://localhost:9999/service-bookings');
        setBookings(response.data || []);
        setFilteredBookings(response.data || []);
        setLoading(false);
      } catch (err) {
        setError('Error fetching service bookings');
        setBookings([]);
        setFilteredBookings([]);
        setLoading(false);
      }
    };

    fetchServiceBookings();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = bookings.filter((booking) => {
      const matchesBookingId = booking.bookingId.toString().includes(searchBookingId);
      const matchesCustomerName = booking.customerName
        .toLowerCase()
        .includes(searchCustomerName.toLowerCase());
      const matchesServiceName = booking.serviceName
        .toLowerCase()
        .includes(searchServiceName.toLowerCase());
      const matchesStartTime =
        !startTime || new Date(booking.time) >= new Date(startTime);

      return (
        matchesBookingId &&
        matchesCustomerName &&
        matchesServiceName &&
        matchesStartTime 
      );
    });

    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  }, [searchBookingId, searchCustomerName, searchServiceName, startTime, endTime, bookings]);
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.put('http://localhost:9999/service-bookings/${bookingId}', {
        status: newStatus,
      });
      const updatedBookings = bookings.map((booking) =>
        booking.bookingId === bookingId ? { ...booking, status: newStatus } : booking
      );
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings); // Update the filtered list to reflect the changes
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status. Please try again.');
    }
  };
  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredBookings.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);

  // Format date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('vi-VN', options).format(new Date(date));
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2 className='text-center'>Danh sách đặt dịch vụ khách hàng</h2>
      <br/>

      {/* Search Fields */}
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm Booking ID"
            value={searchBookingId}
            onChange={(e) => setSearchBookingId(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm Tên Khách Hàng"
            value={searchCustomerName}
            onChange={(e) => setSearchCustomerName(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm Tên Dịch Vụ"
            value={searchServiceName}
            onChange={(e) => setSearchServiceName(e.target.value)}
          />
          </div>
          <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            placeholder="Ngày sử dụng"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          </div>
        
      </div>
      {currentRows.length === 0 ? (
        <p>No service bookings found.</p>
      ) : (
        <div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Tên khách hàng</th>
                <th>Tên dịch vụ</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
                <th>Thời gian</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.serviceName}</td>
                  <td>{formatCurrency(booking.unitPrice)}</td>
                  <td className="text-center">{booking.quantity}</td>
                  <td>{formatCurrency(booking.unitPrice * booking.quantity)}</td>
                  <td>{formatDate(booking.time)}</td>
                  <td>
                    <select
                      className="form-select"
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.bookingId, e.target.value)}
                    >
                      <option value="Đã đặt">Đã đặt</option>
                      <option value="Đang sử dụng">Đang sử dụng</option>
                      <option value="Đã cung cấp">Đã cung cấp</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </td>
                  <td>{booking.note}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ServiceBookingList;