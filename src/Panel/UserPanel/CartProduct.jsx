import React, { useContext, useState } from "react";
import UseCart from "../../Hook/UseCart";
import { FaDeleteLeft } from "react-icons/fa6";
import { FaEye, FaShoppingCart, FaTimes } from "react-icons/fa";
import UseAxiosPublic from "../../Hook/UseAxiosPublic";
import Swal from "sweetalert2";
import { AuthContext } from "../../Provider/AuthProvider";

const CartProduct = () => {
    const [cart, setCart] = UseCart();
    const axiosPublic = UseAxiosPublic();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { user } = useContext(AuthContext);


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

    const handleView = (product) => {
        setSelectedProduct(product); // Set the product to be viewed
    };

    const handleCloseModal = () => {
        setSelectedProduct(null); // Close the modal
    };

    const handlePurchase = () => {
        Swal.fire({
            title: "Purchase Successful!",
            text: `You have purchased ${selectedProduct.productName}.`,
            icon: "success",
        });
        handleCloseModal();
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="md:text-3xl text-xl font-bold text-center mb-6">Cart Products</h1>
            {cart.length === 0 ? (
                <p className="text-center text-gray-600">No products in the cart.</p>
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
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-200"
                                            onClick={() => handleView(product)}
                                        >
                                            <FaEye />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {/* Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 relative max-h-screen overflow-y-auto">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            onClick={handleCloseModal}
                        >
                            <FaTimes size={20} />
                        </button>
                        <div className="text-center">
                            <img
                                src={selectedProduct.productImage}
                                alt={selectedProduct.productName}
                                className="w-40 h-40 mx-auto rounded object-cover shadow-md mb-4"
                            />
                            <h2 className="text-2xl font-bold mb-2">{selectedProduct.productName}</h2>
                            <p className="text-gray-600 mb-4 text-justify">{selectedProduct.productDescription || "No Description"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm md:text-base">
                            <div>
                                <p><strong>Original Price:</strong> ৳{selectedProduct.productOriginalPrice}</p>
                                <p><strong>Discount:</strong> {selectedProduct.productDiscountPercentage}%</p>
                                <p><strong>Price:</strong> ৳{Number(selectedProduct.productPrice).toFixed(2)}</p>
                                <p><strong>Seller Number:</strong> {selectedProduct.productUserPhone}</p>
                            </div>
                            <div>
                                <p><strong>Available Quantity:</strong> {selectedProduct.productAvailableQuantity}</p>
                                <p><strong>Seller Name:</strong> {selectedProduct.productUserName}</p>
                                <p><strong>Email:</strong> {selectedProduct.productUserEmail}</p>
                                <p><strong>Seller Location:</strong> {selectedProduct.productUserLocation}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                className={`${selectedProduct.productUserEmail === user?.email
                                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                    : "bg-green-500 text-white hover:bg-green-600"
                                    } px-4 py-2 rounded shadow flex items-center gap-2`}
                                onClick={handlePurchase}
                                disabled={selectedProduct.productUserEmail === user?.email}
                            >
                                <FaShoppingCart />
                                {selectedProduct.productUserEmail === user?.email ? "Cannot Purchase" : "Purchase"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CartProduct;
