import { FaShoppingCart } from "react-icons/fa";


const AddToCart = () => {
    return (
        <div>
            <button className="relative p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 transition duration-200 shadow-md">
                <FaShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5">
                    0
                </span>
            </button>
        </div>
    );
};

export default AddToCart;