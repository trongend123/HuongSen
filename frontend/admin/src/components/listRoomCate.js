import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';

// Component to display individual room category information
const RoomCategoryItem = ({ roomCategory, onDelete, onEdit }) => {
    return (
        <tr>
            <td>{roomCategory.locationId.name}</td>
            <td>{roomCategory.name}</td>
            <td>{roomCategory.numberOfBed}</td>
            <td>{roomCategory.numberOfHuman}</td>
            <td>{roomCategory.price}</td>
            <td>
                <Button variant="warning" size="sm" className="mx-1" onClick={() => onEdit(roomCategory)}>Chỉnh sửa</Button>
                <Button variant="danger" size="sm" onClick={() => onDelete(roomCategory._id)}>Xóa</Button>
            </td>
        </tr>
    );
};

// Main component to manage room categories
const ListRoomCate = () => {
    const [roomCategories, setRoomCategories] = useState([]);
    const [locations, setLocations] = useState([]); // State for locations
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedRoomCategory, setSelectedRoomCategory] = useState(null);
    const [newRoomCategory, setNewRoomCategory] = useState({
        name: '',
        numberOfBed: 1,
        numberOfHuman: 1,
        price: 0,
        locationId: '', // Location ID will be selected
    });
    const [errors, setErrors] = useState({});
    const [filterName, setFilterName] = useState(''); // State for filtering by room name
    const [filterLocation, setFilterLocation] = useState(''); // State for filtering by location

    // Fetch room categories and locations from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const roomCategoryResponse = await axios.get('http://localhost:9999/roomCategories');
                setRoomCategories(roomCategoryResponse.data);

                const locationResponse = await axios.get('http://localhost:9999/locations'); // Fetch locations
                setLocations(locationResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [roomCategories]);

    // Validate input fields
    const validateInputs = () => {
        const newErrors = {};

        if (!newRoomCategory.name) {
            newErrors.name = "Tên loại phòng là bắt buộc.";
        }
        if (newRoomCategory.numberOfBed < 1) {
            newErrors.numberOfBed = "Số giường phải lớn hơn 0.";
        }
        if (newRoomCategory.numberOfHuman < 1) {
            newErrors.numberOfHuman = "Số người phải lớn hơn 0.";
        }
        if (newRoomCategory.price < 0) {
            newErrors.price = "Giá không thể âm.";
        }
        if (!newRoomCategory.locationId) {
            newErrors.locationId = "Vui lòng chọn chi nhánh.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle delete room category
    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:9999/roomCategories/${id}`)
            .then(() => {
                setRoomCategories(roomCategories.filter(roomCategory => roomCategory._id !== id));
            })
            .catch((error) => console.error("Error deleting room category:", error));
    };

    // Handle show modal
    const handleShowModal = () => setShowModal(true);

    // Handle close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditMode(false);
        setSelectedRoomCategory(null);
        setErrors({});
        setNewRoomCategory({ name: '', numberOfBed: 1, numberOfHuman: 1, price: 0, locationId: '' });
    };

    // Handle change in input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewRoomCategory((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle room category creation
    const handleCreateRoomCategory = () => {
        if (validateInputs()) {
            axios
                .post('http://localhost:9999/roomCategories', newRoomCategory)
                .then((response) => {
                    setRoomCategories([...roomCategories, response.data]);
                    handleCloseModal();
                })
                .catch((error) => console.error("Error creating room category:", error));
        }
    };

    // Handle room category editing
    const handleEditRoomCategory = (roomCategory) => {
        setIsEditMode(true);
        setSelectedRoomCategory(roomCategory);
        setNewRoomCategory({
            name: roomCategory.name,
            numberOfBed: roomCategory.numberOfBed,
            numberOfHuman: roomCategory.numberOfHuman,
            price: roomCategory.price,
            locationId: roomCategory.locationId._id, // Get the locationId directly
        });
        handleShowModal();
    };

    // Handle room category update
    const handleUpdateRoomCategory = () => {
        if (validateInputs()) {
            axios
                .put(`http://localhost:9999/roomCategories/${selectedRoomCategory._id}`, newRoomCategory)
                .then((response) => {
                    setRoomCategories(
                        roomCategories.map(roomCategory => roomCategory._id === selectedRoomCategory._id ? response.data : roomCategory)
                    );
                    handleCloseModal();
                })
                .catch((error) => console.error("Error updating room category:", error));
        }
    };

    // Filtered room categories based on filters
    const filteredRoomCategories = roomCategories.filter((roomCategory) => {
        const matchesRoomName = roomCategory.name?.toLowerCase().includes(filterName.toLowerCase());
        const matchesLocation = roomCategory.locationId.name?.toLowerCase().includes(filterLocation.toLowerCase());
        return matchesRoomName && matchesLocation;
    });


    return (
        <Container>
            <h2 className="text-center my-4">Danh sách loại phòng</h2>

            <Row className="mb-3">
                <Col md={5}>
                    <Form.Control
                        type="text"
                        placeholder="Tìm theo tên loại phòng"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                    />
                </Col>
                <Col md={5}>
                    <Form.Select
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                    >
                        <option value="">Tất cả chi nhánh</option>
                        {locations.map((location) => (
                            <option key={location._id} value={location.name}>{location.name}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Button className="bg-success" onClick={() => { setIsEditMode(false); handleShowModal(); }}>
                        Thêm loại phòng
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Tên chi nhánh</th>
                        <th>Tên loại phòng</th>
                        <th>Số giường</th>
                        <th>Số người</th>
                        <th>Giá</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRoomCategories.map((roomCategory) => (
                        <RoomCategoryItem key={roomCategory._id} roomCategory={roomCategory} onDelete={handleDelete} onEdit={handleEditRoomCategory} />
                    ))}
                </tbody>
            </Table>

            {/* Modal for creating or editing room category */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? 'Chỉnh sửa loại phòng' : 'Tạo loại phòng'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên loại phòng</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newRoomCategory.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số giường</Form.Label>
                            <Form.Control
                                type="number"
                                name="numberOfBed"
                                value={newRoomCategory.numberOfBed}
                                onChange={handleChange}
                                min={1}
                                isInvalid={!!errors.numberOfBed}
                            />
                            <Form.Control.Feedback type="invalid">{errors.numberOfBed}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số người</Form.Label>
                            <Form.Control
                                type="number"
                                name="numberOfHuman"
                                value={newRoomCategory.numberOfHuman}
                                onChange={handleChange}
                                min={1}
                                isInvalid={!!errors.numberOfHuman}
                            />
                            <Form.Control.Feedback type="invalid">{errors.numberOfHuman}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giá</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={newRoomCategory.price}
                                onChange={handleChange}
                                min={1000}
                                isInvalid={!!errors.price}
                            />
                            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Chi nhánh</Form.Label>
                            <Form.Select
                                name="locationId"
                                value={newRoomCategory.locationId}
                                onChange={handleChange}
                                isInvalid={!!errors.locationId}
                            >
                                <option value="">Chọn chi nhánh</option>
                                {locations.map((location) => (
                                    <option key={location._id} value={location._id}>{location.name}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">{errors.locationId}</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={isEditMode ? handleUpdateRoomCategory : handleCreateRoomCategory}>
                        {isEditMode ? 'Cập nhật' : 'Tạo'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ListRoomCate;
