import { useState, useEffect, useContext } from "react";
import UseAxiosPublic from "../../Hook/UseAxiosPublic";
import { AuthContext } from "../../Provider/AuthProvider";

const MyBooking = () => {
    const axiosPublic = UseAxiosPublic();
    const { user } = useContext(AuthContext);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                if (!user?.email) return; // Ensure user email is available
                const response = await axiosPublic.get(`/purchases?email=${user.email}`);
                console.log("Fetched Purchases:", response.data); // Debug: Log fetched data
                setPurchases(response.data);
            } catch (error) {
                console.error("Error fetching purchases:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, [user?.email, axiosPublic]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-semibold mb-4">My Bookings</h1>
            {purchases.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-sky-400">
                                <th className="border border-gray-300 px-4 py-2">#</th>
                                <th className="border border-gray-300 px-4 py-2">Product Name</th>
                                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                                <th className="border border-gray-300 px-4 py-2">Total Price</th>
                                <th className="border border-gray-300 px-4 py-2">Shipping Address</th>
                                <th className="border border-gray-300 px-4 py-2">Order Date</th>
                                <th className="border border-gray-300 px-4 py-2">Available Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map((purchase, index) => {
                                const realQuantity = purchase.quantity?.$numberInt
                                    ? parseInt(purchase.quantity.$numberInt)
                                    : purchase.quantity;  // Extract correct quantity
                                const availableQuantity = purchase.productAvailableQuantity - realQuantity; // Calculate remaining available quantity
                                return (
                                    <tr key={purchase._id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                        <td className="border border-gray-300 px-4 py-2">{purchase.productName}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">{realQuantity}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-right">
                                            {purchase.totalPrice.toFixed(2)} /-
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {`${purchase.shippingAddress.firstName} ${purchase.shippingAddress.lastName}, 
                                            ${purchase.shippingAddress.address}, ${purchase.shippingAddress.city} (${purchase.shippingAddress.postalCode})`}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {new Date(purchase.OrderDate).toLocaleDateString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            {availableQuantity > 0 ? availableQuantity : 0} {/* Ensure it doesn't show negative */}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No purchases found.</p>
            )}
        </div>
    );
};

export default MyBooking;
