import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';

const AddServiceForm = forwardRef(({ bookingId, onServiceTotalChange }, ref) => {
    const [otherServices, setOtherServices] = useState([]);
    const [orderServicesData, setOrderServicesData] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [serviceQuantity, setServiceQuantity] = useState(1);
    const [selectedServiceDescription, setSelectedServiceDescription] = useState("");
    const [serviceNote, setServiceNote] = useState(""); // Ghi chú cho dịch vụ đang chọn
    const [serviceDate, setServiceDate] = useState("");
    const [serviceTimeSlot, setServiceTimeSlot] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [formError, setFormError] = useState("");
    const [expandedNotes, setExpandedNotes] = useState([]);

    useEffect(() => {
        const fetchOtherService = async () => {
            try {
                const response = await axios.get('http://localhost:9999/otherServices');
                const services = response.data.map(service => ({
                    otherServiceId: service._id,
                    name: service.name,
                    price: service.price,
                    description: service.description,
                }));
                setOtherServices(services);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách dịch vụ:', error);
            }
        };
        fetchOtherService();
    }, []);

    const calculateTotalAmount = () => {
        const total = orderServicesData.reduce((sum, service) => {
            const serviceDetails = otherServices.find(s => s.otherServiceId === service.otherServiceId);
            return serviceDetails ? sum + serviceDetails.price * service.serviceQuantity : sum;
        }, 0);
        setTotalAmount(total);
    };

    useEffect(() => {
        calculateTotalAmount();
    }, [orderServicesData]);

    useEffect(() => {
        if (onServiceTotalChange) {
            onServiceTotalChange(totalAmount);
        }
    }, [totalAmount, onServiceTotalChange]);

    const handleServiceChange = (serviceId) => {
        setSelectedService(serviceId);
        const serviceDetails = otherServices.find(service => service.otherServiceId === serviceId);
        setSelectedServiceDescription(serviceDetails?.description || "");
    };
    const toggleNoteExpansion = (index) => {
        setExpandedNotes((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index) // Remove index if already expanded
                : [...prev, index] // Add index if not expanded
        );
    };

    const handleAddService = () => {
        if (!serviceDate || !serviceTimeSlot) {
            setFormError("Vui lòng chọn cả ngày và thời gian cho dịch vụ.");
            return;
        }
        setFormError(""); // Clear error if validation passes
        const [hours, minutes] = serviceTimeSlot.split(':').map(Number);
        const combinedDateTime = new Date(serviceDate);
        combinedDateTime.setHours(hours, minutes, 0, 0);

        const existingService = orderServicesData.find(service => service.otherServiceId === selectedService);

        if (existingService) {
            setOrderServicesData(prevData =>
                prevData.map(service =>
                    service.otherServiceId === selectedService
                        ? {
                            ...service,
                            serviceQuantity: service.serviceQuantity + parseInt(serviceQuantity),
                            note: serviceNote, // Cập nhật ghi chú
                            time: combinedDateTime,
                        }
                        : service
                )
            );
        } else {
            setOrderServicesData(prevData => [
                ...prevData,
                {
                    otherServiceId: selectedService,
                    serviceQuantity: parseInt(serviceQuantity),
                    note: serviceNote, // Ghi chú mới
                    time: combinedDateTime,
                },
            ]);
        }

        setSelectedService("");
        setServiceQuantity(1);
        setSelectedServiceDescription("");
        setServiceNote(""); // Reset ghi chú
    };

    const handleRemoveService = (index) => {
        setOrderServicesData(prevData => prevData.filter((_, i) => i !== index));
        calculateTotalAmount();
    };

    const addService = async (bookingId) => {
        try {
            const promises = orderServicesData.map(service => {
                // Adjust time to UTC+7
                const localTime = new Date(service.time); // Local time of the service
                const vietnamTime = new Date(localTime.getTime() - localTime.getTimezoneOffset() * 60000); // Adjust by local offset
                const formattedTime = vietnamTime.toISOString(); // Convert to ISO 8601

                return axios.post('http://localhost:9999/orderServices', {
                    otherServiceId: service.otherServiceId,
                    bookingId,
                    note: service.note, // Ghi chú
                    quantity: service.serviceQuantity,
                    time: formattedTime, // Post time in Vietnam timezone (UTC+7)
                });
            });

            await Promise.all(promises);
            // Sau khi thêm dịch vụ thành công, clear orderServicesData
            setOrderServicesData([]);
            console.log("Thêm dịch vụ và ghi chú thành công!");
            // Tính lại tổng giá dịch vụ sau khi clear
            calculateTotalAmount();
        } catch (error) {
            console.error('Lỗi khi thêm dịch vụ:', error);
        }
    };

    useImperativeHandle(ref, () => ({
        addService,
    }));

    return (
        <Card className="mb-4">
            <Card.Header className='text-bg-info'>
                <h5 >Dịch Vụ & Số lần Sử Dụng</h5>
            </Card.Header>
            <Card.Body>
                <Row className="mt-3 align-items-end">
                    <Col md={5}>
                        <Form.Group>
                            <Form.Label>Chọn dịch vụ</Form.Label>
                            <Form.Select
                                className="text-center"
                                style={{ height: '50px' }}
                                value={selectedService}
                                onChange={(e) => handleServiceChange(e.target.value)}
                            >
                                <option value="">Chọn dịch vụ</option>
                                {otherServices.map(service => (
                                    <option key={service.otherServiceId} value={service.otherServiceId}>
                                        {service.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="text-center">
                            <Form.Label>Mô tả</Form.Label>
                            <div className="text-muted border" style={{ height: '50px', overflowY: 'auto' }}>
                                <small>{selectedServiceDescription || "Mô tả dịch vụ"}</small>
                            </div>
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Form.Group>
                            <Form.Label>Số lượng</Form.Label>
                            <Form.Control
                                className="text-center"
                                style={{ height: '50px' }}
                                type="number"
                                min="1"
                                value={serviceQuantity}
                                onChange={(e) => setServiceQuantity(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Ghi chú dịch vụ</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Ghi chú cho dịch vụ đang chọn"
                                value={serviceNote}
                                onChange={(e) => setServiceNote(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Ngày sử dụng</Form.Label>
                            <Form.Control
                                type="date"
                                value={serviceDate}
                                onChange={(e) => setServiceDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Thời gian</Form.Label>
                            <Form.Select
                                value={serviceTimeSlot}
                                onChange={(e) => setServiceTimeSlot(e.target.value)}
                            >
                                <option value="">Chọn thời gian</option>
                                <option value="7:00">Sáng (7:00)</option>
                                <option value="11:00">Trưa (11:00)</option>
                                <option value="14:00">Chiều (14:00)</option>
                                <option value="18:00">Tối (18:00)</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                {/* Display error message */}
                {formError && (
                    <Row className="mt-2">
                        <Col>
                            <div style={{ color: 'red', fontSize: '14px' }}>{formError}</div>
                        </Col>
                    </Row>
                )}
                <Button
                    className="mt-3"
                    onClick={handleAddService}
                    disabled={!selectedService || serviceQuantity <= 0}
                >
                    Thêm dịch vụ
                </Button>
                {orderServicesData.length > 0 && (
                    <div className="mt-4">
                        <table className="table table-striped text-center">
                            <thead>
                                <tr>
                                    <th>DV đã chọn</th>
                                    <th>Số lượng</th>
                                    <th>Thời gian</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderServicesData.map((service, index) => {
                                    const serviceDetails = otherServices.find(s => s.otherServiceId === service.otherServiceId);
                                    return (
                                        <React.Fragment key={service.otherServiceId}>
                                            {/* Main Row */}
                                            <tr>
                                                <td>{serviceDetails?.name}</td>
                                                <td>{service.serviceQuantity}</td>
                                                <td>
                                                    {new Intl.DateTimeFormat('vi-VN', {
                                                        timeZone: 'Asia/Ho_Chi_Minh',
                                                        dateStyle: 'short',
                                                        timeStyle: 'short'
                                                    }).format(new Date(service.time))}
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleRemoveService(index)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </td>
                                            </tr>

                                            {/* Note Row */}
                                            <tr>
                                                <td colSpan="4">
                                                    <div
                                                        style={{
                                                            padding: '5px',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            textAlign: 'left',
                                                            position: 'relative',
                                                        }}
                                                    >
                                                        {/* Display truncated or full note */}
                                                        <div
                                                            style={{
                                                                maxHeight: expandedNotes.includes(index) ? 'none' : '35px', // Toggle height
                                                                overflowY: expandedNotes.includes(index) ? 'visible' : 'hidden', // Hide overflow unless expanded
                                                                textOverflow: 'ellipsis', // Add ellipsis when collapsed
                                                                display: expandedNotes.includes(index) ? 'block' : 'inline', // Adjust layout
                                                            }}
                                                        >
                                                            {expandedNotes.includes(index)
                                                                ? service.note || "Không có ghi chú"
                                                                : (service.note || "Không có ghi chú").slice(0, 50) + (service.note && service.note.length > 100 ? "..." : "")}
                                                        </div>

                                                        {/* Button position based on state */}
                                                        {service.note && service.note.length > 100 && (
                                                            <div
                                                                style={{
                                                                    marginTop: expandedNotes.includes(index) ? '5px' : '0', // Add space for "See Less"
                                                                    textAlign: expandedNotes.includes(index) ? 'right' : 'left', // Align for consistency
                                                                    display: expandedNotes.includes(index) ? 'block' : 'inline', // Change line position
                                                                }}
                                                            >
                                                                <button
                                                                    onClick={() => toggleNoteExpansion(index)}
                                                                    style={{
                                                                        backgroundColor: 'transparent',
                                                                        border: 'none',
                                                                        color: '#007bff',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    {expandedNotes.includes(index) ? 'Thu gọn' : 'Xem thêm'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>



                                        </React.Fragment>
                                    );
                                })}
                            </tbody>


                        </table>
                    </div>
                )}
                <h6 className="mt-4">Tổng giá dịch vụ: {totalAmount.toLocaleString()} VND</h6>
            </Card.Body>
        </Card>
    );
});

export default AddServiceForm;
