import { useForm } from "react-hook-form";
import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import UseAxiosPublic from "../../Hook/UseAxiosPublic";
import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";

const MyProductUpdate = () => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const { id } = useParams();
    const data = useLoaderData();
    const axiosPublic = UseAxiosPublic();
    const navigate = useNavigate();
    const [productData, setProductData] = useState(null);
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
            Swal.fire("Image upload failed. Please try again.");
            throw new Error("Failed to upload image");
        }
    };

    useEffect(() => {
        if (data) {
            setProductData(data);
        }
    }, [data]);

    const onSubmit = async (updatedData) => {
        try {
            let imageUrl = productData.image;

            if (updatedData.image[0]) {
                imageUrl = await uploadImageToImageBB(updatedData.image[0]);
            }

            const productUpdate = {
                ...updatedData,
                image: imageUrl,
            };

            const response = await axiosPublic.put(`/userSelfProduct/${id}`, productUpdate);

            if (response.data.updatedId) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Product updated successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate("/dashboard/myProduct");
                reset();

            } else {
                throw new Error("Update unsuccessful");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Product update failed. Please try again.",
            });
        }
    };


    if (!productData) {
        return <div>Loading...</div>; // Add loading state until productData is available
    }
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12lg:px-8">
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Update Product</h2>
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                    {/* Username Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            {...register('username', { required: 'Username is required' })}
                            className={`w-full mt-2 p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter your username"
                            defaultValue={productData?.username}
                            readOnly
                        />

                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className={`w-full mt-2 p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            defaultValue={productData?.email}
                            readOnly
                        />

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
                            defaultValue={productData?.phone}
                        />

                    </div>

                    {/* Location Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Location</label>
                        <input
                            type="text"
                            {...register('location', { required: 'Location is required' })}
                            className={`w-full mt-2 p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}

                            defaultValue={productData?.location}

                        />

                    </div>

                    {/* Category Dropdown or Manual Input */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                            type="text"
                            {...register('category', { required: 'Product name is required' })}
                            className={`w-full mt-2 p-2 border ${errors.productName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter product name"
                            defaultValue={productData?.category}
                        />

                    </div>

                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            {...register('productName', { required: 'Product name is required' })}
                            className={`w-full mt-2 p-2 border ${errors.productName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            defaultValue={productData?.productName}
                        />

                    </div>


                    {/* Original Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Original Price</label>
                        <input
                            type="number"
                            {...register('originalPrice', { required: 'Original price is required' })}
                            className={`w-full mt-2 p-2 border ${errors.originalPrice ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            defaultValue={productData?.originalPrice}
                        />

                    </div>
                    {/*discount Percentage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Special Discount</label>
                        <div className="flex items-center mt-2">
                            <label className="mr-4">
                                <input
                                    type="radio"
                                    value="yes"
                                    {...register('specialDiscount', { required: 'Please select special discount' })}
                                    className="mr-2"
                                    defaultValue={productData?.specialDiscount}
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

                                    defaultValue={productData?.discountPercentage}

                                />

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


                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Image</label>
                        <input
                            type="file"
                            {...register('image')}
                        />

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
                            defaultValue={productData?.availableQuantity}
                        />

                    </div>

                    {/* Product Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Description</label>
                        <textarea
                            {...register('description', { required: 'Product description is required' })}
                            className={`w-full mt-2 p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            defaultValue={productData?.description}
                            rows="4"
                        />

                    </div>

                    {/* Submit Button */}
                    <div className="mt-4">
                        <button
                            type="submit"
                            className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none rounded-md"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyProductUpdate;
