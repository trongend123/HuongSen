import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

// Component StaffAccount để hiển thị thông tin từng nhân viên
const StaffAccount = ({ staff, onDelete }) => {
  return (
    <tr>
      <td>{staff.username}</td>
      <td>{staff.password}</td>
      <td>{staff.email}</td>
      <td>{staff.phone}</td>
      <td>{staff.role}</td>
      <td>
        <Button variant="warning" size="sm" className="mx-1">Chỉnh sửa</Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(staff._id)}>Xóa</Button>
      </td>
    </tr>
  );
};

// Component ListStaffAccount để quản lý danh sách tài khoản nhân viên
const ListStaffAccount = () => {
  const [staffData, setStaffData] = useState([]);
  const [searchUsername, setSearchUsername] = useState(''); // Tìm kiếm theo username
  const [searchRole, setSearchRole] = useState(''); // Tìm kiếm theo role

  // Lấy dữ liệu từ API
  useEffect(() => {
    axios
      .get('http://localhost:9999/staffs')
      .then((response) => setStaffData(response.data))
      .catch((error) => console.error("Error fetching staff data:", error));
  }, []);

  // Hàm xóa nhân viên
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:9999/staffs/${id}`)
      .then(() => {
        // Cập nhật lại danh sách sau khi xóa
        setStaffData(staffData.filter(staff => staff._id !== id));
      })
      .catch((error) => console.error("Error deleting staff:", error));
  };

  // Lọc danh sách nhân viên theo username và role
  const filteredStaffData = staffData.filter(staff => {
    return (
      staff.username.toLowerCase().includes(searchUsername.toLowerCase()) &&
      (searchRole === '' || staff.role === searchRole) // Lọc theo role
    );
  });

  return (
    <Container>
      <h2 className="text-center my-4">Danh sách tài khoản nhân viên</h2>

      {/* Ô tìm kiếm */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Tìm theo tên người dùng"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)}
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="chef">Bếp</option>
            <option value="staff_mk">lễ tân Cơ sở Minh Khai</option>
            <option value="staff_ds">lễ tân Cơ sở Đồ Sơn</option>
            <option value="staff_cb">lễ tân Cơ sở Cát Bà</option>
          </Form.Select>
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
            <StaffAccount key={staff._id} staff={staff} onDelete={handleDelete} />
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListStaffAccount;
