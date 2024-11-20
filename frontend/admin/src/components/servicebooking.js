import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServiceBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the service bookings when the component mounts
    const fetchServiceBookings = async () => {
      try {
        const response = await axios.get('http://localhost:9999/service-bookings'); // Replace with your API endpoint
        setBookings(response.data); // Assuming the API returns the bookings list in the response body
        setLoading(false);
      } catch (err) {
        setError('Error fetching service bookings');
        setLoading(false);
      }
    };

    fetchServiceBookings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2>Danh sách đặt dịch vụ khách hàng</h2>
      {bookings.length === 0 ? (
        <p>No service bookings found.</p>
      ) : (
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
            {bookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.bookingId}</td>
                <td>{booking.customerName}</td>
                <td>{booking.serviceName}</td>
                <td>{booking.unitPrice}</td>
                <td>{booking.quantity}</td>
                <td>{booking.status}</td>
                <td>{booking.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ServiceBookingList;
