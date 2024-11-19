import { useState, useEffect, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import UseCart from "../../../Hook/UseCart";
import { Link } from "react-router-dom";

const AddToCart = () => {
    const [cart] = UseCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Toggle cart visibility
    const toggleCart = (event) => {
        event.preventDefault(); // Prevent page reload if inside a form
        setIsCartOpen((prev) => !prev);
    };

    // Close cart dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Sort cart to show latest added products first
    const sortedCart = [...cart].reverse();

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Cart Icon */}
            <button
                onClick={toggleCart} // Toggle cart visibility without page reload
                className="relative p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 transition duration-200 shadow-md"
                type="button" // Ensure the button doesn't trigger a form submit
            >
                <FaShoppingCart size={24} />
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5 shadow">
                        {cart.length}
                    </span>
                )}
            </button>

            {/* Cart Dropdown */}
            {isCartOpen && cart.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="bg-yellow-400 text-white font-semibold p-3">
                        Cart Items ({cart.length})
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        <ul className="divide-y divide-gray-200">
                            {sortedCart.map((item) => (
                                <li
                                    key={item._id}
                                    className="p-3 flex items-center space-x-3 hover:bg-gray-50 transition"
                                >
                                    <img
                                        src={item.productImage}
                                        alt={item.productName}
                                        className="w-14 h-14 object-cover rounded-md border"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800 truncate">
                                            {item.productName}
                                        </h4>
                                        <p className="text-gray-500 text-sm">
                                            Price: <span className="font-semibold">{item.productPrice} TK</span>
                                        </p>
                                    </div>
                                    <div className="text-red-600 font-bold text-sm">
                                        x{item.productAvailableQuantity}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* View Cart Button */}
                    <div className="p-3">
                        <Link to={"/dashboard/cart"}>
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
                                type="button" // Prevents form submission
                            >
                                View Cart
                            </button>
                        </Link>

                    </div>
                </div>
            )}
        </div>
    );
};

export default AddToCart;
