import React, { useEffect } from 'react';
import {
    createBrowserRouter, useNavigate,
  } from "react-router-dom";
import Home from './pages/home';

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
    }
  ]
  );

  export default router;