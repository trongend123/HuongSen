// src/components/Sidebar.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './sideBar.css';
import { MdDashboard, MdBedroomParent, MdPeople, MdLogout } from "react-icons/md";
import { RiBillFill } from "react-icons/ri";


const Sidebar = () => (
  <div className="sidebar">
    <h2>Nhà khách <br />Hương Sen</h2>
    <Nav className="flex-column">
      <NavLink className="nav-link" to="/"><MdDashboard /> Thống kê</NavLink>
      <NavLink className="nav-link" exact to="/rooms"><MdBedroomParent /> Danh sách Phòng</NavLink>
      <NavLink className="nav-link" to="/roomCate">Danh sách Loại phòng</NavLink>
      <NavLink className="nav-link" to="/bookings"><RiBillFill /> Danh sách Đặt phòng</NavLink>
      <NavLink className="nav-link" to="/createBooking"><RiBillFill /> Đặt phòng</NavLink>
      <NavLink className="nav-link" to="/staffs"><MdPeople></MdPeople> Danh sách Nhân viên</NavLink>
      <NavLink className="nav-link" to="/login"><MdLogout /> Logout</NavLink>
    </Nav>
  </div>
);

export default Sidebar;
