import { FaHeart, FaShoppingCart } from "react-icons/fa";
import UseAxiosPublic from "../../../../Hook/UseAxiosPublic";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const NormalProduct = () => {
    const axiosPublic = UseAxiosPublic();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const isDiscountOver = (discountDate) => {
        return dayjs().isAfter(dayjs(discountDate));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axiosPublic.get('/userProduct');
                const updatedProducts = res.data.map((product) => {
                    const discountOver = isDiscountOver(product.discountDate);
                    return { ...product, discountOver }; // Add discountOver flag
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

    // Filter products that are either normal or have ended their discount
    const normalProducts = products.filter(product => product.specialDiscount === "no" || product.discountOver);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">📦 Regular Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 ">
                {normalProducts.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg transform transition-all duration-300 relative group  flex flex-col border border-black">
                        {/* Product Image */}
                        <img
                            src={product.image}
                            alt={product.productName}
                            className="w-full h-48 object-cover rounded-md mb-4 transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Buttons above the image */}
                        <div className="absolute bottom-32 left-0 right-0 flex justify-between bg-black bg-opacity-75 py-2 px-4 rounded-b-md">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-lg shadow-md flex items-center transition duration-200">
                                <FaShoppingCart />
                            </button>
                            <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-lg shadow-md hover:shadow-xl flex items-center transition duration-200">
                                <FaHeart />
                            </button>
                        </div>

                        {/* Product Info */}
                        <div className="px-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.productName}</h3>
                            <p className="text-gray-500 mt-1 font-b">Price: {parseFloat(product.originalPrice).toFixed(2)} TK</p>
                            <p className="text-gray-600 mt-2">Available Quantity: {product.availableQuantity}</p>
                            {product.discountOver && (
                                <p className="text-red-500 text-sm mt-2">Discount Time is Over</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NormalProduct;
