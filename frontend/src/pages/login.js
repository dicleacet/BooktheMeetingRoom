import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../slices/authSlice";
import { Container, Row } from "react-bootstrap";
import { useEffect } from "react";

const LoginPage = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("user")) {
            navigate("/home");
        }
    }, []);
    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get("username"),
            password: formData.get("password"),
        };
        axios.post("/accounts/login/", data).then((response) => {
            localStorage.setItem("user", JSON.stringify(response.data));
            dispatch(login(response.data));
            navigate("/home");
        })
        .catch((error) => {
            console.log(error);
        });
    }
    return (
        // <div>
        // <form onSubmit={handleLogin}>   
        //     <div>
        //         <label htmlFor="text">Email</label>
        //         <input type="text" name="username" id="text" />
        //     </div>
        //     <div>
        //         <label htmlFor="password">Password</label>
        //         <input type="password" name="password" id="password" />
        //     </div>
        //     <div>
        //         <button type="submit">Login</button>
        //     </div>
        // </form>
        // </div>

        <Container>
            <Row style={{height:"100vh"}} className="justify-content-center align-items-center">
                <div className="login-form">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group mb-3">
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" id="username" name="username" />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" name="password" />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </Row>
        </Container>
    );
}

export default LoginPage;