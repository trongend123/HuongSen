import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./bookingDetails.css";
import { Col, Container, Row, Button } from 'react-bootstrap';
import { format } from 'date-fns';
import AddServiceForm from './bookingRoom/addServiceForm';

const BookingDetails = () => {
    const { bookingId } = useParams();
    const [orderRooms, setOrderRooms] = useState([]);
    const [Rooms, setRooms] = useState([]);
    const [orderServices, setOrderServices] = useState([]);
    const [location, setLocation] = useState({});
    const [Agency, setAgency] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [expandedNotes, setExpandedNotes] = useState({}); // Trạng thái để lưu ghi chú được mở rộng
    const addServiceRef = useRef(null);
    const [newBookingPrice, setNewBookingPrice] = useState(0);


    // Lấy thông tin đặt phòng
    const fetchBookingDetails = async () => {
        try {
            const [orderRoomsResponse, orderServiceResponse, roomsResponse] = await Promise.all([
                axios.get(`http://localhost:9999/orderRooms/booking/${bookingId}`),
                axios.get(`http://localhost:9999/orderServices/booking/${bookingId}`),
                axios.get(`http://localhost:9999/rooms/booking/${bookingId}`)
            ]);
            setOrderRooms(orderRoomsResponse.data);
            setOrderServices(orderServiceResponse.data);
            setRooms(roomsResponse.data.rooms);
        } catch (error) {
            console.error('Error fetching booking details:', error);
        }
    };

    // Lấy thông tin vị trí từ ID phòng
    const fetchLocationAndAgency = async (roomCateId, customerId) => {
        try {
            const locationsResponse = await axios.get(`http://localhost:9999/roomCategories/${roomCateId}`);
            setLocation(locationsResponse.data.locationId);
            const AgencyResponse = await axios.get(`http://localhost:9999/agencies/customer/${customerId}`);
            setAgency(AgencyResponse.data);
        } catch (error) {
            console.error('Error fetching location or agencies details:', error);
        }
    };

    // Gọi API khi trang được tải
    useEffect(() => {
        fetchBookingDetails();
    }, [bookingId]);

    // Cập nhật vị trí khi có thay đổi về phòng
    useEffect(() => {
        if (orderRooms.length > 0) {
            const { roomCateId, customerId } = orderRooms[0];
            if (roomCateId) {
                fetchLocationAndAgency(roomCateId._id, customerId._id);
            }
        }
    }, [orderRooms]);

    // Hàm xử lý khi click vào nút "Xem thêm"
    const toggleNote = (id) => {
        setExpandedNotes((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Hàm để hiển thị nội dung ghi chú
    const renderNote = (note, id) => {
        if (!note) return 'N/A';
        const isExpanded = expandedNotes[id];
        const shortNote = note.length > 100 ? `${note.substring(0, 100)}...` : note;
        return (
            <>
                {isExpanded ? note : shortNote}
                {note.length > 100 && (
                    <button
                        onClick={() => toggleNote(id)}
                        style={{
                            marginLeft: '10px',
                            background: 'none',
                            border: 'none',
                            color: '#007bff',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}
                    >
                        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                    </button>
                )}
            </>
        );
    };
    // Handler for service total changes
    const handleServiceTotalChange = (total) => {
        setNewBookingPrice(total + orderRooms[0].bookingId?.price || 0);
    };
    // Hàm cập nhật thông tin dịch vụ và giá booking
    const handleUpdateBooking = async () => {
        setIsUpdating(true);
        try {
            await addServiceRef.current.addService(bookingId);
            const updatedBookingData = {
                price: newBookingPrice || orderRooms[0].bookingId.price, // Cập nhật giá nếu có thay đổi
            };

            // Cập nhật giá booking và dịch vụ
            await axios.put(`http://localhost:9999/bookings/${bookingId}`, updatedBookingData);
            alert('Thông tin dịch vụ và giá booking đã được cập nhật.');
            fetchBookingDetails(); // Tải lại thông tin booking sau khi cập nhật
        } catch (error) {
            console.error('Error updating booking data:', error);
            alert('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
        } finally {
            setIsUpdating(false);
        }
    }

    // Xử lý check-out
    const handleCheckout = async () => {
        setIsUpdating(true);
        try {
            await axios.put(`http://localhost:9999/bookings/${bookingId}`, { status: 'Đã hoàn thành' });

            // Cập nhật trạng thái booking
            setOrderRooms((prevOrderRooms) =>
                prevOrderRooms.map((orderRoom) => ({
                    ...orderRoom,
                    bookingId: { ...orderRoom.bookingId, status: 'Đã hoàn thành' },
                }))
            );
            alert('Trạng thái đã được cập nhật thành "Đã hoàn thành".');
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (orderRooms.length === 0) {
        return <div>Loading...</div>;
    }
    // Xử lý hủy
    const handleCancelService = async (deleteService, price) => {
        const checkinDate = new Date(deleteService?.time);
        const currentDate = new Date();
        const daysBeforeCheckin = Math.floor((checkinDate - currentDate) / (1000 * 3600 * 24));

        // Kiểm tra nếu dịch vụ được hủy trước ngày check-in 2 ngày
        if (daysBeforeCheckin >= 2) {
            // Xóa dịch vụ khỏi danh sách
            const updatedServices = orderServices.filter((service) => service._id !== deleteService._id);
            setOrderServices(updatedServices); // Cập nhật lại danh sách dịch vụ đã đặt

            // Cập nhật lại giá booking sau khi xóa dịch vụ
            setNewBookingPrice((prevPrice) => prevPrice - price);

            // Gửi yêu cầu xóa dịch vụ từ cơ sở dữ liệu
            try {
                await axios.delete(`http://localhost:9999/orderServices/${deleteService._id}`);

                // Cập nhật lại booking với dịch vụ đã xóa
                const updatedBookingData = {
                    price: orderRooms[0].bookingId.price - price || newBookingPrice,
                };
                await axios.put(`http://localhost:9999/bookings/${bookingId}`, updatedBookingData);


                fetchBookingDetails(); // Tải lại thông tin booking sau khi cập nhật
                alert('Dịch vụ đã được xóa thành công và giá booking đã được cập nhật.');
            } catch (error) {
                console.error('Error canceling service:', error);
                alert('Có lỗi xảy ra khi xóa dịch vụ. Vui lòng thử lại.');
            }
        } else {
            alert('Dịch vụ chỉ có thể hủy trước ngày sử dụng dịch vụ 2 ngày.');
        }
    };
    const handleCancelRoom = async (OrderRoom) => {

        const checkinDate = new Date(OrderRoom.bookingId?.checkin);
        const checkoutDate = new Date(OrderRoom.bookingId?.checkout);
        const currentDate = new Date();
        const daysBeforeCheckin = Math.floor((checkinDate - currentDate) / (1000 * 3600 * 24));
        const night = Math.floor((checkoutDate - checkinDate) / (1000 * 3600 * 24));

        const price = OrderRoom.roomCateId.price * OrderRoom.quantity * night;

        // Kiểm tra nếu phòng được hủy trước ngày check-in 2 ngày
        if (daysBeforeCheckin >= 2 && orderRooms.length > 1) {
            if (window.confirm('Bạn có chắc muốn hủy phòng này không?')) {
                // Xóa phòng khỏi danh sách
                const updatedRooms = orderRooms.filter((room) => room._id !== OrderRoom._id);
                setOrderRooms(updatedRooms); // Cập nhật lại danh sách phòng đã đặt

                // Cập nhật lại giá booking sau khi xóa phòng
                setNewBookingPrice((prevPrice) => prevPrice - price);

                // Gửi yêu cầu xóa phòng từ cơ sở dữ liệu
                try {
                    // Gửi yêu cầu API để hủy phòng
                    await axios.delete(`http://localhost:9999/orderRooms/${OrderRoom._id}`)

                    // Cập nhật lại booking với Room đã xóa
                    const updatedBookingData = {
                        price: OrderRoom.bookingId.price - price || newBookingPrice,
                    };
                    await axios.put(`http://localhost:9999/bookings/${bookingId}`, updatedBookingData);

                    fetchBookingDetails(); // Tải lại thông tin booking sau khi cập nhật
                    alert('Phòng  đã được xóa thành công và giá booking đã được cập nhật.');
                } catch (error) {
                    console.error('Lỗi khi hủy phòng:', error);
                    alert('Không thể hủy phòng. Vui lòng thử lại!');
                }
            };
        } else {
            if (orderRooms.length === 1) { alert('Phòng chỉ có thể hủy Khi còn trên 1 phòng.'); }
            else { alert('Phòng chỉ có thể hủy trước ngày check in 2 ngày.') };
        }
    }
    const handleReceiveAndReturnRoom = async (Room) => {

    }

    return (
        <div className="booking-details">
            <h2>Thông tin Đặt phòng</h2>
            <h3>Mã Đặt phòng: {orderRooms[0].bookingId?._id || 'N/A'} - Mã hợp đồng: {orderRooms[0].bookingId?.contract || 'N/A'}</h3>
            <Row className="customer-info">
                <h4>Thông tin Khách hàng</h4>
                <Col>
                    <p><strong>Họ và tên:</strong> {orderRooms[0].customerId?.fullname || 'N/A'}</p>
                    <p><strong>Email:</strong> {orderRooms[0].customerId?.email || 'N/A'}</p>
                    <p><strong>Số điện thoại:</strong> {orderRooms[0].customerId?.phone || 'N/A'}</p>
                    <p><strong>Check-in:</strong> {format(new Date(orderRooms[0].bookingId?.checkin), 'dd-MM-yyyy')}</p>
                    <p><strong>Check-out:</strong> {format(new Date(orderRooms[0].bookingId?.checkout), 'dd-MM-yyyy')}</p>
                </Col>
                {/* Hiển thị thông tin Agency */}
                {Agency && (
                    <Col className="agency-details">
                        <p><strong>Mã quân nhân:</strong> {Agency.code}</p>
                        <p><strong>Tên đơn vị:</strong> {Agency.name}</p>
                        <p><strong>SĐT đơn vị:</strong> {Agency.phone}</p>
                        <p><strong>Vị trí đơn vị:</strong> {Agency.address}</p>
                        <p><strong>Bank + STK:</strong> {Agency.stk}</p>
                    </Col>
                )}
                <Col>
                    <p><strong>Ngày tạo đơn:</strong> {format(new Date(orderRooms[0].createdAt), 'dd-MM-yyyy')}</p>
                    <p><strong>Tổng giá:</strong> {orderRooms[0].bookingId?.price ? `${orderRooms[0].bookingId.price} VND` : 'N/A'}</p>
                    <p><strong>Trạng thái:</strong> {orderRooms[0].bookingId?.status || 'N/A'}</p>
                    <p><strong>Thanh toán:</strong> {orderRooms[0].bookingId?.payment || 'N/A'}</p>
                </Col>

            </Row>



            <section className="room-details">
                <h3>Thông tin Phòng</h3>
                <table>
                    <thead>
                        <tr>
                            {(orderRooms[0]?.bookingId?.status === 'Đã check-in' || orderRooms[0]?.bookingId?.status === 'Đã hoàn thành') && <th>Số Phòng</th>}
                            <th>Tên phòng</th>
                            <th>Giá (VND)</th>
                            <th>Vị trí</th>
                            {(orderRooms[0]?.bookingId?.status !== 'Đã check-in' && orderRooms[0]?.bookingId?.status !== 'Đã hoàn thành') && <th>Số lượng</th>}
                            {Agency && (orderRooms[0]?.bookingId?.status === 'Đã check-in' || orderRooms[0]?.bookingId?.status === 'Đã đặt') && <th>Thao tác</th>} {/* Chỉ hiển thị cột này nếu có Agency */}
                        </tr>
                    </thead>
                    {(orderRooms[0]?.bookingId?.status === 'Đã check-in' || orderRooms[0]?.bookingId?.status === 'Đã hoàn thành') ?
                        (<tbody>
                            {Rooms.map((room) => (
                                <tr key={room._id}>
                                    <td>{room?.code || 'N/A'}</td>
                                    <td>{room.roomCategoryId?.name || 'N/A'}</td>
                                    <td>{room.roomCategoryId?.price ? ` ${room.roomCategoryId.price} VND` : 'N/A'}</td>
                                    <td>{location?.name || 'N/A'}</td>
                                    {Agency && (
                                        orderRooms[0]?.bookingId?.status === 'Đã check-in' &&
                                        (<td>
                                            <button
                                                onClick={() => handleReceiveAndReturnRoom(room)}
                                            >
                                                Nhận phòng
                                            </button>
                                            <button
                                                onClick={() => handleReceiveAndReturnRoom(room)}
                                            >
                                                Trả phòng
                                            </button>
                                        </td>)
                                    )}

                                </tr>
                            ))}
                        </tbody>
                        ) : (
                            <tbody>
                                {orderRooms.map((orderRoom) => (
                                    <tr key={orderRoom._id}>
                                        <td>{orderRoom.roomCateId?.name || 'N/A'}</td>
                                        <td>{orderRoom.roomCateId?.price ? `${orderRoom.roomCateId.price} VND ` : 'N/A'}</td>
                                        <td>{location?.name || 'N/A'}</td>
                                        <td>{orderRoom.quantity || 'N/A'}</td>
                                        {Agency && (
                                            <td>
                                                <button
                                                    className="cancel-room-btn"
                                                    onClick={() => handleCancelRoom(orderRoom)}
                                                >
                                                    Hủy phòng
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        )
                    }
                </table>
            </section>

            <section className="booking-info">
                <p><strong>Ghi chú:</strong> {renderNote(orderRooms[0].bookingId?.note) || 'N/A'}</p>
            </section>
            <section className="service-details">
                <h3>Dịch vụ Đã đặt</h3>
                {orderServices.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Tên dịch vụ</th>
                                <th>Giá (VND)</th>
                                <th>Số lượng</th>
                                <th>Ngày sử dụng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderServices.map((service) => (
                                <React.Fragment key={service._id}>
                                    <tr>
                                        <td>{service?.otherServiceId.name || "N/A"}</td>
                                        <td>{service.otherServiceId?.price || "N/A"}</td>
                                        <td>{service?.quantity || "N/A"}</td>
                                        <td>
                                            {(() => {
                                                const date = service.time;
                                                const formattedDate = date.replace('T', ',').split('.')[0]; // Loại bỏ phần milliseconds và thay T bằng ,
                                                const [datePart, timePart] = formattedDate.split(',');
                                                const [year, month, day] = datePart.split('-');
                                                return `${day}-${month}-${year}, ${timePart.slice(0, 5)}`; // Cắt giờ phút từ timePart
                                            })()}
                                        </td>

                                        <td>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleCancelService(service, (service.otherServiceId.price * service.quantity))}
                                            >
                                                Hủy Dịch Vụ
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="5">
                                            <strong>Ghi chú:</strong> {renderNote(service?.note, service._id)}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <h3 className='text-success'>Khách hàng chưa đặt dịch vụ nào.</h3>
                )}
            </section>

            {/* Service Form */}
            {(orderRooms[0].bookingId?.status === 'Đã check-in' || orderRooms[0].bookingId?.status === 'Đã đặt') && (
                <AddServiceForm
                    ref={addServiceRef}
                    bookingId={bookingId} // Pass booking ID after it's created
                    onServiceTotalChange={handleServiceTotalChange} // Callback for service total
                />
            )}


            <h3>Tổng giá tiền thay đổi thành: {newBookingPrice}</h3>
            <div className="checkout-button">
                {/* Button để cập nhật thông tin booking */}
                <button onClick={handleUpdateBooking}
                    disabled={isUpdating || (orderRooms[0].bookingId?.status !== 'Đã check-in' && orderRooms[0].bookingId?.status !== 'Đã đặt')}

                >
                    {isUpdating ? 'Đang cập nhật...' : 'Cập nhật Dịch vụ và Giá'}
                </button>
                <button
                    onClick={handleCheckout}
                    disabled={isUpdating || orderRooms[0].bookingId?.status !== 'Đã check-in'}

                >
                    {isUpdating ? 'Đang cập nhật...' : 'Xác nhận Check-out'}
                </button>
            </div>
        </div>
    );
};
export default BookingDetails;
