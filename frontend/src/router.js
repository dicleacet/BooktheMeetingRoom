import React, { useEffect } from 'react';
import {
    createBrowserRouter, useNavigate,
  } from "react-router-dom";
import {Home,LoginPage,RegisterPage} from './pages/index';
import Admin from './pages/admin';


const RedirectToLogin = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/login");
    }, []);
    return <></>
}


const router = createBrowserRouter(
  [
    {
        path: "/",
        element: <RedirectToLogin />,
    },
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/admin",
        element: <Admin />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
  ]
  );

  export default router;