import { useContext, useEffect, useState } from "react";
import UseAxiosPublic from "../../Hook/UseAxiosPublic";
import { AuthContext } from "../../Provider/AuthProvider";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { NavLink } from "react-router-dom";
import dayjs from "dayjs"; // Import dayjs for date comparison

const MyProduct = () => {
    const axiosPublic = UseAxiosPublic();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                const res = await axiosPublic.get('/userSelfProduct');
                const userEmail = user?.email;
                if (userEmail) {
                    const filteredProducts = res.data.filter(product => product.email === userEmail);
                    // Add logic to check if the discount date has passed
                    const updatedProducts = filteredProducts.map(product => {
                        const isDiscountExpired = dayjs().isAfter(dayjs(product.discountDate));
                        return {
                            ...product,
                            discountExpired: isDiscountExpired, // Add new property
                        };
                    });
                    setProducts(updatedProducts);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        if (user?.email) {
            fetchUserProducts();
        }
    }, [axiosPublic, user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleDeleteProduct = (productId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosPublic.delete(`/userSelfProduct/${productId}`)
                    .then((res) => {
                        if (res.data.deletedCount > 0) {
                            // Remove the deleted product from the state
                            setProducts(products.filter(product => product._id !== productId));
                            Swal.fire({
                                title: "Deleted!",
                                text: "The product has been deleted.",
                                icon: "success"
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Error deleting product:", error);
                    });
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 overflow-x-auto">
            <h2 className="text-3xl font-bold text-center mb-6">My Posted Products</h2>
            <div className="border rounded-lg">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="border-b bg-gray-700 text-white">
                            <th className="py-3 px-4 text-center text-sm font-semibold">Product Name</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold">Price</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold">Available Quantity</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold">Discount</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold">Last Date</th>
                            <th className="py-3 px-4 text-center text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-3 px-4 text-center text-red-600">No products found</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id} className="border-b">
                                    <td className="py-3 px-4 text-center">{product.productName}</td>
                                    <td className="py-3 px-4 text-center">{parseFloat(product.originalPrice).toFixed(2)} TK</td>
                                    <td className="py-3 px-4 text-center">{product.availableQuantity}</td>
                                    <td className="py-3 px-4 text-center">
                                        {product.discountExpired ? (
                                            <span className="text-red-600 font-semibold">No Discount</span>
                                        ) : product.specialDiscount === "yes" ? (
                                            <span className="text-green-600 font-semibold">Discounted</span>
                                        ) : (
                                            <span className="text-red-600 font-semibold">No Discount</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">{product?.discountDate || "N/A"}</td>
                                    <td className="py-3 px-4 flex space-x-2 justify-center">
                                        <NavLink to={`/dashboard/myProduct/update/${product._id}`}>
                                            <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md shadow-md">
                                                <FaEdit />
                                            </button>
                                        </NavLink>
                                        <button
                                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md shadow-md"
                                            onClick={() => handleDeleteProduct(product._id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyProduct;
