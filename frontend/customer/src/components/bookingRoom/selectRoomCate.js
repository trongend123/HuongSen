import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import axios from 'axios';
import { Form, Row, Col, Card, Container } from 'react-bootstrap';

const SelectRoomCategories = forwardRef(({ checkin, checkout, customerID, onQuantityChange, onTotalRoomsRemaining, locationId, canInput }, ref) => {
    const [roomCategories, setRoomCategories] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [remainingRooms, setRemainingRooms] = useState({});
    const [nights, setNights] = useState(1);
    const [selectedRooms, setSelectedRooms] = useState([]);

    // Calculate the number of nights between checkin and checkout
    useEffect(() => {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const diffTime = checkoutDate - checkinDate;
        const calculatedNights = diffTime / (1000 * 60 * 60 * 24);
        setNights(calculatedNights > 0 ? calculatedNights : 1);
    }, [checkin, checkout]);

    // Fetch room categories and remaining room data based on checkin and checkout dates
    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const roomCategoriesResponse = await axios.get('http://localhost:9999/roomCategories');
                const filteredRoomCategories = roomCategoriesResponse.data.filter(room => room.locationId._id === locationId);
                setRoomCategories(filteredRoomCategories);

                const bookedRoomsResponse = await axios.get(`http://localhost:9999/orderRooms/totalbycategory/?checkInDate=${checkin}&checkOutDate=${checkout}`);
                const bookedRoomsMap = {};
                bookedRoomsResponse.data.forEach(item => {
                    bookedRoomsMap[item.roomCateId] = item.totalRooms;
                });

                const totalRoomsResponse = await axios.get('http://localhost:9999/rooms/category/totals');
                const initialRemainingRooms = {};
                totalRoomsResponse.data.categoryTotals.forEach(room => {
                    const totalRooms = room.totalRooms;
                    const bookedRooms = bookedRoomsMap[room.roomCateId] || 0;
                    initialRemainingRooms[room.roomCateId] = totalRooms - bookedRooms;
                });
                setRemainingRooms(initialRemainingRooms);
                const totalRoomsRemaining = Object.values(initialRemainingRooms).reduce((sum, rooms) => sum + rooms, 0);
                onTotalRoomsRemaining(totalRoomsRemaining);
            } catch (error) {
                console.error('Error fetching room data:', error);
            }
        };

        fetchRoomData();
    }, [checkin, checkout, onTotalRoomsRemaining, locationId]);

    // Handle room quantity change
    const handleQuantityChange = (e, roomId) => {
        const value = Math.max(0, Math.min(e.target.value, remainingRooms[roomId] || 0));
        setQuantity({
            ...quantity,
            [roomId]: value
        });

        const room = roomCategories.find(room => room._id === roomId);
        const price = room.price * value * nights;

        setSelectedRooms(prevSelectedRooms => {
            const updatedRooms = [...prevSelectedRooms];
            const roomIndex = updatedRooms.findIndex(room => room.roomCateId === roomId);

            if (roomIndex >= 0) {
                if (value === 0) {
                    updatedRooms.splice(roomIndex, 1);
                } else {
                    updatedRooms[roomIndex].quantity = value;
                }
            } else if (value > 0) {
                updatedRooms.push({ roomCateId: roomId, quantity: value });
            }

            return updatedRooms;
        });

        onQuantityChange(roomId, value, price);
    };

    // Group rooms by locationId
    const groupedRooms = roomCategories.reduce((groups, room) => {
        const location = room.locationId?.name || 'Unknown Location';
        if (!groups[location]) {
            groups[location] = [];
        }
        groups[location].push(room);
        return groups;
    }, {});

    // Expose createOrderRoom method to the parent component using ref
    const createOrderRoom = async (bookingId) => {
        try {
            if (!selectedRooms.length) {
                alert('No rooms selected.');
                return;
            }

            const orderRoomPromises = selectedRooms.map(room => {
                return axios.post('http://localhost:9999/orderRooms', {
                    roomCateId: room.roomCateId,
                    customerId: customerID,
                    bookingId: bookingId,
                    quantity: room.quantity
                });
            });

            await Promise.all(orderRoomPromises);
            console.log('Order rooms created successfully.');
        } catch (error) {
            console.error('Error creating order rooms:', error);
            console.log('Error creating order rooms.');
        }
    };

    useImperativeHandle(ref, () => ({
        createOrderRoom,
    }));

    return (
        <div>
            {Object.keys(groupedRooms).map(location => (
                <Card key={location} className="mb-2">
                    <Card.Header className='text-center'>
                        <h5>{location}</h5>
                    </Card.Header>
                    <Card.Body>
                        {groupedRooms[location].map(room => {
                            const remainingRoomCount = remainingRooms[room._id] || 0;
                            const qty = quantity[room._id] || 0;
                            const totalRoomPrice = room.price * qty * nights;
                            if (canInput) {
                                return (
                                    <Row key={room._id} className="mb-3">
                                        <Col className="col-8">
                                            <Form.Label><strong>{room.name}</strong> - (giá 1 đêm: {room.price} VND)</Form.Label>
                                            <h6 className='text-secondary'>Phòng còn trống: {remainingRoomCount} <br />Tổng chi phí {qty} phòng: {totalRoomPrice} VND</h6>
                                        </Col>
                                        <Col className="col-2 d-flex align-items-center">

                                            <Form.Control
                                                type="number"
                                                min="0"
                                                max={remainingRoomCount}
                                                value={qty}
                                                onChange={(e) => handleQuantityChange(e, room._id)}
                                                required
                                            />

                                        </Col>
                                    </Row>
                                );
                            }
                            // Form for when `canInput` is false (static display)
                            return (
                                <Row key={room._id} className="mb-3 text-center">
                                    <Col>
                                        <h6>
                                            <strong>{room.name}</strong> - (giá 1 đêm: {room.price} VND)
                                        </h6>
                                        <p className="text-secondary mb-0">
                                            Phòng còn trống: {remainingRoomCount}
                                        </p>

                                    </Col>
                                </Row>
                            );
                        })}
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
});

export default SelectRoomCategories;
