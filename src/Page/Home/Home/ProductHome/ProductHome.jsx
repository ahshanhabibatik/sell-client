import { useContext, useEffect, useState } from "react";
import UseAxiosPublic from "../../../../Hook/UseAxiosPublic";
import { FaCartPlus, FaInfoCircle, FaStar } from "react-icons/fa";
import Swal from 'sweetalert2';
import { AuthContext } from "../../../../Provider/AuthProvider";
import { NavLink } from "react-router-dom";
import '../../../../Hook/font.css'

const ProductHome = () => {
    const axiosPublic = UseAxiosPublic();
    const [products, setProducts] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axiosPublic.get("/userProduct");
                const sortedProducts = data.sort(
                    (a, b) => new Date(b.discountDate) - new Date(a.discountDate)
                );
                setProducts(sortedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [axiosPublic]);


    const calculatePrice = (product) => {
        const today = new Date();
        const discountDate = new Date(product.discountDate);

        if (today > discountDate || product.specialDiscount === "no") {
            // No discount available
            return {
                showDiscount: false,
                finalPrice: product.originalPrice,
                discountPrice: null,
            };
        } else {
            // Discount applies
            const discountPrice = (
                product.originalPrice -
                product.originalPrice * (product.discountPercentage / 100)
            ).toFixed(2);
            return {
                showDiscount: true,
                finalPrice: product.originalPrice,
                discountPrice,
            };
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    className={`mr-1 ${i <= rating ? "text-blue-500" : "text-gray-300"
                        }`}
                />
            );
        }
        return stars;
    };



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
            }).then(() => {
                window.location.reload();
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


    return (
        <div className="bg-gray-100 py-10 px-5 poppins">
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800 ">
                Our Products
            </h1>
            {/* Products Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {products.map((product) => {
                    const { showDiscount, finalPrice, discountPrice } = calculatePrice(product);

                    return (
                        <div
                            key={product._id}
                            className="bg-white rounded-lg overflow-hidden  flex flex-col justify-between h-[330px]"
                        >
                            <div>
                                <img
                                    src={product.image}
                                    alt={product.productName}
                                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                                />
                                <div className="p-4 flex-1 flex flex-col">
                                    <h2 className="text-gray-800 font-bold text-sm truncate">
                                        {product.productName}
                                    </h2>
                                    <p className="text-gray-600 mt-1 text-sm">
                                        {showDiscount ? (
                                            <>
                                                <span className="line-through text-red-500">
                                                    ৳{finalPrice}
                                                </span>
                                                <span className="font-bold text-green-500 ml-2">
                                                    ৳{discountPrice}
                                                </span>
                                                <span className="text-blue-600 ml-2 text-xs">
                                                    ({product.discountPercentage}% OFF)
                                                </span>
                                            </>
                                        ) : (
                                            <span className="font-bold text-green-500">
                                                ৳{finalPrice}
                                            </span>
                                        )}
                                    </p>

                                    {/* Product Rating */}
                                    <div className="flex items-center mt-1">
                                        {renderStars(product?.rating)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center  px-4 pb-2">
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.productUserEmail === user?.email}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    <FaCartPlus size={24} />
                                </button>
                                <NavLink to={`/details/${product._id}`}>
                                    <button className="text-gray-500 hover:text-gray-600">
                                        <FaInfoCircle size={24} />
                                    </button>
                                </NavLink>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default ProductHome;
