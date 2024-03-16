import logo from './logo.svg';
import './App.css';
import Home from './pages/home';
import {RouterProvider, useNavigate} from "react-router-dom";
import router from './router';
import "./assets/styles/style.css"
import axios from 'axios';

axios.defaults.baseURL = "http://localhost:8000/api";

function App() {
  return (
    <>
    <RouterProvider router={router}/>
    </>
  );
}

export default App;
