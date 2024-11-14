import { useEffect, useState } from "react";
import UseAxiosPublic from "../../../../Hook/UseAxiosPublic";
import dayjs from "dayjs";
import { FaShoppingCart, FaHeart } from 'react-icons/fa'; // Importing icons
import NormalProduct from "./NormalProduct";

const ProductHome = () => {
    const axiosPublic = UseAxiosPublic();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // Update remaining time every second for special discount products
    useEffect(() => {
        const interval = setInterval(() => {
            setProducts((prevProducts) => {
                return prevProducts.map((product) => {
                    if (product.specialDiscount === "yes" && !product.isDiscountOver) {
                        const updatedTimeLeft = calculateRemainingTime(product.discountDate);
                        return { ...product, timeLeft: updatedTimeLeft };
                    }
                    return product;
                });
            });
        }, 1000); // Update every second

        // Clean up the interval when the component is unmounted
        return () => clearInterval(interval);
    }, []);

    // Separate products into special discount and normal products
    const specialDiscountProducts = products.filter(product => product.specialDiscount === "yes" && !product.isDiscountOver);
    const normalProducts = products.filter(product => product.specialDiscount === "no" || product.isDiscountOver);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-6">
            {loading ? (
                <p className="text-center text-gray-500">Loading products...</p>
            ) : (
                <>
                    {/* Special Discount Products */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">🔥 Special Discount Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                            {specialDiscountProducts.map((product) => {
                                const originalPrice = parseFloat(product.originalPrice);
                                const discountPercentage = parseFloat(product.discountPercentage);
                                const discountedPrice = originalPrice * (1 - discountPercentage / 100);

                                return (
                                    <div key={product._id} className="bg-white rounded-lg  group relative overflow-hidden transition-all duration-300 border border-black">
                                        {/* Image and discount time */}
                                        <div className="relative group">
                                            <img
                                                src={product.image}
                                                alt={product.productName}
                                                className="w-full h-48 object-cover rounded-md transition-transform duration-300 group-hover:scale-110"
                                            />

                                            {/* Discount Remaining Time */}
                                            {!product.isDiscountOver && (
                                                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-75 text-white py-2 px-3 rounded-b-md opacity-100 group-hover:opacity-0 transition-opacity duration-300 flex justify-center items-center">
                                                    {product.timeLeft.days}d {product.timeLeft.hours}h {product.timeLeft.minutes}m {product.timeLeft.seconds}s
                                                </div>
                                            )}

                                            {/* Add to Cart & Wishlist buttons */}
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 rounded-b-md opacity-0 group-hover:opacity-100 transition-all py-2 px-3 duration-300 flex justify-center space-x-4 w-full">
                                                <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-lg flex items-center transition duration-200">
                                                    <FaShoppingCart />
                                                </button>
                                                <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-lg flex items-center transition duration-200">
                                                    <FaHeart />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.productName}</h3>
                                            {!product.isDiscountOver ? (
                                                <>
                                                    <p className="text-gray-700">Discount: <span className="font-semibold">{discountPercentage}%</span> </p>
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

                    {/* Normal Products */}
                    <div>
                    <NormalProduct />
                         
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductHome;
