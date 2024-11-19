
import { FaShoppingCart } from "react-icons/fa";
import UseCart from "../../../Hook/UseCart";
import { Link } from "react-router-dom";

const AddToCart = () => {
    const [cart] = UseCart();


    return (
        <div className="relative">
            <Link to={"/userCart"}>
                <button
                    className="relative p-2 bg-yellow-400 rounded-full hover:bg-yellow-500 transition duration-200 shadow-md"
                    type="button"
                >
                    <FaShoppingCart size={24} />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5 shadow">
                            {cart.length}
                        </span>
                    )}
                </button>
            </Link>


        </div>
    );
};

export default AddToCart;
