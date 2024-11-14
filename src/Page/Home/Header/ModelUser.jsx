import { useEffect, useRef, useState, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Provider/AuthProvider";

const ModelUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);
    const loginButtonRef = useRef(null);
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();



    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleLogout = () => {
        logOut();
        setIsModalOpen(false);
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target) &&
                !loginButtonRef.current.contains(event.target)
            ) {
                setIsModalOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const firstName = user?.displayName?.split(" ")[0];

    return (
        <div>
            <div
                onClick={toggleModal}
                ref={loginButtonRef}
                className="cursor-pointer hover:text-gray-200 transition duration-200"
            >
                {/* Display user photo if available, otherwise show the FaUserCircle icon */}
                {user?.photoURL ? (
                    <img
                        src={user?.photoURL}
                        alt="User Avatar"
                        className="w-9 h-9 rounded-full"
                    />
                ) : (
                    <FaUserCircle size={36} />
                )}
            </div>
            {isModalOpen && (
                <div
                    ref={modalRef}
                    className="absolute right-0 mt-[20px] w-48 bg-white rounded-lg p-4 z-50 m-4 border"
                >
                    <h2 className="font-semibold mb-4 text-gray-700">
                        {user ? `Welcome, ${firstName}` : "Welcome"}
                    </h2>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        &times;
                    </button>
                    {!user ? (
                        <>
                            <button className="w-full p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 mb-4 transition duration-200">
                                <Link to="login">Login</Link>
                            </button>
                            <button className="w-full p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-200">
                                <Link to="register">Register</Link>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="w-full p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
                            >
                                <Link to="/dashboard">Dashboard</Link>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200  mt-4"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ModelUser;
