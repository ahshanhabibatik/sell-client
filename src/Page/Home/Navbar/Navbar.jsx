import { Link, useLocation } from "react-router-dom";
import '../../../Hook/font.css'

const Navbar = () => {
    const location = useLocation();

    // Function to check if the current route is active
    const isActive = (path) => {
        return location.pathname === path
            ? "text-black-600 border-b-2 border-red-600"
            : "text-white";
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 shadow-lg poppins">

            <div className="flex space-x-6 text-lg">
                <Link
                    to="/"
                    className={`hover:text-yellow-300 hover:bg-blue-500 p-2 rounded-md transition duration-200 ${isActive("/")}`}
                >
                    Home
                </Link>

                <Link
                    to="/category"
                    className={`hover:text-yellow-300 hover:bg-blue-500 p-2 rounded-md transition duration-200 ${isActive("/category")}`}
                >
                    Category
                </Link>

                <Link
                    to="/shop"
                    className={`hover:text-yellow-300 hover:bg-blue-500 p-2 rounded-md transition duration-200 ${isActive("/shop")}`}
                >
                    Shop
                </Link>
            </div>

        </nav>
    );
};

export default Navbar;
