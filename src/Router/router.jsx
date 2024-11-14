import {
    createBrowserRouter,
} from "react-router-dom";
import Root from "../Root/Root";
import Home from "../Page/Home/Home/Home";
import Login from "../Page/Login/Login";
import Register from "../Page/Register/Register";
import DashBoard from "../Layout/DashBoard";
import AdminHome from "../Panel/AdminPanel/AdminHome";
import UserHome from "../Panel/UserPanel/UserHome";
import UploadProduct from "../Panel/UserPanel/UploadProduct";
import MyProduct from "../Panel/UserPanel/MyProduct";
import MyProductUpdate from "../Panel/UserPanel/MyProductUpdate";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <Home></Home>,
            },
            {
                path: "/login",
                element: <Login></Login>,
            },
            {
                path: "/register",
                element: <Register></Register>,
            },
        ],
    },
    {
        path: "/dashboard",
        element: <DashBoard></DashBoard>,
        children: [
            {
                path: '/dashboard/adminHome',
                element: <AdminHome></AdminHome>
            },

            // user panel

            {
                path: '/dashboard/userHome',
                element: <UserHome></UserHome>
            },
            {
                path: '/dashboard/UploadedProduct',
                element: <UploadProduct></UploadProduct>
            },
            {
                path: '/dashboard/myProduct',
                element: <MyProduct></MyProduct>
            },
            {
                path: '/dashboard/myProduct/update/:id',
                element: <MyProductUpdate></MyProductUpdate>,
                loader: ({ params }) => fetch(`http://localhost:5000/userProduct/${params.id}`)
            },
        ]
    }
]);

export default router;