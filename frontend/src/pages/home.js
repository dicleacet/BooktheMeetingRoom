import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Col, Container, Form, FormLabel, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import logo from "../assets/images/logo.png";
import CardComponent from "../components/card";

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [show, setShow] = useState(false);
    const [room, setRoom] = useState(null);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (localStorage.getItem("user")) {
            dispatch(login(JSON.parse(localStorage.getItem("user"))));
        } else {
            dispatch(logout());
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        if (user) {
            console.log(user);
        }
    }, [user]);

    useEffect(() => {
        axios
            .get(`/api/getallrooms/`)
            .then((res) => {
                setRooms(res.data.rooms);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const logoutFunction = () => {
        dispatch(logout());
        localStorage.removeItem("user");
        navigate("/login");
    }

    const searchForRooms = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        const numberOfPeople = data.get("numberOfPeople");
        const startDate = formatDateForReq(data.get("startDate"));
        const endDate = formatDateForReq(data.get("endDate"));

        let dateTimePattern = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
        
        let schema = {
            numberOfPeople: Yup.number().typeError("Number Of People Must be a number!").required('Number Of People is required'),
            startDate: Yup.string().required('Start Date is required').matches(dateTimePattern, 'Start Date is not valid'),
            endDate: Yup.string().required('End Date is required').matches(dateTimePattern, 'End Date is not valid')    
        }

        let validationData = {
            numberOfPeople: data.get("numberOfPeople"),
            startDate: formatDateForReq(data.get("startDate")),
            endDate: formatDateForReq(data.get("endDate")),
        }

        const validation = Yup.object().shape(schema);

        let control = validation.validate(validationData).then((res) => {
        }).catch((err) => {
            toast.error(err.message);
            return false
        })

        if (!control) {
            return;
        }

        axios.get(`/api/availablerooms/?numberOfPeople=${numberOfPeople}&startDate=${startDate}&endDate=${endDate}`)
        .then((res)=>{
            toast.success("Rooms are found");
            setRooms(res.data.avaliableRooms);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const bookRoom = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);

        const numberOfPeople = data.get("numberOfPeople");
        const startDate = formatDateForReq(data.get("startDate"));
        const endDate = formatDateForReq(data.get("endDate"));

        let dateTimePattern = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;

        let schema = {
            numberOfPeople: Yup.number().typeError("Number Of People Must be a number!").required('Number Of People is required'),
            startDate: Yup.string().required('Start Date is required').matches(dateTimePattern, 'Start Date is not valid'),
            endDate: Yup.string().required('End Date is required').matches(dateTimePattern, 'End Date is not valid')    
        }

        let validationData = {
            numberOfPeople: data.get("numberOfPeople"),
            startDate: formatDateForReq(data.get("startDate")),
            endDate: formatDateForReq(data.get("endDate")),
        }

        const validation = Yup.object().shape(schema);

        let control = validation.validate(validationData).then((res) => {
            console.log(validationData);
        }).catch((err) => {
            toast.error(err.message);
            return false
        })

        if (!control) {
            return;
        }

        axios.post(`/api/bookroom/`, {
            numberOfPeople: numberOfPeople,
            between:[
                startDate,
                endDate,
            ],
            roomId: room.id
        },
        {
            headers: {
                Authorization: `Bearer ${user.access}`
            }
        })
        .then((res)=>{
            toast.success("Room is booked");
            handleClose();
            // setRooms(res.data.avaliableRooms);
        })
        .catch((err)=>{
            toast.error(err?.response?.data?.non_field_errors[0]);
            console.log(err);
        })
    }

    const goHome = () => {
        axios.get(`/api/getallrooms/`)
        .then((res)=>{
            setRooms(res.data.rooms);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const hour = d.getHours();
        const minute = d.getMinutes();
        const second = d.getSeconds();
        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    }

    const formatDateForReq = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const hour = d.getHours();
        const minute = d.getMinutes();
        const second = d.getSeconds();
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    return (
        <Container fluid className="px-5">
            <Row className="mt-3">
                <Col md={3}>
                    <img src={logo} style={{width:100,objectFit:"contain",cursor:"pointer"}} onClick={()=>goHome()} />
                </Col>
                <Col md={6}>
                    <Form className="d-flex justify-content-center gap-3" onSubmit={searchForRooms}>
                        <Form.Group className="mb-3">
                            <Form.Control type="number" placeholder="Number of People" name="numberOfPeople"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control type="datetime-local" name="startDate" />
                        </Form.Group>
                        -
                        <Form.Group className="mb-3">
                            <Form.Control type="datetime-local" name="endDate" />
                        </Form.Group>

                        <Button type="submit" style={{height:"fit-content"}}>
                            Search
                        </Button>

                    </Form>
                </Col>
                <Col md={3} className="text-end">
                    <Button onClick={()=>logoutFunction()}>
                        Logout
                    </Button>
                </Col>
            </Row>
            
            <Container className="mt-3">
                <Row>
                    {rooms.map((room, index) => (
                        <Col key={index} md={3} className="mb-3">
                            <CardComponent
                                peopleLength={room.max_people}
                                name={room.name}
                                description={room.description ? room.description : "No Description"}
                                timestamp={`${formatDate(room.start_date)} - ${formatDate(room.end_date)}`}
                                onClick={() => {
                                    setRoom(room);
                                    handleShow();
                                }}
                            />
                        </Col>
                    ))}
                </Row>
            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Book Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="d-flex flex-column justify-content-center gap-3" onSubmit={bookRoom}>
                        <Form.Group className="mb-3">
                            <FormLabel>Number of People</FormLabel>
                            <Form.Control type="number" placeholder="numberOfPeople" name="numberOfPeople"/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FormLabel>Start Date</FormLabel>
                            <Form.Control type="datetime-local" placeholder="startDate" name="startDate" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FormLabel>End Date</FormLabel>
                            <Form.Control type="datetime-local" placeholder="endDate" name="endDate" />
                        </Form.Group>

                        <Button type="Book Room" style={{height:"fit-content"}}>
                            Book Room
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            
        </Container>
    )
};

export default Home;

