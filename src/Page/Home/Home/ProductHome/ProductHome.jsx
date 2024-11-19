import { useContext, useEffect, useState } from "react";
import UseAxiosPublic from "../../../../Hook/UseAxiosPublic";
import dayjs from "dayjs";
import { FaShoppingCart, FaHeart, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import NormalProduct from "./NormalProduct";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../Provider/AuthProvider";
import Swal from 'sweetalert2'; // Import SweetAlert2

const ProductHome = () => {
    const axiosPublic = UseAxiosPublic();
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const calculateRemainingTime = (discountDate) => {
        const discountEnd = dayjs(discountDate);
        const remainingTimeInSeconds = discountEnd.diff(dayjs(), 'seconds');
        const days = Math.floor(remainingTimeInSeconds / (24 * 60 * 60));
        const hours = Math.floor((remainingTimeInSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((remainingTimeInSeconds % (60 * 60)) / 60);
        const seconds = remainingTimeInSeconds % 60;
        return { days, hours, minutes, seconds };
    };

    const isDiscountOver = (discountDate) => {
        return dayjs().isAfter(dayjs(discountDate));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axiosPublic.get('/userProduct');
                const updatedProducts = res.data.map((product) => {
                    if (product.specialDiscount === "yes") {
                        const timeLeft = calculateRemainingTime(product.discountDate);
                        return { ...product, timeLeft, isDiscountOver: isDiscountOver(product.discountDate) };
                    }
                    return product;
                });
                setProducts(updatedProducts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [axiosPublic]);

    // Handle "Add to Cart" functionality
    const handleAddToCart = async (product) => {
        if (!user) {
            Swal.fire({
                title: 'Error!',
                text: 'You must be logged in to add products to the cart.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        if (product.productUserEmail === user?.email) {
            Swal.fire({
                title: 'Error!',
                text: 'You cannot add your own product to the cart.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        const cartItem = {
            productId: product._id,
            productUserEmail: product.email,
            productUserName: product.username,
            productUserPhone: product.phone,
            productUserLocation: product.location,
            productName: product.productName,
            productImage: product.image,
            productDescription: product.description,
            productOriginalPrice: product.originalPrice,
            productDiscountPercentage: product.discountPercentage,
            productAvailableQuantity: product.availableQuantity,
            productPrice: product.isDiscountOver
                ? product.originalPrice
                : product.originalPrice * (1 - product.discountPercentage / 100),
            userId: user._id,
            username: user.displayName,
            userEmail: user.email,
        };

        try {
            const response = await axiosPublic.post('/carts', cartItem);
            Swal.fire({
                title: 'Success!',
                text: 'Product successfully added to the cart!',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                Swal.fire({
                    title: 'Error!',
                    text: error.response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong. Please try again later.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        }
    };

    // Special and normal products
    const specialDiscountProducts = products.filter(product => product.specialDiscount === "yes" && !product.isDiscountOver);
    const normalProducts = products.filter(product => product.specialDiscount === "no" || product.isDiscountOver);
    const reversedSpecialDiscountProducts = [...specialDiscountProducts].reverse();
    const productsPerPage = 5;
    const totalPages = Math.ceil(reversedSpecialDiscountProducts.length / productsPerPage);
    const currentSpecialDiscountProducts = reversedSpecialDiscountProducts.slice(currentPage * productsPerPage, (currentPage + 1) * productsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 ">
            {loading ? (
                <p className="text-center text-gray-500">Loading products...</p>
            ) : (
                <>
                    <div className="border px-6 py-4  mb-12 bg-gradient-to-r from-teal-500 to-red-500">
                        <div>
                            <h2 className="text-3xl font-bold text-white text-center">🔥 Special Discount Products</h2>
                            <div className="flex justify-end">
                                <Link to={"AllDiscountProduct"}>
                                    <button className="bg-gradient-to-r from-teal-500 to-blue-500 text-white py-1 px-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-teal-300 mb-8">
                                        All Discount Products
                                    </button>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                                {currentSpecialDiscountProducts.map((product) => {
                                    const originalPrice = parseFloat(product.originalPrice);
                                    const discountPercentage = parseFloat(product.discountPercentage);
                                    const discountedPrice = originalPrice * (1 - discountPercentage / 100);

                                    return (
                                        <div key={product._id} className="bg-white rounded-lg group relative overflow-hidden transition-all duration-300 border border-black">
                                            <div className="relative group">
                                                <img
                                                    src={product.image}
                                                    alt={product.productName}
                                                    className="w-full h-48 object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
                                                />
                                                {!product.isDiscountOver && (
                                                    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-75 text-white py-2 px-3 rounded-b-md opacity-100 group-hover:opacity-0 transition-opacity duration-300 flex justify-center items-center">
                                                        {product.timeLeft.days}d {product.timeLeft.hours}h {product.timeLeft.minutes}m {product.timeLeft.seconds}s
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 rounded-b-md opacity-0 group-hover:opacity-100 transition-all py-2 px-3 duration-300 flex justify-center space-x-4 w-full">
                                                    <button
                                                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-lg flex items-center transition duration-200"
                                                        onClick={() => handleAddToCart(product)}
                                                        disabled={product.productUserEmail === user?.email}  // Disable button if product owner and user are the same
                                                    >
                                                        <FaShoppingCart />
                                                    </button>
                                                    <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-lg flex items-center transition duration-200">
                                                        <FaHeart />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.productName}</h3>
                                                {!product.isDiscountOver ? (
                                                    <>
                                                        <p className="text-gray-700">Discount: <span className="font-semibold">{discountPercentage}%</span></p>
                                                        <p className="text-gray-500 line-through mt-1">Original Price: ${originalPrice.toFixed(2)}</p>
                                                        <p className="text-blue-600 font-bold mt-1">New Price: {discountedPrice.toFixed(2)} TK</p>
                                                    </>
                                                ) : (
                                                    <p className="text-red-600 font-bold mt-1">Discount time is over. Price: {originalPrice.toFixed(2)} TK</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex justify-between mt-8">
                            <button onClick={handlePreviousPage} disabled={currentPage === 0} className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-full flex items-center">
                                <FaArrowLeft />
                            </button>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages - 1} className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-full flex items-center">
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>

                    <NormalProduct />
                </>
            )}
        </div>
    );
};

export default ProductHome;
