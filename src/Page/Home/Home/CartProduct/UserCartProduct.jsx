import { FaDeleteLeft } from "react-icons/fa6";
import UseCart from "../../../../Hook/UseCart";
import Swal from 'sweetalert2';
import UseAxiosPublic from "../../../../Hook/UseAxiosPublic";
import { NavLink } from "react-router-dom";

const UserCartProduct = () => {
    const [cart, setCart] = UseCart();
    const axiosPublic = UseAxiosPublic();


    // Handle Delete action
    const handleDeleteProduct = (productId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axiosPublic
                    .delete(`/carts/${productId}`)
                    .then((res) => {
                        if (res.data.deletedCount > 0) {
                            setCart(cart.filter((product) => product._id !== productId));
                            Swal.fire({
                                title: "Deleted!",
                                text: "The product has been deleted.",
                                icon: "success",
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Error deleting product:", error);
                        Swal.fire({
                            title: "Error!",
                            text: "Could not delete the product. Please try again.",
                            icon: "error",
                        });
                    });
            }
        });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-extrabold text-center text-black mb-8">🛒 Your Cart</h1>
            {cart.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">Your cart is empty. Start adding products!</p>
            ) : (
                <div className="border rounded-lg overflow-x-auto">
                    <table className="table-auto w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-blue-500 text-white">
                                <th className="px-4 py-3 text-center">Image</th>
                                <th className="px-4 py-3 text-center">Name</th>
                                <th className="px-4 py-3 text-center">Price</th>
                                <th className="px-4 py-3 text-center">Discount</th>
                                <th className="px-4 py-3 text-center">Available Quantity</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((product) => (
                                <tr
                                    key={product._id}
                                    className="hover:bg-gray-100 transition duration-200"
                                >
                                    <td className="px-4 py-3 flex justify-center">
                                        <img
                                            src={product.productImage || "https://via.placeholder.com/150"}
                                            alt={product.productName || "No Image"}
                                            className="w-20 h-20 rounded object-cover"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center">{product.productName || "No Name"}</td>
                                    <td className="px-4 py-3 text-center">
                                        ৳{Number(product.productPrice || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {product.productDiscountPercentage || "N/A"}%
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {product.productAvailableQuantity || "N/A"}
                                    </td>
                                    <td className="px-4 py-3 flex gap-2 justify-center">
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition duration-200"
                                            onClick={() => handleDeleteProduct(product._id)}
                                        >
                                            <FaDeleteLeft />
                                        </button>
                                        <NavLink to={`/userNow/${product._id}`}>
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-200"

                                            >
                                                Order Now
                                            </button>
                                        </NavLink>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default UserCartProduct;
