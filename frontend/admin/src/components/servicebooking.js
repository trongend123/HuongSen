import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServiceBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchBookingId, setSearchBookingId] = useState('');
  const [searchCustomerName, setSearchCustomerName] = useState('');
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
    const filtered = bookings.filter(
      (booking) =>
        booking.bookingId.toString().includes(searchBookingId) &&
        booking.customerName.toLowerCase().includes(searchCustomerName.toLowerCase())
    );
    setFilteredBookings(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  }, [searchBookingId, searchCustomerName, bookings]);

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredBookings.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);

  // Update status in the database
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.put(`http://localhost:9999/service-bookings/${bookingId}`, {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2>Danh sách đặt dịch vụ khách hàng</h2>

      {/* Search Fields */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm Booking ID"
            value={searchBookingId}
            onChange={(e) => setSearchBookingId(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm Tên Khách Hàng"
            value={searchCustomerName}
            onChange={(e) => setSearchCustomerName(e.target.value)}
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
                <th>Booking ID</th>
                <th>Customer Name</th>
                <th>Service Name</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.serviceName}</td>
                  <td>{booking.unitPrice}</td>
                  <td>{booking.quantity}</td>
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
