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
import AllDiscountProduct from "../Page/Home/Home/ProductHome/AllDiscountProduct";
import CartProduct from "../Panel/UserPanel/CartProduct";
import UserCartProduct from "../Page/Home/Home/CartProduct/UserCartProduct";
import OrderNow from "../Page/Home/Home/CartProduct/OrderNow";
import MyBooking from "../Panel/UserPanel/MyBooking";
import Details from "../Page/Home/Home/ProductHome/Details";



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
            {
                path: "/allDiscountProduct",
                element: <AllDiscountProduct></AllDiscountProduct>,
            },
            {
                path: "/userCart",
                element: <UserCartProduct></UserCartProduct>,
            },
            {
                path: "/details/:id",
                element: <Details></Details>,
                loader: ({ params }) => fetch(`http://localhost:5000/userProduct/${params.id}`)
            },
            {
                path: "/userNow/:id",
                element: <OrderNow></OrderNow>,
                loader: ({ params }) => fetch(`http://localhost:5000/OrderNow/${params.id}`)
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
            {
                path: '/dashboard/cart',
                element: <CartProduct></CartProduct>,
            },
            {
                path: '/dashboard/myBooking',
                element: <MyBooking></MyBooking>,
            },
        ]
    }
]);

export default router;