import React, { useEffect } from 'react';
import {
    createBrowserRouter, useNavigate,
  } from "react-router-dom";
import {Home,LoginPage} from './pages/index';

const El = ()=><div>head</div>

const router = createBrowserRouter(
  [
    {
        path: "/",
        element: <El />,
    },
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
  ]
  );

  export default router;