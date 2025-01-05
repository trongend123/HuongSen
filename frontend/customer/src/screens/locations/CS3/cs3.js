import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, CardTitle } from "react-bootstrap";
import { IoLocationSharp, IoWifi } from "react-icons/io5";
import "./cs3.css";
import { IoLogoNoSmoking, IoIosRestaurant } from "react-icons/io";
import { MdCleaningServices, MdFamilyRestroom } from "react-icons/md";
import { LuParkingCircle } from "react-icons/lu";
import { TbDisabled } from "react-icons/tb";
import Review from "../../../components/Reviews/review";
import axios from 'axios';
import BookingPage from "../../pageBookingByCustomer";
import { BASE_URL } from "../../../utils/config";
const CS3 = () => {
    const locationId = "66f6c59f285571f28087c16d";
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];

    const [bookingData, setBookingData] = useState({
        taxId: null,
        staffId: null,
        status: 'In Progress',
        payment: 'Chưa Thanh Toán',
        price: 0,
        checkin: today,
        checkout: tomorrow,
        note: ''
    });

    const [customerData, setCustomerData] = useState({
        fullname: '',
        email: '',
        phone: '',
        dob: ''
    });

    const [errors, setErrors] = useState({});
    const [taxes, setTaxes] = useState([]);
    const [roomCategories, setRoomCategories] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [bookingId, setBookingId] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchTaxesAndRoomCategories = async () => {
            try {
                const taxResponse = await axios.get(`${BASE_URL}/taxes`);
                const roomCategoriesResponse = await axios.get(`${BASE_URL}/roomCategories`);

                const defaultTax = taxResponse.data.find(tax => tax.code === '000000');

                if (defaultTax) {
                    setBookingData(prevData => ({
                        ...prevData,
                        taxId: defaultTax._id
                    }));
                }

                setTaxes(taxResponse.data);
                setRoomCategories(roomCategoriesResponse.data);

                const initialQuantity = {};
                roomCategoriesResponse.data.forEach(room => {
                    initialQuantity[room._id] = 0;
                });
                setQuantity(initialQuantity);

            } catch (error) {
                console.error('Error fetching taxes or room categories:', error);
            }
        };

        fetchTaxesAndRoomCategories();
    }, []);

    const handleChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value
        });
    };

    const handleQuantityChange = (e, roomId) => {
        setQuantity({
            ...quantity,
            [roomId]: e.target.value
        });
    };

    const handleCustomerChange = (e) => {
        setCustomerData({
            ...customerData,
            [e.target.name]: e.target.value
        });
    };

    const calculateTotalAmount = () => {
        let total = 0;

        const checkinDate = new Date(bookingData.checkin);
        const checkoutDate = new Date(bookingData.checkout);
        const nights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24); // Convert milliseconds to days

        roomCategories.forEach((room) => {
            const qty = quantity[room._id] || 0;
            if (qty > 0) {
                total += room.price * qty * nights;
            }
        });

        setTotalAmount(total);
    };

    useEffect(() => {
        calculateTotalAmount();
    }, [bookingData.checkin, bookingData.checkout, quantity]);

    const validateForm = () => {
        const newErrors = {};

        // Fullname validation
        if (!customerData.fullname.trim()) {
            newErrors.fullname = "Full name is required";
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(customerData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Phone validation (Vietnamese phone numbers)
        const phonePattern = /^(03|05|07|08|09)\d{8,9}$/;
        if (!phonePattern.test(customerData.phone)) {
            newErrors.phone = "Please enter a valid Vietnamese phone number (10 or 11 digits)";
        }

        // Date of Birth validation (at least 18 years old)
        const today = new Date();
        const dob = new Date(customerData.dob);
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 18 || (age === 18 && today < new Date(dob.setFullYear(today.getFullYear() - 18)))) {
            newErrors.dob = "Customer must be at least 18 years old";
        }

        // Check-in date validation
        const checkinDate = new Date(bookingData.checkin);
        if (checkinDate < today.setHours(0, 0, 0, 0)) {
            newErrors.checkin = "Check-in date cannot be in the past";
        }

        // Check-out date validation
        const checkoutDate = new Date(bookingData.checkout);
        if (checkoutDate <= checkinDate) {
            newErrors.checkout = "Check-out date must be at least 1 day after check-in";
        }

        // Room selection validation (at least one room must have quantity > 0)
        const selectedRooms = Object.values(quantity).some(qty => qty > 0);
        if (!selectedRooms) {
            newErrors.roomSelection = "Please select at least one room with a quantity greater than 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Form has errors, fix them first.");
            return;
        }

        // Rest of the submit logic
        try {
            // Calculate the total price based on room quantities and nights
            let totalPrice = 0;

            const checkinDate = new Date(bookingData.checkin);
            const checkoutDate = new Date(bookingData.checkout);
            const nights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24); // convert milliseconds to days

            roomCategories.forEach((room) => {
                const qty = quantity[room._id] || 0;
                if (qty > 0) {
                    totalPrice += room.price * qty * nights;
                }
            });

            setBookingData((prevData) => ({
                ...prevData,
                price: totalPrice,
            }));

            // if (isUpdating && bookingId) {
            //     await axios.put(`http://localhost:9999/bookings/${bookingId}`, { ...bookingData, price: totalPrice });
            //     await axios.put(`http://localhost:9999/customers/${customerId}`, customerData);

            //     const existingOrderRooms = await axios.get(`http://localhost:9999/orderRooms/booking/${bookingId}`);
            //     await handleRoomOrders(existingOrderRooms.data, customerId, bookingId);
            // } else {
            const customerResponse = await axios.post(`${BASE_URL}/customers`, customerData);
            const bookingResponse = await axios.post(`${BASE_URL}/bookings`, { ...bookingData, price: totalPrice });

            const newBookingId = bookingResponse.data._id;
            const newCustomerId = customerResponse.data._id;

            setBookingId(newBookingId);
            setCustomerId(newCustomerId);

            setIsUpdating(true);

            await handleRoomOrders([], newCustomerId, newBookingId);
            navigator.push("/listBooking");
        } catch (error) {
            console.error('Error processing booking or room orders:', error);
        }
    };

    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };
    const handleRoomOrders = async (existingOrderRooms, cusId, bookId) => {
        const orderRoomPromises = Object.entries(quantity).map(async ([roomCateId, qty]) => {
            if (qty > 0) {
                const existingOrderRoom = existingOrderRooms.find(orderRoom => orderRoom.roomCateId._id === roomCateId);
                if (existingOrderRoom) {
                    return axios.put(`${BASE_URL}/orderRooms/${existingOrderRoom._id}`, { quantity: qty });
                } else {
                    return axios.post(`${BASE_URL}/orderRooms`, {
                        roomCateId,
                        customerId: cusId,
                        bookingId: bookId,
                        quantity: qty
                    });
                }
            } else if (qty == 0) {
                const existingOrderRoom = existingOrderRooms.find(orderRoom => orderRoom.roomCateId._id === roomCateId);
                if (existingOrderRoom) {
                    return axios.delete(`${BASE_URL}/orderRooms/${existingOrderRoom._id}`);
                }
            }
            return null;
        });

        await Promise.all(orderRoomPromises);
    };
    return (
        <div className="container">
            <br/>
            <p><a href="/">Trang chủ</a> / <a href="/cs3">Nhà khách Hương Sen cơ sở Cát Bà</a></p>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                height="15px"
                width="15px"
                version="1.1"
                viewBox="0 0 53.867 53.867"
                xmlSpace="preserve"
            >
                <polygon
                    style={{ fill: "#EFCE4A" }}
                    points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182"
                />
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                height="15px"
                width="15px"
                version="1.1"
                viewBox="0 0 53.867 53.867"
                xmlSpace="preserve"
            >
                <polygon
                    style={{ fill: "#EFCE4A" }}
                    points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182"
                />
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                height="15px"
                width="15px"
                version="1.1"
                viewBox="0 0 53.867 53.867"
                xmlSpace="preserve"
            >
                <polygon
                    style={{ fill: "#EFCE4A" }}
                    points="26.934,1.318 35.256,18.182 53.867,20.887 40.4,34.013 43.579,52.549 26.934,43.798 10.288,52.549 13.467,34.013 0,20.887 18.611,18.182"
                />
            </svg>
            <h2>Nhà Khách Hương Sen cơ sở Cát Bà</h2>
            <div><IoLocationSharp /> đường Núi Ngọc, thị trấn Cát Bà, Cát Hải, Hải Phòng </div>
            <Row>
                <Col md={8}>
                    <div className="gallery-wrapper">
                        <div className="gallery">
                            <div className="big-photo">
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/593310177.jpg?k=a9de1eccb720ce49c1c728d4e170a61ac86176fe66fc1d0a14ba5a5eee6cd1d4&o=&hp=1" alt="Big Gallery Photo" />
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/567870408.jpg?k=27371f71b87b7c9ce3f291cc6c8cc0f42cec00527b2278fdb3e3d4fc2b8110ae&o=&hp=1" />
                            </div>
                            <div className="small-photos">
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/567876117.jpg?k=f95cb21780be075dc1c95c25fa3dd13e80fad61fa204b719beff72ae2128516c&o=&hp=1" alt="Small Gallery Photo 1" />
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/566929901.jpg?k=6f6814cc043b57c25e817ba0a7cf296ff6e2c41fa305930bc2bdbda731ff1053&o=&hp=1" alt="Small Gallery Photo 2" />
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/566933748.jpg?k=172df76f403386dc8c9c2918f08b2ae446d75a895ead05a6c0b471a7fa5a3470&o=&hp=1" alt="Small Gallery Photo 3" />
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/566929762.jpg?k=3fe4e9c3bc7e380d3ce637950dac2ab3db55cbd75b27eadf8a774ab472bc8b3a&o=&hp=1" alt="Small Gallery Photo 4" />
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/537943768.jpg?k=31641926c5354eff8417c8e0c6b1f4d853e1d10fe2b7c520a02be9a98a9f3046&o=&hp=1" alt="Small Gallery Photo 5" />
                                <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/566933312.jpg?k=6e307cc2ee27ca8636ebd2def92a1462845fc0c2117471a99ccd82584f20f0d2&o=&hp=1" alt="Small Gallery Photo 5" />
                            </div>
                        </div>
                    </div>
                    <br />
                    <div>
                        <div className="description">
                            <span>
                                {isExpanded
                                    ? (
                                        <>
                                            Nhà khách Hương Sen - cơ sở Cát Bà tọa lạc tại đường Núi Ngọc, nằm đối diện quảng trường và là trung tâm của đảo Cát Bà. Quý khách không chỉ có thể tận hưởng những dịch vụ du lịch mà còn được trải nghiệm những văn hóa truyền thống của con người nơi đây. Đây cùng là cơ sở được đặt phòng nhiều nhất mỗi đợt hè hàng năm và nhận được rất nhiều đánh giá tích cực của du khách trong và ngoài nước
                                        </>
                                    )
                                    : (
                                        <>
                                            Nhà khách Hương Sen - cơ sở Cát Bà tọa lạc tại đường Núi Ngọc, nằm đối diện quảng trường và là trung tâm của đảo Cát Bà. 
                                        </>
                                    )}
                            </span>
                            <a className="toggle-link" onClick={handleToggle}>
                                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                            </a>
                        </div>

                    </div>
                    <br />
                    <b className="amenities-title">Các tiện nghi được ưa chuộng nhất</b>
                    <br />
                    <div className="amenities-list">
                      <span className="amenity-item">
                        <IoLogoNoSmoking className="amenity-icon" /> Phòng không hút thuốc
                      </span>
                      <span className="amenity-item">
                        <MdCleaningServices className="amenity-icon" /> Dịch vụ phòng
                      </span>
                      <span className="amenity-item">
                        <LuParkingCircle className="amenity-icon" /> Chỗ để xe miễn phí
                      </span>
                      <span className="amenity-item">
                        <IoIosRestaurant className="amenity-icon" /> Nhà hàng
                      </span>
                      <br />
                      <span className="amenity-item">
                        <IoWifi className="amenity-icon" /> Wifi miễn phí
                      </span>
                      <span className="amenity-item">
                        <TbDisabled className="amenity-icon" /> Tiện nghi cho người khuyết tật
                      </span>
                      <span className="amenity-item">
                        <MdFamilyRestroom className="amenity-icon" /> Phòng gia đình
                      </span>
                    </div>
                    <hr />
                </Col>
                <Col md={4}>
                    <Card>
                        <CardTitle>Rate: 8.5/10</CardTitle>
                        <p>Với hàng trăm đánh giá trên các trang thương mại điện tử.</p>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d233.22772948929122!2d107.05121893355414!3d20.72468936466899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1729609252406!5m2!1svi!2s"
                            width="400"
                            height="250"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Google Map"
                        ></iframe></Card>  <br/> 
                </Col>
            </Row>
            <BookingPage locationId={locationId} />
            <Review />
        </div>
    );
};

export default CS3;
