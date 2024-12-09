import { useContext, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../Provider/AuthProvider";
import UseAxiosPublic from "../../../../Hook/UseAxiosPublic";
import toast, { Toaster } from "react-hot-toast";

const OrderNow = () => {
    const data = useLoaderData();
    const { user } = useContext(AuthContext);
    const axiosPublic = UseAxiosPublic();
    const [quantity, setQuantity] = useState(0);
    const [availableQuantity, setAvailableQuantity] = useState(data.productAvailableQuantity);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [currentLocation, setCurrentLocation] = useState('');

    // Check if all required fields are filled
    const isFormValid = () => {
        return (
            phone &&
            firstName &&
            lastName &&
            address &&
            city &&
            postalCode &&
            currentLocation &&
            quantity > 0
        );
    };

    const handleInputChange = (event) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (newQuantity >= 0 && newQuantity <= data.productAvailableQuantity) {
            setQuantity(newQuantity);
            setAvailableQuantity(data.productAvailableQuantity - newQuantity);
        }
    };

    const handlePurchase = async () => {
        if (!isFormValid()) {
            toast.error("Please fill out all fields and select quantity.");
            return;
        }

        const purchaseDetails = {
            productUserEmail: data.productUserEmail,
            productUserPhone: data.productUserPhone,
            productId: data.productId,
            productName: data.productName,
            productImage: data.productImage,
            productUserLocation: data.productUserLocation,
            OrderDate: new Date().toISOString(),
            status: "pending",

            quantity,
            totalPrice: data.productPrice * quantity,
            contactInfo: {
                phone,
                email: email || user?.email,
            },
            shippingAddress: {
                firstName,
                lastName,
                address,
                city,
                postalCode,
                currentLocation,
            },
        };
        try {
            const response = await axiosPublic.post("/purchases", purchaseDetails);
            if (response.status === 200 || response.status === 201) {
                toast.success("Purchase successful!");

            } else if (response.status === 400) {
                toast.error(response.data.message);
            } else {
                toast.error("Failed to complete purchase. Try again.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        }
    };

    const totalPrice = data.productPrice * quantity;

    return (
        <div className="flex flex-col lg:flex-row justify-between gap-8 p-6">
            <Toaster />
            {/* Left Side: Contact Information & Shipping Address */}
            <div className="w-full lg:w-1/2 p-4 border rounded-md bg-white shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full p-3 border rounded-md"
                            value={email || user?.email || ''}
                            onChange={(e) => setEmail(e.target.value)}
                            readOnly={!user?.email}
                        />
                        <div className="w-full md:w-1/2">
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                className="w-full p-3 border rounded-md"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="w-full md:w-1/2">
                                <input
                                    type="text"
                                    id="first-name"
                                    name="first-name"
                                    className="w-full p-3 border rounded-md"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-1/2">
                                <input
                                    type="text"
                                    id="last-name"
                                    name="last-name"
                                    className="w-full p-3 border rounded-md"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/3">
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    className="w-full p-3 border rounded-md"
                                    placeholder="Street Address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-full md:w-1/3">
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    className="w-full p-3 border rounded-md"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="w-full md:w-1/3">
                                <input
                                    type="text"
                                    id="postal-code"
                                    name="postal-code"
                                    className="w-full p-3 border rounded-md"
                                    placeholder="Postal Code"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="w-full">
                            <input
                                type="text"
                                id="current-location"
                                name="current-location"
                                className="w-full p-3 border rounded-md"
                                placeholder="Current Location"
                                value={currentLocation}
                                onChange={(e) => setCurrentLocation(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <button
                        onClick={handlePurchase}
                        className={`w-full p-3 rounded-md text-white ${quantity === 0 || user?.email === data.productUserEmail
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        disabled={quantity === 0 || user?.email === data.productUserEmail}
                    >
                        {user?.email === data.productUserEmail
                            ? "You cannot purchase your own product"
                            : "Purchase"}
                    </button>
                </div>
            </div>

            {/* Right Side: Your Order */}
            <div className="w-full lg:w-1/2 p-4 border rounded-md bg-white shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Your Order</h2>
                <hr />
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="font-semibold">Product Name</span>
                        <span>{data.productName}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                        <span className="font-semibold">Post Email</span>
                        <span>{data.productUserEmail}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                        <span className="font-semibold">Product Price</span>
                        <span>{data.productPrice} /-</span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                        <span>Available Quantity</span>
                        <span>{availableQuantity}</span> {/* Display updated available quantity */}
                    </div>
                    <hr />
                    <div className="flex justify-between">
                        <span>Quantity you need?</span>
                        <div className="flex items-center">
                            <input
                                type="number"
                                className="w-12 text-center border-t border-b border-gray-300"
                                value={quantity}
                                onChange={handleInputChange}
                                min={0}
                                max={data.productAvailableQuantity}
                            />
                        </div>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{totalPrice} /-</span>
                    </div>
                    <hr />

                </div>
            </div>
        </div>
    );
};

export default OrderNow;
