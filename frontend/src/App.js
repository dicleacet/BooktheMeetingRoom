import logo from './logo.svg';
import './App.css';
import Home from './pages/home';
import {RouterProvider, useNavigate} from "react-router-dom";
import router from './router';
import "./assets/styles/style.css"
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
function App() {
  return (
    <>
    <RouterProvider router={router}/>
    <ToastContainer />
    </>
  );
}

export default App;
