// src/components/Sidebar.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './sideBar.css';

const Sidebar = () => (
  <div className="sidebar">
    <h2>Quản lý Nhà khách Hương Sen</h2>
    <Nav className="flex-column">
      <NavLink className="nav-link" to="/">Dashboard</NavLink>
      <NavLink className="nav-link" exact to="/rooms">Danh sách Phòng</NavLink>
      <NavLink className="nav-link" to="/bookings">Danh sách Đặt phòng</NavLink>
      <NavLink className="nav-link" to="/staffs">Danh sách Nhân viên</NavLink>
    </Nav>
  </div>
);

export default Sidebar;
