import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password1: "",
        password2: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                user_permission: "member" // Kullanıcı izni her zaman "member" olacak
            };
            await axios.post("/accounts/register/", data);
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container fluid className="vh-100 d-flex justify-content-center align-items-center">
            <Row className="justify-content-center w-100">
                <Col xs={12} md={6} lg={4}>
                    <div className="register-form p-4 border rounded shadow">
                        <h2 className="text-center mb-4">Register</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" name="username" placeholder="Enter your username" onChange={handleChange} value={formData.username} />
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" placeholder="Enter your email" onChange={handleChange} value={formData.email} />
                            </Form.Group>
                            <Form.Group controlId="first_name">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" name="first_name" placeholder="Enter your first name" onChange={handleChange} value={formData.first_name} />
                            </Form.Group>
                            <Form.Group controlId="last_name">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" name="last_name" placeholder="Enter your last name" onChange={handleChange} value={formData.last_name} />
                            </Form.Group>
                            <Form.Group controlId="password1">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password1" placeholder="Enter your password" onChange={handleChange} value={formData.password1} />
                            </Form.Group>
                            <Form.Group controlId="password2">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" name="password2" placeholder="Confirm your password" onChange={handleChange} value={formData.password2} />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mt-3">Register</Button>
                        </Form>
                        <p className="text-center mt-3">Already have an account? <Link to="/login">Login here</Link></p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default RegisterPage;
