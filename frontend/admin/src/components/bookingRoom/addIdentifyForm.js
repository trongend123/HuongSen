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

        // Kiểm tra loại giấy tờ và mã định danh
        if (!identifycationData.name) {
            newErrors.name = "Loại giấy tờ là bắt buộc.";
        } else {
            const identifycationStartDate = new Date(identifycationData.dateStart);
            const identifycationEndDate = new Date(identifycationData.dateEnd);

            switch (identifycationData.name) {
                case "Căn Cước Công Dân":
                    if (!identifycationData.code || !/^[0-9]{12}$/.test(identifycationData.code)) {
                        newErrors.code = "Mã Căn Cước Công Dân phải gồm 12 chữ số.";
                    }

                    // Kiểm tra ngày hết hạn cho Căn Cước Công Dân
                    if (!identifycationData.dateEnd) {
                        newErrors.dateEnd = "Ngày hết hạn là bắt buộc.";
                    } else {
                        const fiveYearsLater = new Date(identifycationStartDate);
                        fiveYearsLater.setFullYear(fiveYearsLater.getFullYear() + 5);

                        if (identifycationEndDate <= identifycationStartDate) {
                            newErrors.dateEnd = "Ngày hết hạn phải sau ngày cấp.";
                        } else if (identifycationEndDate.getTime() !== fiveYearsLater.getTime()) {
                            newErrors.dateEnd = "Ngày hết hạn phải cách ngày cấp đúng 5 năm.";
                        }
                    }
                    break;

                case "Giấy Phép Lái Xe":
                case "Hộ Chiếu":
                    if (!identifycationData.code) {
                        if (identifycationData.name === "Giấy Phép Lái Xe" && !/^[0-9]{12}$/.test(identifycationData.code)) {
                            newErrors.code = "Mã Giấy Phép Lái Xe phải gồm 12 chữ số.";
                        } else if (identifycationData.name === "Hộ Chiếu" && !/^[A-Z][0-9]{7}$/.test(identifycationData.code)) {
                            newErrors.code = "Mã Hộ Chiếu phải gồm 8 ký tự, bắt đầu bằng chữ cái in hoa, tiếp theo là 7 số.";
                        }
                    }

                    // Kiểm tra ngày hết hạn cho Giấy Phép Lái Xe và Hộ Chiếu
                    if (!identifycationData.dateEnd) {
                        newErrors.dateEnd = "Ngày hết hạn là bắt buộc.";
                    } else {
                        const fiveYearsLater = new Date(identifycationStartDate);
                        const tenYearsLater = new Date(identifycationStartDate);
                        fiveYearsLater.setFullYear(fiveYearsLater.getFullYear() + 5);
                        tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);

                        if (identifycationEndDate <= identifycationStartDate) {
                            newErrors.dateEnd = "Ngày hết hạn phải sau ngày cấp.";
                        } else if (identifycationEndDate !== fiveYearsLater && identifycationEndDate !== tenYearsLater) {
                            newErrors.dateEnd = "Ngày hết hạn phải cách ngày cấp 5 năm hoặc 10 năm. (Vô hạn = 10 năm)";
                        }
                    }
                    break;

                default:
                    newErrors.name = "Loại giấy tờ không hợp lệ.";
            }
        }

        // Kiểm tra ngày cấp
        const identifycationStartDate = new Date(identifycationData.dateStart);
        if (!identifycationData.dateStart) {
            newErrors.dateStart = "Ngày cấp là bắt buộc.";
        } else if (identifycationStartDate > today) {
            newErrors.dateStart = "Ngày cấp không thể sau ngày hôm nay.";
        }

        // Kiểm tra nơi cấp
        const locationPattern = /^[A-Za-zÀ-ÿ0-9\s,.-]+$/;
        if (!identifycationData.location.trim() || !locationPattern.test(identifycationData.location)) {
            newErrors.location = "Địa chỉ chỉ được chứa chữ cái, số và các ký tự như ',', '.', và '-'.";
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
            <Card.Header className="bg-primary text-white"><h5>Thêm Giấy Tờ Định Danh</h5></Card.Header>
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
                                    <option value="Giấy Phép Lái Xe">Giấy Phép Lái Xe</option>
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
