import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { getUserData, login } from "../slices/authSlice";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useEffect } from "react";

const LoginPage = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("user")) {
            dispatch(login(JSON.parse(localStorage.getItem("user"))));
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get("username"),
            password: formData.get("password"),
        };
        try {
            const response = await axios.post("/accounts/login/", data);
            ;
            const userData = await axios.get("/accounts/get-data/", {
                headers: {
                    Authorization: `Bearer ${response.data.access}`
                }
            });
            localStorage.setItem("user", JSON.stringify({...response.data, ...userData.data}));
            dispatch(login({...response.data, ...userData.data}));
            // dispatch(a);
            navigate("/home");
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (user) {
            console.log(user.user_permission);
            switch (user.user_permission) {
                case "superuser":
                    navigate("/admin");
                    break;
                case "manager":
                    navigate("/admin");
                    break;
            
                default:
                    navigate("/home");
                    break;
            }
        }
    }, [user]);

    return (
        <Container fluid className="vh-100 d-flex justify-content-center align-items-center">
            <Row className="justify-content-center w-100">
                <Col xs={12} md={6} lg={4}>
                    <div className="login-form p-4 border rounded shadow">
                        <h2 className="text-center mb-4">Login</h2>
                        <Form onSubmit={handleLogin}>
                            <Form.Group controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" name="username" placeholder="Enter your username" />
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" placeholder="Enter your password" />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mt-3">Login</Button>
                        </Form>
                        <p className="text-center mt-3">Don't have an account? <Link to="/register">Register here</Link></p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;
