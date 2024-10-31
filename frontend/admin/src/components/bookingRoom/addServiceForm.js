import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';

const AddServiceForm = forwardRef(({ bookingId, onServiceTotalChange }, ref) => {
    const [otherServices, setOtherServices] = useState([]);
    const [orderServicesData, setOrderServicesData] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [serviceQuantity, setServiceQuantity] = useState(1);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchOtherService = async () => {
            try {
                const response = await axios.get('http://localhost:9999/otherServices');
                const services = response.data.map(service => ({
                    otherServiceId: service._id,
                    name: service.name,
                    price: service.price,
                    serviceQuantity: 0
                }));
                setOtherServices(services);
            } catch (error) {
                console.error('Error fetching other services:', error);
            }
        };
        fetchOtherService();
    }, []);

    const calculateTotalAmount = () => {
        let total = 0;

        // Calculate the total amount for selected services
        orderServicesData.forEach(service => {
            const serviceDetails = otherServices.find(s => s.otherServiceId === service.otherServiceId);
            if (serviceDetails) {
                total += serviceDetails.price * service.serviceQuantity;
            }
        });

        // Set the total amount
        setTotalAmount(total);
    };

    useEffect(() => {
        calculateTotalAmount();  // Recalculate total when services are added/removed
    }, [orderServicesData]);

    useEffect(() => {
        // Pass the totalAmount to the parent component when it changes
        if (onServiceTotalChange) {
            onServiceTotalChange(totalAmount);
        }
    }, [totalAmount, onServiceTotalChange]);

    const handleRemoveService = (index) => {
        setOrderServicesData(prevData => prevData.filter((_, i) => i !== index));
        calculateTotalAmount();
    };

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

        setSelectedService("");
        setServiceQuantity(1);
        calculateTotalAmount();
    };

    const addService = async (bookingId) => {
        try {
            const orderServicePromises = orderServicesData.map(service => {
                if (service.serviceQuantity > 0) {
                    return axios.post('http://localhost:9999/orderServices', {
                        otherServiceId: service.otherServiceId,
                        bookingId: bookingId,
                        quantity: service.serviceQuantity,
                        note: 'Some optional note'
                    });
                }
            });

            console.log("Service added successfully!");
        } catch (error) {
            console.error('Error adding service:', error);
        }
    };

    useImperativeHandle(ref, () => ({
        addService
    }));

    return (
        <Card className="mb-4">
            <Card.Header>
                <h5 className="mt-2 mb-2">Dịch Vụ & Số lần Sử Dụng</h5>
            </Card.Header>
            <Card.Body>
                <Row className="mt-3 align-items-end">
                    <Col md={5}>
                        <Form.Group>
                            <Form.Label>Chọn dịch vụ</Form.Label>
                            <Form.Select
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                            >
                                <option value="">Chọn dịch vụ</option>
                                {otherServices.map((service) => (
                                    <option key={service.otherServiceId} value={service.otherServiceId}>
                                        {service.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Nhập số lượng</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={serviceQuantity}
                                onChange={(e) => setServiceQuantity(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Button
                            className="w-auto text-bg-success"
                            onClick={handleAddService}
                            disabled={!selectedService || serviceQuantity <= 0}
                        >
                            Thêm dịch vụ
                        </Button>
                    </Col>
                </Row>

                {/* Display the selected services */}
                {orderServicesData.length > 0 && (
                    <div className="mt-3">
                        {orderServicesData.length > 0 ? (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Tên dịch vụ đã chọn</th>
                                        <th>Số lượng</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderServicesData.map((service, index) => {
                                        const serviceDetails = otherServices.find(s => s.otherServiceId === service.otherServiceId);
                                        return (
                                            <tr key={service.otherServiceId}>
                                                <td>{serviceDetails?.name}</td>
                                                <td>{service.serviceQuantity}</td>
                                                <td>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleRemoveService(index)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p>Chưa có dịch vụ nào được chọn.</p>
                        )}
                    </div>

                )}

                {/* Display the total amount */}
                <h6 className="mt-4">Tổng giá dịch vụ: {totalAmount.toLocaleString()} VND</h6>
            </Card.Body>
        </Card>
    );
});

export default AddServiceForm;
