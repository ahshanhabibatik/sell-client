import { useContext, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { AuthContext } from "../../../../Provider/AuthProvider";

const OrderNow = () => {
    const data = useLoaderData();
    const { user } = useContext(AuthContext);

    // Initialize quantity and available quantity state
    const [quantity, setQuantity] = useState(0);  // Start quantity at 0
    const [availableQuantity, setAvailableQuantity] = useState(data.productAvailableQuantity);

    const handleIncrease = () => {
        if (quantity <= availableQuantity) {
            setQuantity(quantity + 1);
            setAvailableQuantity(availableQuantity - 1); // Decrease available quantity
        }
    };

    const handleDecrease = () => {
        if (quantity > 0) {  // Allow decreasing until 0
            setQuantity(quantity - 1);
            setAvailableQuantity(availableQuantity + 1); // Increase available quantity
        }
    };

    const handleInputChange = (event) => {
        const newQuantity = parseInt(event.target.value, 10);

        // Only allow input that is between 0 and availableQuantity
        if (newQuantity >= 0 && newQuantity <= data.productAvailableQuantity) {
            setQuantity(newQuantity);
            setAvailableQuantity(data.productAvailableQuantity - newQuantity); // Update available quantity
        }
    };

    const totalPrice = data.productPrice * quantity;

    return (
        <div className="flex flex-col lg:flex-row justify-between gap-8 p-6">
            {/* Left Side: Contact Information & Shipping Address */}
            <div className="w-full lg:w-1/2 p-4 border rounded-md bg-white shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2">
                            <input type="email" id="email" name="email" className="w-full p-3 border rounded-md"
                                defaultValue={user?.email}
                                readOnly />
                        </div>
                        <div className="w-full md:w-1/2">
                            <input type="text" id="phone" name="phone" className="w-full p-3 border rounded-md" placeholder="Enter your phone number" required/>
                        </div>
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="w-full md:w-1/2">
                                <input type="text" id="first-name" name="first-name" className="w-full p-3 border rounded-md" placeholder="First Name" />
                            </div>
                            <div className="w-full md:w-1/2">
                                <input type="text" id="last-name" name="last-name" className="w-full p-3 border rounded-md" placeholder="Last Name" required/>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/3">
                                <input type="text" id="address" name="address" className="w-full p-3 border rounded-md" placeholder="Street Address" required/>
                            </div>
                            <div className="w-full md:w-1/3">
                                <input type="text" id="city" name="city" className="w-full p-3 border rounded-md" placeholder="City" required/>
                            </div>
                            <div className="w-full md:w-1/3">
                                <input type="text" id="postal-code" name="postal-code" className="w-full p-3 border rounded-md" placeholder="Postal Code" required/>
                            </div>
                        </div>
                        <div className="w-full">
                            <input type="text" id="current-location" name="current-location" className="w-full p-3 border rounded-md" placeholder="Current Location" required/>
                        </div>
                    </div>
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
                            <button
                                onClick={handleDecrease}
                                className="px-2 py-1 text-lg bg-gray-200 rounded-l disabled:opacity-50"
                                disabled={quantity <= 0}  // Disable decrease if quantity is 0
                            >
                                -
                            </button>
                            <input
                                type="number"
                                className="w-12 text-center border-t border-b border-gray-300"
                                value={quantity}
                                onChange={handleInputChange}
                                min={0}
                                max={data.productAvailableQuantity}
                            />
                            <button
                                onClick={handleIncrease}
                                className="px-2 py-1 text-lg bg-gray-200 rounded-r disabled:opacity-50"
                                disabled={availableQuantity === 0 || quantity === data.productAvailableQuantity}  // Disable increase if quantity reaches max
                            >
                                +
                            </button>
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
