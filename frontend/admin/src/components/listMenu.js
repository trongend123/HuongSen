import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

// Component Menu để hiển thị thông tin mỗi thực đơn
const Menu = ({ menu, onDelete }) => {
  const menuString = menu.foodName.toString();
  const menuList = menuString.split(',').map(item => item.trim());

  return (
    <Col xs={12} md={6} lg={3} className="menu-col">
      <Card className="menu-card">
        <div>
          {menuList.map((menuItem, index) => (
            <li key={index}>{menuItem}</li>
          ))}
        </div>
        <b>{menu.price} VND</b>
        <Button variant="danger" onClick={() => onDelete(menu.id)}>Xóa</Button>
      </Card>
    </Col>
  );
};

// Component ListMenu với phân trang và lọc giá
const ListMenu = () => {
  const [menuData, setMenuData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 12; // Số thực đơn trên mỗi trang
  const [maxPrice, setMaxPrice] = useState(''); // Giá tối đa để lọc

  useEffect(() => {
    fetchMenuData();
  }, []);

  // Hàm lấy dữ liệu thực đơn từ API
  const fetchMenuData = () => {
    axios
      .get("http://localhost:9999/menus")
      .then((response) => setMenuData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  // Lọc menuData theo mức giá
  const filteredMenuData = menuData.filter((menu) => {
    if (maxPrice === '' || maxPrice === 0) {
      return true; // Nếu không có giá trị lọc thì trả về tất cả
    }
    return menu.price <= parseFloat(maxPrice); // Lọc theo giá
  });

  // Tính toán lại số trang sau khi lọc giá
  const totalPages = Math.ceil(filteredMenuData.length / itemsPerPage);

  // Lấy dữ liệu cho trang hiện tại sau khi đã lọc theo giá
  const currentMenuData = filteredMenuData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hàm để chuyển sang trang tiếp theo
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Hàm để quay về trang trước
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Hàm xóa thực đơn
  const handleDelete = (id) => {
    // Gửi yêu cầu xóa đến API
    axios
      .delete(`http://localhost:9999/menus/${id}`)
      .then(() => {
        // Cập nhật lại danh sách sau khi xóa
        fetchMenuData();
        // Reset về trang 1
        setCurrentPage(1);
      })
      .catch((error) => console.error("Error deleting menu:", error));
  };

  return (
    <Container>
      <h2 className="text-center my-4">Danh sách thực đơn tại nhà khách Hương Sen</h2>

      {/* Ô lọc giá */}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>Lọc theo giá (VND):</Form.Label>
        <Col sm={4}>
          <Form.Control
            type="number"
            value={maxPrice}
            placeholder="Nhập giá tối đa"
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setCurrentPage(1); // Reset về trang 1 sau khi lọc
            }}
          />
        </Col>
      </Form.Group>

      <Row className="menu-layout">
        {currentMenuData.map((menu) => (
          <Menu key={menu.id} menu={menu} onDelete={handleDelete} />
        ))}
      </Row>

      {/* Nút phân trang */}
      <div className="pagination-controls text-center mt-4">
        <Button onClick={prevPage} disabled={currentPage === 1}>
          Trang trước
        </Button>
        <span className="mx-3">
          Trang {currentPage} / {totalPages}
        </span>
        <Button onClick={nextPage} disabled={currentPage === totalPages}>
          Trang tiếp theo
        </Button>
      </div>
    </Container>
  );
};

export default ListMenu;
