import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Container, Form, Row, Col, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const UpdateBookingInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedBookingDetails } = location.state || {};

    const [bookingDetails, setBookingDetails] = useState({
        price: selectedBookingDetails?.bookingId?.price || 0,
        contract: selectedBookingDetails?.bookingId?.contract || '',
        checkout: selectedBookingDetails?.bookingId?.checkout || '',
        quantity: selectedBookingDetails?.quantity || 0,
        checkin: selectedBookingDetails?.bookingId?.checkin || '',
    });

    const [otherServices, setOtherServices] = useState([]);
    const [selectedService, setSelectedService] = useState('');
    const [serviceQuantity, setServiceQuantity] = useState(1);
    const [orderServicesData, setOrderServicesData] = useState([]);
    const [cancelledServices, setCancelledServices] = useState([]); // Mảng lưu dịch vụ bị hủy
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    // Fetch user từ localStorage
    useEffect(() => {
        axios
      .get("http://localhost:9999/orderRooms")
      .then((response) => setBookings(response.data))
      .catch((error) => console.error("Error fetching bookings:", error));
    }, []);
    
    const filteredBookings = bookings.filter((booking) => booking.bookingId._id === selectedBookingDetails?.bookingId?._id);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userResponse = JSON.parse(storedUser);
            setUser(userResponse);
        }
    }, []);

    // Fetch danh sách dịch vụ và dịch vụ đã thêm trước đó
    useEffect(() => {
        axios.get('http://localhost:9999/otherServices')
            .then((response) => setOtherServices(response.data))
            .catch((error) => console.error('Error fetching services:', error));

        if (selectedBookingDetails) {
            // Lấy thông tin dịch vụ đã thêm trước đó
            axios.get(`http://localhost:9999/orderServices/booking/${selectedBookingDetails.bookingId._id}`)
                .then((response) => setOrderServicesData(response.data))
                .catch((error) => console.error('Error fetching added services:', error));
        }
    }, [selectedBookingDetails]);


    // Cập nhật bookingDetails khi selectedBookingDetails thay đổi
    useEffect(() => {
        if (selectedBookingDetails) {
            setBookingDetails({
                price: selectedBookingDetails.bookingId.price,
                contract: selectedBookingDetails.bookingId.contract,
                checkout: selectedBookingDetails.bookingId.checkout,
                quantity: selectedBookingDetails.quantity,
                checkin: selectedBookingDetails.bookingId.checkin,
            });
        }
    }, [selectedBookingDetails]);

    // Xử lý thay đổi thông tin booking (chỉ với admin)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    // Xử lý thêm dịch vụ khác
    const handleAddService = () => {
        const existingService = orderServicesData.find(service => service.otherServiceId === selectedService);

        if (existingService) {
            setOrderServicesData(prevData =>
                prevData.map(service =>
                    service.otherServiceId === selectedService
                        ? { ...service, serviceQuantity: service.serviceQuantity + parseInt(serviceQuantity) }
                        : service
                )
            );
        } else {
            setOrderServicesData(prevData => [
                ...prevData,
                { otherServiceId: selectedService, serviceQuantity: parseInt(serviceQuantity) }
            ]);
        }

        // Cập nhật giá
        const serviceDetails = otherServices.find(s => s._id === selectedService);
        if (serviceDetails) {
            setBookingDetails(prevDetails => ({
                ...prevDetails,
                price: prevDetails.price + serviceDetails.price * parseInt(serviceQuantity),
            }));
        }

        setSelectedService("");
        setServiceQuantity(1);
    };

    // Xử lý hủy dịch vụ (trừ price và lưu dịch vụ bị hủy)
    const handleRemoveService = (serviceId) => {
        const serviceToRemove = orderServicesData.find(service => service.otherServiceId === serviceId);

        if (serviceToRemove) {
            // Cập nhật giá sau khi hủy dịch vụ
            const serviceDetails = otherServices.find(s => s._id === serviceId);
            if (serviceDetails) {
                setBookingDetails(prevDetails => ({
                    ...prevDetails,
                    price: prevDetails.price - serviceDetails.price * serviceToRemove.serviceQuantity,
                }));
            }

            // Thêm vào mảng dịch vụ bị hủy
            setCancelledServices((prev) => [...prev, serviceToRemove]);

            // Xóa dịch vụ khỏi orderServicesData
            setOrderServicesData(prevData => prevData.filter(service => service.otherServiceId !== serviceId));
        }
    };

    // Xử lý submit thông tin đã cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedBooking = {
                ...selectedBookingDetails,
                bookingId: {
                    ...selectedBookingDetails.bookingId,
                    price: bookingDetails.price,
                    contract: bookingDetails.contract,
                    checkout: bookingDetails.checkout,
                },
            };

            // Gửi yêu cầu cập nhật booking
            await axios.put(`http://localhost:9999/bookings/${selectedBookingDetails.bookingId._id}`, updatedBooking.bookingId);

            // Thêm và cập nhật các dịch vụ khác nếu có
            for (const service of orderServicesData) {
                if (service.serviceQuantity > 0) {
                    await axios.post('http://localhost:9999/orderServices', {
                        otherServiceId: service.otherServiceId,
                        bookingId: selectedBookingDetails.bookingId._id,
                        quantity: service.serviceQuantity,
                        note: 'Some optional note'
                    });
                }
            }

            // Xóa dịch vụ bị hủy trong MongoDB
            for (const cancelledService of cancelledServices) {
                await axios.delete(`http://localhost:9999/orderServices/${cancelledService._id}`);
            }

            console.log("Updated booking, added services, and removed cancelled services successfully");
            navigate(-1); // Quay lại trang trước đó
        } catch (error) {
            console.error('Error updating booking:', error);
        }
    };

    return (
        <Container>
            <h2 className="my-4">Cập nhật thông tin đặt phòng</h2>
            {selectedBookingDetails ? (
                <Form onSubmit={handleSubmit}>
                    <h5>Thông tin khách hàng</h5>
                    <ListGroup className="mb-4">
                        <ListGroup.Item><strong>Tên Khách:</strong> {selectedBookingDetails.customerId?.fullname || 'Không có'}</ListGroup.Item>
                        <ListGroup.Item><strong>Điện thoại:</strong> {selectedBookingDetails.customerId?.phone || 'Không có'}</ListGroup.Item>
                        <ListGroup.Item><strong>Email:</strong> {selectedBookingDetails.customerId?.email || 'Không có'}</ListGroup.Item>
                        <ListGroup.Item><strong>Ngày sinh:</strong> {selectedBookingDetails.customerId?.dob || 'Không có'}</ListGroup.Item>
                    </ListGroup>

                    <h5>Thông tin đặt phòng</h5>
                    <ListGroup className="mb-4">
                        {filteredBookings.map((booking) => (
                            <ListGroup.Item key={booking._id}>
                                <strong>Tên phòng:</strong> {booking.roomCateId.name}
                                <br />
                                <strong>Số lượng:</strong> {booking.quantity}
                            </ListGroup.Item>
                        ))}
                        <ListGroup.Item><strong>Check-in:</strong> {new Date(bookingDetails.checkin).toLocaleDateString()}</ListGroup.Item>
                        <ListGroup.Item><strong>Check-out:</strong> {new Date(bookingDetails.checkout).toLocaleDateString()}</ListGroup.Item>
                    </ListGroup>

                    {/* Nếu user.role === 'admin' thì cho phép chỉnh sửa price và contract */}
                    {user && (
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="price" className="mb-3">
                                    <Form.Label>Tổng Giá</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={bookingDetails.price}
                                        onChange={handleChange}
                                        required
                                        readOnly={user.role !== 'admin'}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="contract" className="mb-3">
                                    <Form.Label>Hợp đồng</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contract"
                                        value={bookingDetails.contract}
                                        onChange={handleChange}
                                        // required
                                        readOnly={user.role !== 'admin'}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    )}

                    <h5>Thêm Dịch Vụ Khác</h5>
                    <Row className="mt-3">
                        <Col md={6}>
                            <Form.Group controlId="otherService">
                                <Form.Label>Chọn dịch vụ</Form.Label>
                                <Form.Select
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                >
                                    <option value="">Chọn dịch vụ</option>
                                    {otherServices.map((service) => (
                                        <option key={service._id} value={service._id}>
                                            {service.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group controlId="serviceQuantity">
                                <Form.Label>Số lượng</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={serviceQuantity}
                                    onChange={(e) => setServiceQuantity(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Button variant="success" className="mt-4" onClick={handleAddService}>
                                Thêm dịch vụ
                            </Button>
                        </Col>
                    </Row>

                    {/* Hiển thị danh sách dịch vụ đã thêm */}
                    {orderServicesData.length > 0 && (
                        <Card className="mt-4">
                            <Card.Header>Dịch vụ đã chọn:</Card.Header>
                            <ListGroup variant="flush">
                                {orderServicesData.map((service) => {
                                    const serviceDetails = otherServices.find(s => s._id === service.otherServiceId._id || s._id === service.otherServiceId);
                                    return (
                                        <ListGroup.Item key={service.otherServiceId}>
                                            <Row>
                                                <Col md={6}>
                                                    {serviceDetails?.name} - Số lượng: {service?.serviceQuantity || service.quantity}
                                                </Col>
                                                <Col md={3}>
                                                    <Button variant="danger" onClick={() => handleRemoveService(service.otherServiceId)}>
                                                        Hủy
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                        </Card>
                    )}

                    <Button variant="primary" type="submit" className="mt-4">
                        Cập nhật thông tin
                    </Button>
                </Form>
            ) : (
                <p>Không có thông tin để cập nhật.</p>
            )}
        </Container>
    );
};

export default UpdateBookingInfo;
