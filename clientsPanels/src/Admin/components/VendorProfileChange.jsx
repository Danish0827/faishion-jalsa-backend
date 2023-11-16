import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import { AdminUrl } from '../constant';
import { FiUploadCloud, FiTrash2 } from 'react-icons/fi';

const VendorProfileChange = ({ maxFiles, ids, vendors, updateVendor }) => {
    console.log(vendors);
    const [imageId, setImageId] = useState(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [vendorProfile, setvendorProfile] = useState(vendors.vendor_profile_picture_url?.images || '');

    const onDrop = async (acceptedFiles) => {
        const formData = new FormData();
        const file = acceptedFiles[0]; // Assuming only one file is being uploaded
        formData.append('images', file);
        formData.append('ids', ids);

        try {
            const response = await fetch(`${AdminUrl}/api/vendorProfileUpdate`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('An error occurred while uploading the file.');
            }

            const responseData = await response.json();
            setImageId(responseData?.idNumbers[0]);
            setUploadedImages([responseData?.imageUrls[0]]); // Store the uploaded image details
            updateVendor()
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while uploading the file.',
            });
        }
    };

    const removeImage = async (index) => {
        try {
            let removedImage;
            // console.log(uploadedImages);
            if (uploadedImages.length > 0) {
                removedImage = uploadedImages[index];
                const updatedImages = uploadedImages.filter((_, i) => i !== index);
                setUploadedImages(updatedImages);
                setvendorProfile([])
            } else if (vendorProfile?.length > 0) {
                removedImage = vendorProfile[index];
                vendorProfile.splice(index, 1); // Remove the image from the array
                setvendorProfile([...vendorProfile]);
            } else {
                throw new Error('No images found.');
            }

            const response = await fetch(`${AdminUrl}/api/deleteVendorProfile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: ids,
                    image: removedImage,
                }),
            });

            if (!response.ok) {
                throw new Error('An error occurred while deleting the image.');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'An error occurred while removing the image.',
            });
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles });

    useEffect(() => {
        // Fetch initial data or perform any side effects
    }, []); // Empty dependency array to run the effect only once

    return (
        <div>
            <div className={`dropzone ${isDragActive ? 'active' : ''} mt-4 mb-5 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center`}>
                <div {...getRootProps()} className="h-full flex flex-col justify-center items-center">
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p className="text-gray-500 text-lg">
                            Drop the file here ...
                        </p>
                    ) : (
                        <>
                            <FiUploadCloud className="w-12 h-12 text-gray-400" />
                            <p className="text-gray-500 text-lg mb-4">
                                Drag 'n' drop an image here, or click to select an image
                            </p>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                Select Image
                            </button>
                            <p className="text-gray-400 text-sm mt-2">
                                Max files: {maxFiles}
                            </p>
                        </>
                    )}
                </div>
            </div>
            {/* Vendor's vendor profile change image */}
            {vendors.vendor_profile_picture_url && vendors.vendor_profile_picture_url?.images && vendors.vendor_profile_picture_url?.images.length > 0 && (
                <div>
                    {vendorProfile?.map((image, index) => (
                        <div key={index} className="flex items-center mt-2">
                            <img
                                src={`${AdminUrl}/uploads/vendorProfile/${image}`}
                                alt={image}
                                className="w-12 h-12 object-cover rounded-lg"
                            />
                            <span className="ml-2">{image}</span>
                            <FiTrash2
                                className="ml-2 text-gray-500 cursor-pointer"
                                onClick={() => removeImage(index)}
                            />
                        </div>
                    ))}
                </div>
            )}
            {/* Uploaded vendor profile change image */}
            {uploadedImages.length > 0 && ids === imageId && (
                <div>
                    {uploadedImages.map((image, index) => (
                        <div key={index} className="flex items-center mt-2">
                            <img
                                src={`${AdminUrl}/uploads/vendorProfile/${image}`}
                                alt={image}
                                className="w-12 h-12 object-cover rounded-lg"
                            />
                            <span className="ml-2">{image}</span>
                            <FiTrash2
                                className="ml-2 text-gray-500 cursor-pointer"
                                onClick={() => removeImage(0)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VendorProfileChange;
