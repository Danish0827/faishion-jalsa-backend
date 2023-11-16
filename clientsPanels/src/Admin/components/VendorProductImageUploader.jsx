import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import { AdminUrl } from '../constant';
import { FiUploadCloud, FiTrash2 } from 'react-icons/fi';

const ImageUploader = ({ maxFiles, ids, vendors }) => {
  const [imageId, setImageId] = useState(null)
  const [uploadedImages, setUploadedImages] = useState([]);
  const [vendorsImages, setvendorsImages] = useState(vendors.products?.images);
  console.log(vendors);
  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();

    acceptedFiles.forEach((file) => {
      formData.append('images', file);
      formData.append('ids', ids);
    });

    const sendImageToBackend = async () => {
      try {
        const response = await fetch(`${AdminUrl}/api/uploadVendorDocImage`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('An error occurred while uploading the files.');
        }

        const responseData = await response.json();
        setImageId(responseData?.idNumbers[0])
        setUploadedImages(responseData?.imageUrls); // Store uploaded image details
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while uploading the files.',
        });
      }
    };

    sendImageToBackend();
  };

  const removeImage = async (index) => {
    try {
      let removedImage;

      if (uploadedImages.length > 0) {
        removedImage = uploadedImages[index];
        const updatedImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(updatedImages);
      } else if (vendors?.products?.images && vendors.products.images.length > 0) {
        console.log(index);
        removedImage = vendors.products.images[index];
        vendors.products.images.splice(index, 1); // Remove the image from the array
        setvendorsImages([...vendors.products.images])
      } else {
        throw new Error('No images found.');
      }

      const response = await fetch(`${AdminUrl}/api/deleteVendorDocImage`, {
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
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while removing the image.',
      });
    }
  };



  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles });

  useEffect(() => {
    setvendorsImages(vendors.products?.images)
    // Fetch initial data or perform any side effects
  }, [vendors]); // Empty dependency array to run the effect only once

  return (
    <div>
      <div className={`dropzone ${isDragActive ? 'active' : ''} mt-4 mb-5 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center`}>
        <div {...getRootProps()} className="h-full flex flex-col justify-center items-center">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-gray-500 text-lg">
              Drop the files here ...
            </p>
          ) : (
            <>
              <FiUploadCloud className="w-12 h-12 text-gray-400" />
              <p className="text-gray-500 text-lg mb-4">
                Drag 'n' drop some files here, or click to select files
              </p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Select Files
              </button>
              <p className="text-gray-400 text-sm mt-2">
                Max files: {maxFiles}
              </p>
            </>
          )}

        </div>
      </div>
      {/* specific vendor uploaded images  */}
      {vendors.products && vendors.products?.images && vendors.products?.images.length > 0 && (
        <div>
          {vendorsImages?.map((image, index) => (
            <div key={index} className="flex items-center mt-2">
              <img
                src={`${AdminUrl}/uploads/vendorsProductImages/${image}`}
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

      {
        uploadedImages?.length > 0 && ids == imageId && (
          <div >
            {uploadedImages.map((image, index) => (
              <div key={index} className="flex items-center mt-2">
                <img
                  src={`${AdminUrl}/uploads/vendorsProductImages/${image}`}
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
        )
      }
    </div>
  );
};

export default ImageUploader;
