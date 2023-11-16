import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { useState } from 'react';
import { AdminUrl } from '../../Admin/constant';
import { Button, Form } from 'antd';
import { IoIosArrowForward } from 'react-icons/io';
import Swal from 'sweetalert2';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

export const ProductImage = ({ formValues, selectRowProduct, callVendorProducts, handlNext }) => {

  const [files, setFiles] = useState([]);

  const handleFilePondUpdate = (fileItems) => {
    // FilePond updates the file items whenever files are added or removed
    setFiles(fileItems.map((fileItem) => fileItem.file));
  };



  const handleSubmitImages = async () => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
        formData.append('data', JSON.stringify(formValues));
      });

      const response = await fetch(`${AdminUrl}/api/uploadVendorProduct`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Handle the server response error
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Server response:', responseData);

      // Assuming the backend response contains a success flag
      if (responseData.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Product images updated successfully!',
        });
        const updatedImages = responseData.updatedImages; // Assuming the backend provides updated image paths

        selectRowProduct.images = updatedImages;
        callVendorProducts(updatedImages); // Call the function to update the displayed data
        handlNext()
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while updating product images.',
        });

      }
    } catch (error) {
      console.error('File processing error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while processing the file upload.',
      });
    }
  };

  return (
    <div>
      <FilePond
        name="files"
        files={files}
        onupdatefiles={handleFilePondUpdate}
        allowMultiple={true}
        allowImagePreview={true}
        acceptedFileTypes={['image/*']}
        labelIdle={
          '<div>Drag & Drop your files or <span className="filepond--label-action">Browse</span></div>'
        }
        maxFiles={10}
        instantUpload={false}
        server={{
          process: `${AdminUrl}/uploadVendorProduct`,
        }}
        onremovefile={(error, file) => {
          if (!error) {
            console.log('File removed:', file);
            // Make a server request here to handle the removal of the individual uploaded file
            // You can use the 'file' parameter to access the removed file
          } else {
            console.error('File removal error:', error);
          }
        }}
      />

      <Form.Item className="animate__animated animate__fadeInRight animate__faster mt-10">
        <Button
          onClick={handleSubmitImages}
          className="transition-all items-center flex duration-200 ease-in-out ml-5 bg-blue-500 hover:bg-blue-600 hover:text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transform hover:scale-110 hover:rotate-3 text-white"
          icon={<IoIosArrowForward className="text-white" />}
          style={{ zIndex: 2 }}
        >
          Submit
        </Button>
      </Form.Item>
    </div>
  );
};
