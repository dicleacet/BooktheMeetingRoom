import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserData, login } from "../slices/authSlice";
import { Container, Row } from "react-bootstrap";
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

    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            username: formData.get("username"),
            password: formData.get("password"),
        };
        axios.post("/accounts/login/", data).then((response) => {
            localStorage.setItem("user", JSON.stringify(response.data));

            axios.get("/accounts/get-data/",{
                headers: {
                    Authorization: `Bearer ${response.data.access}`
                }
            }).then((response) => {
                console.log(response.data);
                // dispatch(a);
            });

            navigate("/home");
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        if (user) {
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
        <Container>
            <Row style={{height:"100vh",overflowX:"hidden"}} className="justify-content-center align-items-center">
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