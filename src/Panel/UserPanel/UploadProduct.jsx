import { useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import { useForm } from "react-hook-form";
import UseAxiosPublic from "../../Hook/UseAxiosPublic";
import Swal from "sweetalert2";


const UploadProduct = () => {
    const { user } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm();
    const axiosPublic = UseAxiosPublic();
    const watchedSpecialDiscount = watch('specialDiscount');
    const apiKey = import.meta.env.VITE_Image_apiKe;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    // Function to upload the image to ImageBB
    const uploadImageToImageBB = async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await axiosPublic.post(image_hosting_api, formData);
            return response.data.data.url; // Returning the image URL
        } catch (error) {
            Swal.error("Image upload failed. Please try again.");
            throw new Error("Failed to upload image");
        }
    };


    const onSubmit = async (data) => {
        try {


            const imageFile = data.image[0];
            const imageUrl = await uploadImageToImageBB(imageFile);

            const formData = {
                ...data,
                image: imageUrl,
            };
            const res = await axiosPublic.post('/userProduct', formData);

            if (res.data.insertedId) {
                reset();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Product added successfully.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error("Error uploading product:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Product upload failed. Please try again.',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12lg:px-8">
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Upload Product</h2>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                    {/* Username Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            {...register('username', { required: 'Username is required' })}
                            className={`w-full mt-2 p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter your username"
                            value={user?.displayName || user?.name}
                            readOnly
                        />
                        {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className={`w-full mt-2 p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            value={user?.email || ''}
                            readOnly
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>
                    {/* Phone Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="number"
                            {...register('phone', {
                                required: 'Phone is required',
                                validate: value => value > 0 || 'Phone number cannot be negative'
                            })}
                            min="1"
                            className={`w-full mt-2 p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter your Phone Number"
                        />
                        {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                    </div>

                    {/* Location Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Location</label>
                        <input
                            type="text"
                            {...register('location', { required: 'Location is required' })}
                            className={`w-full mt-2 p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}

                            placeholder="Please write current location"

                        />
                        {errors.location && <span className="text-red-500 text-sm">{errors.location.message}</span>}
                    </div>

                    {/* Category Dropdown or Manual Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            {...register('category', { required: 'Category is required' })}
                            className={`w-full mt-2 p-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        >
                            <option value="">Select Category</option>
                            <option value="table">Mobiles</option>
                            <option value="bed">Electronics</option>
                            <option value="chair">Vehicles</option>
                            <option value="other">Hobbies</option>
                            <option value="other">Sports kids</option>
                            <option value="other">Education</option>
                            <option value="other">Room Furniture</option>
                        </select>
                        {errors.category && <span className="text-red-500 text-sm">{errors.category.message}</span>}
                    </div>

                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            {...register('productName', { required: 'Product name is required' })}
                            className={`w-full mt-2 p-2 border ${errors.productName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter product name"
                        />
                        {errors.productName && <span className="text-red-500 text-sm">{errors.productName.message}</span>}
                    </div>

                    {/* Special Discount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Special Discount</label>
                        <div className="flex items-center mt-2">
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    value="yes"
                                    {...register('specialDiscount', { required: 'Please select special discount' })}
                                    className="mr-2"
                                />
                                Yes
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="no"
                                    {...register('specialDiscount')}
                                    className="mr-2"
                                />
                                No
                            </label>
                        </div>
                        {errors.specialDiscount && <span className="text-red-500 text-sm">{errors.specialDiscount.message}</span>}
                    </div>

                    {/* Conditionally Render Discount Percentage and Date */}
                    {watchedSpecialDiscount === 'yes' && (
                        <>
                            {/* Discount Percentage */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                                <input
                                    type="number"
                                    {...register('discountPercentage', { required: 'Discount percentage is required' })}
                                    className={`w-full mt-2 p-2 border ${errors.discountPercentage ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                    placeholder="Enter discount percentage"
                                />
                                {errors.discountPercentage && <span className="text-red-500 text-sm">{errors.discountPercentage.message}</span>}
                            </div>

                            {/* Discount Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discount Last Date</label>
                                <input
                                    type="date"
                                    {...register('discountDate', { required: 'Discount date is required' })}
                                    className={`w-full mt-2 p-2 border ${errors.discountDate ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                />
                                {errors.discountDate && <span className="text-red-500 text-sm">{errors.discountDate.message}</span>}
                            </div>
                        </>
                    )}

                    {/* Original Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Original Price</label>
                        <input
                            type="number"
                            {...register('originalPrice', { required: 'Original price is required' })}
                            className={`w-full mt-2 p-2 border ${errors.originalPrice ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter original price"
                        />
                        {errors.originalPrice && <span className="text-red-500 text-sm">{errors.originalPrice.message}</span>}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Image</label>
                        <input
                            type="file"
                            {...register('image', { required: 'Product image is required' })}
                            className={`w-full mt-2 p-2 border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.image && <span className="text-red-500 text-sm">{errors.image.message}</span>}
                    </div>


                    {/* Available Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Available Quantity</label>
                        <input
                            type="number"
                            {...register('availableQuantity', {
                                required: 'Available quantity is required',
                                validate: value => value > 0 || 'Quantity cannot be negative'
                            })}
                            min="1"
                            className={`w-full mt-2 p-2 border ${errors.availableQuantity ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter available quantity"
                        />
                        {errors.availableQuantity && <span className="text-red-500 text-sm">{errors.availableQuantity.message}</span>}
                    </div>
                    {/* Product rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Rating</label>
                        <input
                            type="number"
                            {...register('rating', {
                                required: 'Product rating is required',
                                validate: value => value >= 0 && value <= 5 || 'Rating must be between 1 and 5'
                            })}
                            className={`w-full mt-2 p-2 border ${errors.rating ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter product rating (1-5)"
                            min="0"
                            max="5"
                        />
                        {errors.rating && <span className="text-red-500 text-sm">{errors.rating.message}</span>}
                    </div>

                    {/* Product Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Description</label>
                        <textarea
                            {...register('description', { required: 'Product description is required' })}
                            className={`w-full mt-2 p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter product description"
                            rows="4"
                        />
                        {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-4">
                        <button
                            type="submit"
                            className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none rounded-md"
                        >
                            Upload Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadProduct;