import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';

// Component StaffAccount to display individual staff information
const StaffAccount = ({ staff, onDelete, onEdit }) => {
  return (
    <tr>
      <td>{staff.username}</td>
      <td>{staff.password}</td>
      <td>{staff.email}</td>
      <td>{staff.phone}</td>
      <td>{staff.role}</td>
      <td>
        <Button variant="warning" size="sm" className="mx-1" onClick={() => onEdit(staff)}>Chỉnh sửa</Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(staff._id)}>Xóa</Button>
      </td>
    </tr>
  );
};

// Component ListStaffAccount to manage staff accounts
const ListStaffAccount = () => {
  const [staffData, setStaffData] = useState([]);
  const [searchUsername, setSearchUsername] = useState(''); // Search by username
  const [searchRole, setSearchRole] = useState(''); // Search by role
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [isEditMode, setIsEditMode] = useState(false); // State to determine if we're editing
  const [selectedStaff, setSelectedStaff] = useState(null); // Staff data for editing
  const [newStaff, setNewStaff] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    role: 'staff_cb', // Default role
  });

  // Fetch staff data from API
  useEffect(() => {
    axios
      .get('http://localhost:9999/staffs')
      .then((response) => setStaffData(response.data))
      .catch((error) => console.error("Error fetching staff data:", error));
  }, []);

  // Handle delete staff
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:9999/staffs/${id}`)
      .then(() => {
        setStaffData(staffData.filter(staff => staff._id !== id));
      })
      .catch((error) => console.error("Error deleting staff:", error));
  };

  // Handle show modal (for both create and edit)
  const handleShowModal = () => setShowModal(true);

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false); // Reset mode to create after closing modal
    setSelectedStaff(null); // Clear selected staff after closing modal
  };

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle staff creation
  const handleCreateStaff = () => {
    axios
      .post('http://localhost:9999/staffs', newStaff)
      .then((response) => {
        setStaffData([...staffData, response.data]);
        handleCloseModal();
      })
      .catch((error) => console.error("Error creating staff:", error));
  };

  // Handle staff editing
  const handleEditStaff = (staff) => {
    setIsEditMode(true); // Set mode to edit
    setSelectedStaff(staff); // Set the staff to be edited
    setNewStaff({
      username: staff.username,
      password: staff.password,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
    });
    handleShowModal(); // Show modal with pre-filled data
  };

  // Handle staff update
  const handleUpdateStaff = () => {
    axios
      .put(`http://localhost:9999/staffs/${selectedStaff._id}`, newStaff)
      .then((response) => {
        setStaffData(
          staffData.map(staff => staff._id === selectedStaff._id ? response.data : staff)
        );
        handleCloseModal(); // Close modal after update
      })
      .catch((error) => console.error("Error updating staff:", error));
  };

  // Filter staff data by username and role
  const filteredStaffData = staffData.filter(staff => {
    return (
      staff.username.toLowerCase().includes(searchUsername.toLowerCase()) &&
      (searchRole === '' || staff.role === searchRole)
    );
  });

  return (
    <Container>
      <h2 className="text-center my-4">Danh sách tài khoản nhân viên</h2>

      {/* Search input */}
      <Row className="mb-3">
        <Col md={5}>
          <Form.Control
            type="text"
            placeholder="Tìm theo tên người dùng"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
          />
        </Col>
        <Col md={5}>
          <Form.Select
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="chef">Bếp</option>
            <option value="staff_mk">Lễ tân Minh Khai</option>
            <option value="staff_ds">Lễ tân Đồ Sơn</option>
            <option value="staff_cb">Lễ tân Cát Bà</option>
          </Form.Select>
        </Col>
        <Col md={2} className='text-center'>
          <Button className="bg-success" onClick={() => { setIsEditMode(false); setNewStaff({ username: '', password: '', email: '', phone: '', role: 'staff_cb' }); handleShowModal(); }}>
            Create staff
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tên người dùng</th>
            <th>Mật khẩu</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaffData.map((staff) => (
            <StaffAccount key={staff._id} staff={staff} onDelete={handleDelete} onEdit={handleEditStaff} />
          ))}
        </tbody>
      </Table>

      {/* Modal for creating or editing staff */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Chỉnh sửa tài khoản nhân viên' : 'Tạo tài khoản nhân viên'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên người dùng</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={newStaff.username}
                onChange={handleChange}
                placeholder="Nhập tên người dùng"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="text"
                name="password"
                value={newStaff.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newStaff.email}
                onChange={handleChange}
                placeholder="Nhập email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newStaff.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vai trò</Form.Label>
              <Form.Select
                name="role"
                value={newStaff.role}
                onChange={handleChange}
              >
                <option value="admin">Admin</option>
                <option value="chef">Bếp</option>
                <option value="staff_mk">Lễ tân Minh Khai</option>
                <option value="staff_ds">Lễ tân Đồ Sơn</option>
                <option value="staff_cb">Lễ tân Cát Bà</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
          <Button variant="primary" onClick={isEditMode ? handleUpdateStaff : handleCreateStaff}>
            {isEditMode ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListStaffAccount;
