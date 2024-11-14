import { Outlet } from "react-router-dom";
import Header from "../Page/Home/Header/Header";
import Navbar from "../Page/Home/Navbar/Navbar";



const Root = () => {
    return (
        <div>
            <Header></Header>
            <Navbar></Navbar>
            <Outlet></Outlet>
        </div>
    );
};

export default Root;