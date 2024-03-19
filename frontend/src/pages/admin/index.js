import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, FormLabel, Modal, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";


const Admin = () => {
    const [bookings, setBookings] = useState([])
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState({});

    const handleAddClose = () => setShowAdd(false);
    const handleAddShow = () => setShowAdd(true);
    const handleEditClose = () => setShowEdit(false);
    const handleEditShow = () => setShowEdit(true);

    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Admin";
    }, []);

    useEffect(() => {
        if (localStorage.getItem("user")) {
            dispatch(login(JSON.parse(localStorage.getItem("user"))));
        }
        else {
            dispatch(logout());
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        if (user) {
            axios.get("/api/bookings/", {
                headers: {
                    Authorization: `Bearer ${user.access}`
                }
            }).then((response) => {
                setBookings(response.data.results);
            })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [user]);

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


    const deleteBooking = (id) => {
        axios.delete(`/api/bookings/${id}/`, {
            headers: {
                Authorization: `Bearer ${user.access}`
            }
        }).then((response) => {
            setBookings(bookings.filter(booking => booking.id !== id));
        })
            .catch((error) => {
                console.log(error);
            });
    }

    const editBooking = (index) => {
        const booking = bookings[index];
        setEditData(booking);
        handleEditShow();
    }

    const logoutFunction = () => {
        dispatch(logout());
        localStorage.removeItem("user");
        navigate("/login");
    }

    const addRoom = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            numberOfPeople: formData.get("numberOfPeople"),
            startDate: formatDateForReq(formData.get("startDate")),
            endDate: formatDateForReq(formData.get("endDate")),
        };

        let dateTimePattern = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;


        let shcema = {
            numberOfPeople: Yup.number().typeError("Number Of People Must be a number!").required('Number Of People is required'),
            startDate: Yup.string().required('Start Date is required').matches(dateTimePattern, 'Start Date is not valid'),
            endDate: Yup.string().required('End Date is required').matches(dateTimePattern, 'End Date is not valid')
        }

        const validation = Yup.object().shape(shcema);


        console.log(data);
        let control = validation.validate(data).then((res) => {
            return true;
        }).catch((err) => {
            toast.error(err.message);
            return false
        })
        if (!control) {
            return;
        }


        axios.post("/api/bookings/", {
            name: "Room",
            max_people: data.numberOfPeople,
            start_date: data.startDate,
            end_date: data.endDate,
        }, {
            headers: {
                Authorization: `Bearer ${user.access}`
            }
        }).then((response) => {
            toast.success("Room added successfully");
            setBookings([...bookings, response.data]);
            handleAddClose();
        })
            .catch((error) => {
                toast.error("An error occured while adding room");
                console.log(error);
            });
    }

    const editRoom = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get("name"),
            description: formData.get("description"),
            numberOfPeople: formData.get("numberOfPeople"),
            startDate: formatDateForReq(formData.get("startDate")),
            endDate: formatDateForReq(formData.get("endDate")),
        };

        let dateTimePattern = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;

        
        let shcema = {
            name: Yup.string().required('Name is required'),
            description: Yup.string().required('Description is required'),
            numberOfPeople: Yup.number().typeError("Number Of People Must be a number!").required('Number Of People is required'),
            startDate: Yup.string().required('Start Date is required').matches(dateTimePattern, 'Start Date is not valid'),
            endDate: Yup.string().required('End Date is required').matches(dateTimePattern, 'End Date is not valid')
        }

        const validation = Yup.object().shape(shcema);


        console.log(data);
        let control = validation.validate(data).then((res) => {
            return true;
        }).catch((err) => {
            toast.error(err.message);
            return false
        })
        if (!control) {
            return;
        }

        axios.put(`/api/bookings/${editData.id}/`, {
            name: data.name,
            description: data.description,
            max_people: data.numberOfPeople,
            start_date: data.startDate,
            end_date: data.endDate,
        }, {
            headers: {
                Authorization: `Bearer ${user.access}`
            }
        }).then((response) => {
            toast.success("Room edited successfully");
            setBookings(bookings.map(booking => booking.id === editData.id ? response.data : booking));
            handleEditClose();
        })
            .catch((error) => {
                toast.error("An error occured while editing room");
                console.log(error);
            });
    }


    const formatForDefaultValue = (date) => {
        if (!date) return ''; // Eğer tarih yoksa boş bir string döndür
    
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Ayı iki haneli sayıya dönüştür ve gerektiği takdirde başına 0 ekle
        const day = d.getDate().toString().padStart(2, '0'); // Günü iki haneli sayıya dönüştür ve gerektiği takdirde başına 0 ekle
        const hour = d.getHours().toString().padStart(2, '0'); // Saati iki haneli sayıya dönüştür ve gerektiği takdirde başına 0 ekle
        const minute = d.getMinutes().toString().padStart(2, '0'); // Dakikayı iki haneli sayıya dönüştür ve gerektiği takdirde başına 0 ekle
    
        return `${year}-${month}-${day}T${hour}:${minute}`;
    }
    

    return (
        <Container>
            <Row>
                <Col md={6} sm={6} className="mt-5 col-6">
                    <h1>Admin Page</h1>
                </Col>
                <Col  md={6} sm={6} className="mt-5 d-flex justify-content-end col-6" style={{gap:"0 10px"}}>
                    <Button onClick={handleAddShow} style={{height:"fit-content"}} variant="primary">Add</Button>
                    <Button onClick={logoutFunction} style={{height:"fit-content"}} variant="danger">Logout</Button>
                </Col>
                <Col md={12} className="mt-5" style={{ overflowX: 'auto' }}>
                    <Table striped bordered hover className="table-admin">
                        <thead>
                            <tr>
                                <th>Room ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Number of People</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                bookings?.map((booking, index) => {
                                    return (
                                        <tr key={booking.id}>
                                            <td>{booking.id}</td>
                                            <td>{booking.name}</td>
                                            <td>{booking.description}</td>
                                            <td>{formatDate(booking.start_date)}</td>
                                            <td>{formatDate(booking.end_date)}</td>
                                            <td>{booking.max_people}</td>
                                            <td className="d-flex" style={{ gap: "0 10px" }}>
                                                <Button onClick={() => editBooking(index)} variant="primary">Edit</Button>
                                                <Button onClick={() => deleteBooking(booking.id)} variant="danger">Delete</Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Modal show={showAdd} onHide={handleAddClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="d-flex flex-column justify-content-center gap-3" onSubmit={addRoom}>
                        <Form.Group className="mb-3">
                            <FormLabel>Number of People</FormLabel>
                            <Form.Control type="number" placeholder="numberOfPeople" name="numberOfPeople" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FormLabel>Start Date</FormLabel>
                            <Form.Control type="datetime-local" placeholder="startDate" name="startDate" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FormLabel>End Date</FormLabel>
                            <Form.Control type="datetime-local" placeholder="endDate" name="endDate" />
                        </Form.Group>

                        <Button type="Book Room" style={{ height: "fit-content" }}>
                            Book Room
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showEdit} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className="d-flex flex-column justify-content-center gap-3" onSubmit={editRoom}>
                        <Form.Group className="mb-3">
                            <FormLabel>Name</FormLabel>
                            <Form.Control type="text" name="name" defaultValue={editData?.name} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FormLabel>Description</FormLabel>
                            <Form.Control type="text" name="description" defaultValue={editData?.description} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FormLabel>Number of People</FormLabel>
                            <Form.Control type="number" name="numberOfPeople" defaultValue={editData?.max_people} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FormLabel>Start Date</FormLabel>
                            <Form.Control type="datetime-local" name="startDate" defaultValue={formatForDefaultValue(editData?.start_date)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <FormLabel>End Date</FormLabel>
                            <Form.Control type="datetime-local" name="endDate" defaultValue={formatForDefaultValue(editData?.end_date)}/>
                        </Form.Group>

                        <Button type="Book Room" style={{ height: "fit-content" }}>
                            Edit Room
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    )
}



export default Admin;

