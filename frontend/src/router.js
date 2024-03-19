import React, { useEffect } from 'react';
import {
    createBrowserRouter, useNavigate,
  } from "react-router-dom";
import {Home,LoginPage} from './pages/index';
import Admin from './pages/admin';


const RedirectToLogin = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/login");
    }, []);
    return <></>
}

const El = ()=><div>head</div>

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
  ]
  );

  export default router;