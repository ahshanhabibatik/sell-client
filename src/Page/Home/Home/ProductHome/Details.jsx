import { useLoaderData } from "react-router-dom";
import { AuthContext } from "../../../../Provider/AuthProvider";
import { useContext } from "react";
import { FaStar } from "react-icons/fa";

const Details = () => {
    const data = useLoaderData(); // Load product data
    const { user } = useContext(AuthContext); // Get user context

    const calculateDiscountPrice = (product) => {
        const today = new Date();
        const discountDate = new Date(product.discountDate);

        if (today > discountDate || product.specialDiscount === "no") {
            return {
                showDiscount: false,
                finalPrice: product.originalPrice,
                discountPrice: null,
            };
        } else {
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

    const { showDiscount, finalPrice, discountPrice } =
        calculateDiscountPrice(data);

    return (
        <div className="bg-gray-50 py-10 px-5">
            <div className="max-w-6xl mx-auto bg-white rounded-lg  ">
                <div className="grid grid-cols-3 gap-6">
                    {/* Product Image */}
                    <div>
                        <div className=" ">
                            <img
                                src={data.image}
                                alt={data.productName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div >
                        <div className=" md:col-span-2 p-6 flex flex-col justify-between">
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-800">
                                    {data.productName}
                                </h1>

                                {/* Rating */}
                                <div className="flex items-center mt-3">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`mr-1 ${i < data.rating
                                                ? "text-yellow-500"
                                                : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                    <span className="text-gray-600 ml-2 text-sm">
                                        {data.rating} / 5
                                    </span>
                                </div>

                                {/* Pricing */}
                                <div className="mt-4">
                                    {showDiscount ? (
                                        <>
                                            <p className="text-2xl font-bold text-green-600">
                                                ৳{discountPrice}
                                            </p>
                                            <p className="text-sm text-gray-500 line-through">
                                                ৳{finalPrice}
                                            </p>
                                            <p className="text-sm text-blue-600">
                                                {data.discountPercentage}% OFF (Valid until{" "}
                                                {new Date(data.discountDate).toLocaleDateString()})
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-800">
                                            ৳{finalPrice}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}

                            </div>

                            <div className="mt-6 space-y-2">
                                <p className="text-sm">
                                    <span className="font-medium">Category:</span> {data.category}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Available Quantity:</span>{" "}
                                    {data.availableQuantity}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Location:</span> {data.location}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Seller:</span> {data.username} (
                                    {data.email})
                                </p>
                                <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                                    Order Now
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Shipping & Payment Info */}
                    <div>
                        <div className="bg-blue-50 py-6 px-2  h-full">
                            <h2 className="text-xl font-medium text-gray-800 mb-4">
                                Why Shop With Us?
                            </h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2">
                                <li>Shipping worldwide.</li>
                                <li>Free 7-day return.</li>
                                <li>Supplier provides bills.</li>
                                <li>Pay online securely.</li>
                            </ul>
                        </div>
                    </div>
                </div>


            </div>
            <div>
                <p className="mt-6 text-gray-700 leading-relaxed">
                    {data.description}
                </p>
            </div>
        </div>
    );
};

export default Details;
