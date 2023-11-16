import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import { AdminUrl } from '../constant';
import { FiUploadCloud, FiTrash2 } from 'react-icons/fi';

const TrademarkUploader = ({ maxFiles, ids, vendors, updateVendor }) => {
  const [imageId, setImageId] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [trademarkCertificate, settrademarkCertificate] = useState(vendors.trademark_certificate?.images || []);

  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();

    acceptedFiles.forEach((file) => {
      formData.append('images', file);
      formData.append('ids', ids);
    });

    const sendImageToBackend = async () => {
      try {
        const response = await fetch(`${AdminUrl}/api/uploadTrademarkCertificate`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('An error occurred while uploading the files.');
        }

        const responseData = await response.json();
        setImageId(responseData?.idNumbers[0]);
        setUploadedImages(responseData?.imageUrls); // Store uploaded image details
        updateVendor()
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
      console.log(uploadedImages);
      if (uploadedImages.length > 0) {
        removedImage = uploadedImages[index];
        const updatedImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(updatedImages);
        settrademarkCertificate([])
      } else if (trademarkCertificate?.length > 0) {
        removedImage = trademarkCertificate[index];
        trademarkCertificate.splice(index, 1); // Remove the image from the array
        settrademarkCertificate([...trademarkCertificate]);
      } else {
        throw new Error('No images found.');
      }

      const response = await fetch(`${AdminUrl}/api/deleteTrademarkCertificate`, {
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
  console.log(trademarkCertificate);
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
      {/* Vendor's trademark certificate images */}
      {vendors.trademark_certificate && vendors.trademark_certificate.images && vendors.trademark_certificate.images.length > 0 && (
        <div>
          {trademarkCertificate?.map((image, index) => (
            <div key={index} className="flex items-center mt-2">
              <img
                src={`${AdminUrl}/uploads/vendorsTrademarkCertificates/${image}`}
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

      {/* Uploaded trademark certificate images */}
      {uploadedImages.length > 0 && ids === imageId && (
        <div>
          {uploadedImages.map((image, index) => (
            <div key={index} className="flex items-center mt-2">
              <img
                src={`${AdminUrl}/uploads/vendorsTrademarkCertificates/${image}`}
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
    </div>
  );
};

export default TrademarkUploader;
