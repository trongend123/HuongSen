import React, { useState, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

const AddIdentifyForm = forwardRef(({ }, ref) => {
    const [identifycationData, setIdentifycationData] = useState({
        name: '',
        code: '',
        dateStart: '',
        dateEnd: '',
        location: '',
        customerID: null
    });
    const [errors, setErrors] = useState({});

    const handleIdentifycationChange = (e) => {
        setIdentifycationData({
            ...identifycationData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();

        if (!identifycationData.name) {
            newErrors.name = "Loại giấy tờ định danh là bắt buộc";
        }

        const codePattern = /^[A-Za-z0-9]+$/;
        if (!identifycationData.code.trim() || !codePattern.test(identifycationData.code)) {
            newErrors.code = "Mã định danh chỉ được chứa chữ cái và số";
        }

        const identifycationStartDate = new Date(identifycationData.dateStart);
        const identifycationEndDate = new Date(identifycationData.dateEnd);
        if (!identifycationData.dateStart) {
            newErrors.dateStart = "Ngày cấp là bắt buộc";
        } else if (identifycationStartDate > today) {
            newErrors.dateStart = "Ngày cấp không thể sau ngày hôm nay";
        }

        if (!identifycationData.dateEnd) {
            newErrors.dateEnd = "Ngày hết hạn là bắt buộc";
        } else {
            const fiveYearsLater = new Date(identifycationStartDate);
            fiveYearsLater.setFullYear(fiveYearsLater.getFullYear() + 5);
            if (identifycationEndDate <= identifycationStartDate) {
                newErrors.dateEnd = "Ngày hết hạn phải sau ngày cấp";
            } else if (identifycationEndDate < fiveYearsLater) {
                newErrors.dateEnd = "Ngày hết hạn phải cách ngày cấp ít nhất 5 năm";
            }
        }

        const locationPattern = /^[A-Za-zÀ-ÿ0-9\s,.-]+$/;
        if (!identifycationData.location.trim() || !locationPattern.test(identifycationData.location)) {
            newErrors.location = "Địa chỉ chỉ được chứa chữ cái, số và các ký tự như ',', '.', và '-'";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createIdentify = async (customerID) => {
        if (!validateForm()) {
            console.log("Form has errors, please fix them before submitting.");
            return null; // Return null to indicate failure
        }
        try {
            // Send data to the server with the provided `customerID`
            const response = await fetch('http://localhost:9999/identifycations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...identifycationData, // Other form data
                    customerID: customerID, // Add customer ID
                }),
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            // Parse the response
            const responseData = await response.json();
            console.log("Identifycation created successfully!");

            // Return the created identifycation ID
            return responseData._id;
        } catch (error) {
            console.error('Error creating identifycation:', error);
            return null; // Return null to indicate failure
        }
    };


    useImperativeHandle(ref, () => ({
        createIdentify
    }));

    return (
        <Card className="shadow-sm mb-3">
            <Card.Header className=" text-white" style={{ backgroundColor: '#81a969' }}><h5>Thêm Giấy Tờ Định Danh</h5></Card.Header>
            <Card.Body>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>Loại giấy tờ định danh</strong></Form.Label>
                                <Form.Select
                                    name='name'
                                    value={identifycationData.name}
                                    onChange={handleIdentifycationChange}
                                    isInvalid={!!errors.name}
                                >
                                    <option value="">Chọn loại giấy tờ</option>
                                    <option value="Căn Cước Công Dân">Căn Cước Công Dân</option>
                                    <option value="Hộ Chiếu">Hộ Chiếu</option>
                                    <option value="Bằng Lái Xe">Bằng Lái Xe</option>
                                    <option value="Hộ khẩu">Hộ khẩu</option>
                                </Form.Select>
                                <Form.Control.Feedback type='invalid'>
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>Mã định danh</strong></Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Nhập mã định danh'
                                    name='code'
                                    value={identifycationData.code}
                                    onChange={handleIdentifycationChange}
                                    isInvalid={!!errors.code}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.code}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>Ngày cấp</strong></Form.Label>
                                <Form.Control
                                    type='date'
                                    name='dateStart'
                                    value={identifycationData.dateStart}
                                    onChange={handleIdentifycationChange}
                                    isInvalid={!!errors.dateStart}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.dateStart}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>Ngày hết hạn</strong></Form.Label>
                                <Form.Control
                                    type='date'
                                    name='dateEnd'
                                    value={identifycationData.dateEnd}
                                    onChange={handleIdentifycationChange}
                                    isInvalid={!!errors.dateEnd}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.dateEnd}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className='mb-3'>
                                <Form.Label><strong>Nơi cấp</strong></Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Nhập nơi cấp'
                                    name='location'
                                    value={identifycationData.location}
                                    onChange={handleIdentifycationChange}
                                    isInvalid={!!errors.location}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {errors.location}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                </Form>
            </Card.Body>
        </Card>
    );
});

export default AddIdentifyForm;
