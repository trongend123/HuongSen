import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';

const AddUserForm = forwardRef(({ }, ref) => {
    const [customerData, setCustomerData] = useState({
        fullname: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleCustomerChange = (e) => {
        setCustomerData({
            ...customerData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        const namePattern = /^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẰẮẲẴẶèéêẽếềệỉĩìíòóôõơợụùúỷỹýỵ\s]+$/;
        const today = new Date();

        // Validate fullname
        if (!customerData.fullname.trim() || !namePattern.test(customerData.fullname)) {
            newErrors.fullname = "Họ và tên chỉ được chứa chữ cái";
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(customerData.email)) {
            newErrors.email = "Vui lòng nhập email hợp lệ";
        }

        // Validate phone
        const phonePattern = /^(03|05|07|08|09)\d{8,9}$/;
        if (!phonePattern.test(customerData.phone)) {
            newErrors.phone = "Vui lòng nhập số điện thoại hợp lệ";
        }

        // Validate date of birth
        if (!customerData.dob) {
            newErrors.dob = "Ngày tháng năm sinh là bắt buộc";
        } else {
            const dob = new Date(customerData.dob);
            const age = today.getFullYear() - dob.getFullYear();
            if (age < 18 || (age === 18 && today < new Date(dob.setFullYear(today.getFullYear() - 18)))) {
                newErrors.dob = "Khách hàng phải từ 18 tuổi trở lên";
            }
        }

        // Validate gender
        if (!customerData.gender) {
            newErrors.gender = "Vui lòng chọn giới tính";
        }

        // Validate address
        if (!customerData.address.trim()) {
            newErrors.address = "Vui lòng nhập địa chỉ";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createUser = async () => {
        if (!validateForm()) {
            console.log("Form has errors, please fix them before submitting.");
            return null; // Return null if there are errors
        }
        setLoading(true);

        try {
            const response = await fetch('http://localhost:9999/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            });

            if (!response.ok) {
                throw new Error('Có lỗi xảy ra khi tạo người dùng.');
            }

            const responseData = await response.json();
            return responseData._id; // Return the ID of the created user
        } catch (error) {
            console.error('Error creating user:', error);
            return null; // Return null if there is an error
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        createUser
    }));

    return (
        <Card className="shadow-sm">
            <Card.Header as="h5" className="bg-primary text-white">Thông tin khách hàng</Card.Header>
            <Card.Body>
                <Form>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="fullname">
                                <Form.Label><strong>Họ và tên</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="fullname"
                                    value={customerData.fullname}
                                    onChange={handleCustomerChange}
                                    isInvalid={!!errors.fullname}
                                    placeholder="Nhập họ và tên"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.fullname}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="email">
                                <Form.Label><strong>Email</strong></Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={customerData.email}
                                    onChange={handleCustomerChange}
                                    isInvalid={!!errors.email}
                                    placeholder="Nhập email"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="phone">
                                <Form.Label><strong>Số điện thoại</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="phone"
                                    value={customerData.phone}
                                    onChange={handleCustomerChange}
                                    isInvalid={!!errors.phone}
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.phone}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="dob">
                                <Form.Label><strong>Ngày tháng năm sinh</strong></Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dob"
                                    value={customerData.dob}
                                    onChange={handleCustomerChange}
                                    isInvalid={!!errors.dob}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.dob}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="gender">
                                <Form.Label><strong>Giới tính</strong></Form.Label>
                                <Form.Control
                                    as="select"
                                    name="gender"
                                    value={customerData.gender}
                                    onChange={handleCustomerChange}
                                    isInvalid={!!errors.gender}
                                    required
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="Male">Nam</option>
                                    <option value="Female">Nữ</option>
                                    <option value="Other">Khác</option>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {errors.gender}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="address">
                                <Form.Label><strong>Địa chỉ</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={customerData.address}
                                    onChange={handleCustomerChange}
                                    isInvalid={!!errors.address}
                                    placeholder="Nhập địa chỉ"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.address}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>

            </Card.Body>
        </Card>
    );
});

export default AddUserForm;