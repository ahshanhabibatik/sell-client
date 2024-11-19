import { NavLink, Outlet } from "react-router-dom";
import { FaAd, FaHome, FaList, FaUser } from "react-icons/fa";
import { BsArrowsCollapseVertical } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate hook
import useAdmin from "../Hook/UseAdmin";
import { FaShoppingCart } from "react-icons/fa";

// Simple Spinner Component
const Spinner = () => (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
        <div className="border-4 border-t-4 border-indigo-500 rounded-full w-16 h-16 animate-spin"></div>
    </div>
);

const DashBoard = () => {
    const [isAdmin, isAdminLoading] = useAdmin();  // Track admin status & loading
    const [collapsed, setCollapsed] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const sidebarRef = useRef(null);
    const navigate = useNavigate();  // Initialize navigate hook

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setShowMobileMenu(false);
            }
        };

        if (showMobileMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMobileMenu]);

    // Show loading spinner if data is loading
    if (isAdminLoading) {
        return <Spinner />;
    }

    // Handle manual navigation to the Home page
    const goHome = () => {
        navigate("/");  // Redirect to home
    };

    return (
        <div className="flex min-h-screen bg-gray-100 ">

            <div className="p-4 fixed z-20 md:hidden">
                <button onClick={toggleMobileMenu} className="text-purple-600">
                    <FiMenu size={24} />
                </button>
            </div>

            <div
                ref={sidebarRef}
                className={`fixed md:relative z-10 bg-gradient-to-b from-purple-600 to-indigo-700 text-white md:min-h-screen ${collapsed ? 'w-20' : 'w-60'} ${showMobileMenu ? 'block' : 'hidden'} md:block transition-all duration-300`}
            >
                <div className="p-4 flex justify-between items-center">
                    <h2 className={`text-lg font-bold ${collapsed && 'hidden'}`}>Dashboard</h2>
                    <button onClick={toggleSidebar} className="text-white hover:text-gray-300">
                        <BsArrowsCollapseVertical size={24} />
                    </button>
                </div>

                {/* Menu items */}
                <ul className="menu space-y-2 mt-4">
                    {isAdmin ? (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard/adminHome"
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-800 text-yellow-300' : 'hover:bg-indigo-600'
                                        }`
                                    }
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <FaHome size={20} />
                                    {!collapsed && <span>Admin Home</span>}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/Users"
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-800 text-yellow-300' : 'hover:bg-indigo-600'
                                        }`
                                    }
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <FaUser size={20} />
                                    {!collapsed && <span>Manage User</span>}
                                </NavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard/userHome"
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-800 text-yellow-300' : 'hover:bg-indigo-600'
                                        }`
                                    }
                                    onClick={() => setShowMobileMenu(false)} // Close menu on click
                                >
                                    <FaHome size={20} />
                                    {!collapsed && <span>User Home</span>}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/UploadedProduct"
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-800 text-yellow-300' : 'hover:bg-indigo-600'
                                        }`
                                    }
                                    onClick={() => setShowMobileMenu(false)} // Close menu on click
                                >
                                    <FaAd size={20} />
                                    {!collapsed && <span>Upload Product</span>}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/myProduct"
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-800 text-yellow-300' : 'hover:bg-indigo-600'
                                        }`
                                    }
                                    onClick={() => setShowMobileMenu(false)} // Close menu on click
                                >
                                    <FaList size={20} />
                                    {!collapsed && <span>My Product</span>}
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/dashboard/cart"
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-indigo-800 text-yellow-300' : 'hover:bg-indigo-600'
                                        }`
                                    }
                                    onClick={() => setShowMobileMenu(false)} // Close menu on click
                                >
                                    <FaShoppingCart size={20} />
                                    {!collapsed && <span>Cart Products</span>}
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* Divider */}
                    <div className="border-t border-indigo-600 my-4"></div>

                    {/* Shared nav link */}
                    <li>
                        <button
                            onClick={goHome}  // Use goHome function to navigate
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-indigo-600`}
                        >
                            <FaHome size={20} />
                            {!collapsed && <span>Home</span>}
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main content area */}
            <div className="flex-1 p-10 bg-white md:ml-0 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default DashBoard;
