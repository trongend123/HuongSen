import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table, Row, Col, Pagination, Alert } from "react-bootstrap";
import axios from "axios";

const ListOtherServices = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchPrice, setSearchPrice] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newService, setNewService] = useState({ name: "", price: "", description: "" });
    const [editingService, setEditingService] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const servicesPerPage = 9;
    const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

    // Message state
    const [message, setMessage] = useState(null);

    // Error state for form validation
    const [errors, setErrors] = useState({ name: "", price: "" });

    // Fetch all services
    useEffect(() => {
        axios.get("http://localhost:9999/otherServices")
            .then(response => {
                setServices(response.data);
                setFilteredServices(response.data);
            })
            .catch(error => console.error(error));
    }, []);

    // Filter services by name and price
    useEffect(() => {
        const filtered = services.filter(service =>
            service.name.toLowerCase().includes(searchName.toLowerCase().trim().replace(/\s+/g, ' ')) &&
            (searchPrice === "" || service.price <= parseFloat(searchPrice))
        );
        setFilteredServices(filtered);
        setCurrentPage(1); // Reset to the first page after filtering
    }, [searchName, searchPrice, services]);

    // Sort services by price
    const handleSortByPrice = () => {
        const sortedServices = [...filteredServices].sort((a, b) =>
            sortOrder === "asc" ? a.price - b.price : b.price - a.price
        );
        setFilteredServices(sortedServices);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    // Handle page change
    const handlePageChange = (page) => setCurrentPage(page);

    // Get current services for the page
    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);

    // Open modal to create or edit a service
    const handleShowModal = (service = null) => {
        setEditingService(service);
        setNewService(service || { name: "", price: "", description: "" });
        setErrors({ name: "", price: "" }); // Reset errors when opening modal
        setShowModal(true);
    };

    // Handle input changes
    const handleChange = (e) => {
        setNewService({
            ...newService,
            [e.target.name]: e.target.value,
        });
    };

    // Validate the form fields before saving
    const validateForm = () => {
        let valid = true;
        const newErrors = { name: "", price: "" };

        // Check for empty name field
        if (!newService.name) {
            newErrors.name = "Tên dịch vụ là bắt buộc!";
            valid = false;
        }

        // Check if name is unique
        const isDuplicateName = services.some(
            (service) =>
                service.name.toLowerCase() === newService.name.toLowerCase().trim() &&
                (!editingService || service._id !== editingService._id) // Ignore if editing the same service
        );
        if (isDuplicateName) {
            newErrors.name = "Tên dịch vụ đã tồn tại!";
            valid = false;
        }

        // Check for price field validation
        if (!newService.price || parseFloat(newService.price) < 1000) {
            newErrors.price = "Giá phải lớn hơn 1,000!";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // Save service (create or edit)
    const handleSave = () => {
        if (!validateForm()) return; // Validate before proceeding

        const request = editingService
            ? axios.put(`http://localhost:9999/otherServices/${editingService._id}`, newService)
            : axios.post("http://localhost:9999/otherServices", newService);

        request
            .then(response => {
                setServices(prev =>
                    editingService
                        ? prev.map(service => (service._id === response.data._id ? response.data : service))
                        : [...prev, response.data]
                );
                setMessage({
                    type: 'success',
                    text: editingService ? 'Chỉnh sửa dịch vụ thành công!' : 'Tạo dịch vụ mới thành công!'
                });
                setShowModal(false);
                setNewService({ name: "", price: "", description: "" }); // Clear form after saving
            })
            .catch(error => {
                setMessage({
                    type: 'danger',
                    text: 'Có lỗi xảy ra! Vui lòng thử lại.'
                });
                console.error(error);
            });
    };

    // Delete a service
    const handleDelete = (id) => {
        axios.delete(`http://localhost:9999/otherServices/${id}`)
            .then(() => {
                setServices(services.filter(service => service._id !== id));
                setMessage({
                    type: 'success',
                    text: 'Xóa dịch vụ thành công!'
                });
            })
            .catch(error => {
                setMessage({
                    type: 'danger',
                    text: 'Có lỗi xảy ra khi xóa dịch vụ!'
                });
                console.error(error);
            });
    };
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
      };

    return (
        <div className="container">
            <h2 className="text-center">Danh Sách Dịch Vụ</h2>

            {/* Display message */}
            {message && (
                <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
                    {message.text}
                </Alert>
            )}

            {/* Filter by name and price */}
            <Row className="mb-3 mt-3">
                <Col md={6}>
                    <Form.Control
                        placeholder="Tìm kiếm tên dịch vụ"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </Col>
                <Col md={3}>
                    <Form.Control
                        placeholder="Mức giá"
                        type="number"
                        value={searchPrice}
                        onChange={(e) => setSearchPrice(e.target.value)}
                    />
                </Col>
                <Col md={3}>
                    <Button variant="primary" onClick={() => setShowModal(true)} block>
                        Tạo Dịch Vụ Mới
                    </Button>
                </Col>
            </Row>

            {/* List of services */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Tên dịch vụ</th>
                        <th onClick={handleSortByPrice} style={{ cursor: "pointer" }}>
                            Giá {sortOrder === "asc" ? "▲" : "▼"}
                        </th>
                        <th>Mô tả</th>
                        <th>hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentServices.map((service) => (
                        <tr key={service._id}>
                            <td>{service.name}</td>
                            <td className="text-center">{formatCurrency(service.price)}</td>
                            <td>{service.description}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleShowModal(service)}>
                                    Chỉnh sửa
                                </Button>{" "}
                                <Button variant="danger" onClick={() => handleDelete(service._id)}>
                                    Dừng phục vụ
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination Controls */}
            <Pagination className="justify-content-center">
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            {/* Modal for creating/editing service */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingService ? "Chỉnh Sửa Dịch Vụ" : "Tạo Dịch Vụ Mới"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Tên dịch vụ</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newService.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                                required
                            />
                            {errors.name && <Form.Text className="text-danger">{errors.name}</Form.Text>}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Giá (VND)</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={newService.price}
                                onChange={handleChange}
                                isInvalid={!!errors.price}
                                required
                            />
                            {errors.price && <Form.Text className="text-danger">{errors.price}</Form.Text>}
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={newService.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {editingService ? "Cập Nhật" : "Lưu"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListOtherServices;
