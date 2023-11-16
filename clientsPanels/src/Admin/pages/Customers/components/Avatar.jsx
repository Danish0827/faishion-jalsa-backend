import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Dropdown,
  Menu,
  Modal,
  message,
  Button,
  Form,
  Select,
  Checkbox,
  Input,
  Radio,
} from "antd";
import {
  CameraOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { AdminUrl } from "../../../constant";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/20/solid";

const CustomerProfile = ({
  selectedKey,
  selectedCustomers,
  callCustomers,
  handleCancel,
}) => {
  // Mock data for the customer profile
  const [customerData, setCustomerData] = useState(
    selectedCustomers == null ? null : selectedCustomers
  );
  const [AddImage, setsetAddImage] = useState();
  const dummyProfilePictureUrl =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; // Replace with the URL of the dummy image

  const [form] = Form.useForm();
  // console.log(selectedCustomers);
  const statusOptions = [
    { label: "Pending", value: 0 },
    { label: "Blocked", value: 1 },
    { label: "Archived", value: 2 },
    { label: "Approved", value: 3 },
    { label: "Rejected", value: 4 },
  ];

  useEffect(() => {
    // Update the customerData state when the selectedCustomers prop changes
    selectedCustomers === null
      ? setCustomerData(null)
      : setCustomerData(selectedCustomers);
  }, [selectedCustomers, selectedKey]);

  const [showCameraIcon, setShowCameraIcon] = useState(false);
  const [viewPhotoModalVisible, setViewPhotoModalVisible] = useState(false);

  const fileInputRef = useRef(null);

  const handleViewProfile = () => {
    setViewPhotoModalVisible(true);
  };

  const handleChangePhoto = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (file) => {
    try {
      if (!selectedKey) {
        // Convert the file to a blob
        const reader = new FileReader();
        reader.onload = (event) => {
          const blob = new Blob([event.target.result], { type: file.type });
          const imageUrl = URL.createObjectURL(blob);

          setCustomerData({
            ...customerData,
            picture: imageUrl,
          });
          setsetAddImage(file);
        };
        reader.readAsArrayBuffer(file);
        return; // Exit the function
      }

      // Create a FormData object to send the file to the server
      const formData = new FormData();
      formData.append("picture", file);
      formData.append("key", selectedKey);

      // Send the image file to the backend using the fetch API
      const response = await fetch(`${AdminUrl}/api/uploadCustomerProfileImage`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Image upload was successful, get the URL from the response
        const imageUrl = await response.json();

        // Update the profile picture URL in the state
        setCustomerData({
          ...customerData,
          picture: `${imageUrl?.picture}`,
        });
        callCustomers();
      } else {
        // Handle error if the response status is not ok
        console.error("Image upload failed.");
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error while uploading image:", error.message);
    }
  };

  console.log(AddImage);
  const handleRemovePhoto = async () => {
    try {
      // Send the request to the backend to remove the photo
      const response = await fetch(`${AdminUrl}/api/removeCustomerProfileImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: selectedKey }),
      });

      if (response.ok) {
        // Photo removal was successful
        // Update the profile picture URL in the state to null
        setCustomerData({
          ...customerData,
          picture: null,
        });
        message.success("Profile photo has been removed successfully.");
      } else {
        // Handle error if the response status is not ok
        console.error("Failed to remove profile photo.");
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error while removing profile photo:", error.message);
    }
  };

  const avatarDropdownMenu = (
    <Menu>
      {customerData?.picture && ( // Check if picture exists and is not null or undefined
        <Menu.Item onClick={handleViewProfile} icon={<EyeOutlined />}>
          View Photo
        </Menu.Item>
      )}

      {customerData?.picture ? ( // Check if picture exists and is not null or undefined
        <Menu.Item onClick={handleChangePhoto} icon={<EditOutlined />}>
          Change Photo
        </Menu.Item>
      ) : (
        <Menu.Item onClick={handleChangePhoto} icon={<EditOutlined />}>
          Add Photo
        </Menu.Item>
      )}

      {customerData?.picture && ( // Check if picture exists and is not null or undefined
        <Menu.Item onClick={handleRemovePhoto} icon={<DeleteOutlined />}>
          Remove Photo
        </Menu.Item>
      )}
    </Menu>
  );

  useEffect(() => {
    // Update form's initial values when customerData changes
    selectedKey ? form.setFieldsValue(customerData) : form.resetFields();
  }, [customerData, selectedKey]);

  const onFinish = async (values) => {
    try {
      if (selectedKey !== null) {
        // Update existing customer details
        const updateCustomerDetails = async (values) => {
          try {
            const response = await fetch(`${AdminUrl}/api/updateCustomer`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ values, selectedKey }),
            });
            if (!response.ok) {
              throw new Error("Add request failed");
            }

            const data = await response.json();
            callCustomers();
            handleCancel();
          } catch (error) {
            console.error("Error:", error);
            throw error;
          }
        };

        updateCustomerDetails(values);
        message.success("Customer details updated successfully");
      } else {
        // Add a new customer and insert record in customer_follows table
        const addCustomerAndFollow = async (values) => {
          try {
            const response = await fetch(`${AdminUrl}/api/addCustomers`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });
            if (!response.ok) {
              throw new Error("Add request failed");
            }
            const data = await response.json();
            selectedKey = data.insertedId;
            handleImageUpload(AddImage);
            callCustomers();
            handleCancel();
          } catch (error) {
            console.error("Error:", error);
            throw error;
          }
        };

        addCustomerAndFollow(values);
        message.success("Customer added successfully");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred");
    }
  };

  return (
    <div className="">
      <div className="flex  justify-center mb-6 relative h-[200px]">
        <Dropdown
          overlay={avatarDropdownMenu}
          trigger={["hover"]}
          placement="bottomLeft"
        >
          <div
            className="relative "
            onMouseEnter={() => setShowCameraIcon(true)}
            onMouseLeave={() => setShowCameraIcon(false)}
          >
            <Avatar
              size={200}
              src={
                // customerData?.picture
                //   ? !selectedKey
                //     ? customerData.picture
                //     : (customerData.picture.includes('https://') ? `${customerData.picture}` : `${AdminUrl}/uploads/customerProfileImages/${customerData.picture}`)
                //   : dummyProfilePictureUrl
                customerData?.picture
                  ? !selectedKey
                    ? customerData.picture
                    : (customerData.picture && customerData.picture.includes('https://'))
                      ? customerData.picture
                      : `${AdminUrl}/uploads/customerProfileImages/${customerData.picture}`
                  : dummyProfilePictureUrl
              }
            />
            {showCameraIcon && (
              <div className="absolute rounded-full bottom-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                <CameraOutlined
                  style={{ fontSize: "1.5rem", color: "white" }}
                />
              </div>
            )}
          </div>
        </Dropdown>

        {/* Hidden file input to trigger file selection */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleImageUpload(e.target.files[0])}
        />

        {/* View Photo Modal */}
        <Modal
          visible={viewPhotoModalVisible}
          onCancel={() => setViewPhotoModalVisible(false)}
          footer={null}
        >
          <img
            src={`${selectedKey === null
              ? customerData?.picture
              : (customerData.picture && customerData.picture.includes('https://') ? `${customerData?.picture}` : AdminUrl +
                "/uploads/customerProfileImages/" +
                customerData?.picture)
              }`}
            alt="Profile"
            style={{ width: "100%" }}
          />
        </Modal>
      </div>
      <div>
        <Form
          form={form}
          name="userDetailsForm"
          onFinish={onFinish}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <Form.Item
              label="First Name"
              name="given_name"
              rules={[
                { required: true, message: "Please enter the first name" },
              ]}
            >
              <Input className="input-field appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="family_name"
              rules={[
                { required: true, message: "Please enter the last name" },
              ]}
            >
              <Input className="input-field appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter the email" }]}
            >
              <Input className="input-field appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[
                { required: true, message: "Please enter the phone number" },
              ]}
            >
              <Input className="input-field appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Address</h2>
            <Form.Item
              label="Address Line 1"
              name="address_line_1"
              rules={[{ required: true, message: "Please enter the address" }]}
            >
              <Input className="input-field appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
            <Form.Item label="Address Line 2" name="address_line_2">
              <Input className="input-field appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please enter the city" }]}
            >
              <Input className="input-field appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
            <Form.Item
              label="State"
              name="state"
              rules={[{ required: true, message: "Please enter the state" }]}
            >
              <Input className="input-field appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
            <Form.Item
              label="Zip Code"
              name="zip_code"
              rules={[{ required: true, message: "Please enter the zip code" }]}
            >
              <Input className="input-field appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: "Please enter the country" }]}
            >
              <Input className="input-field appearance-none rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" />
            </Form.Item>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Additional Information
            </h2>
            <Form.Item
              label="Bio"
              name="bio"
              rules={[{ required: true, message: "Please enter the Bio" }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: "Please select the status" }]}
            >
              <Radio.Group options={statusOptions} />
            </Form.Item>
          </div>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            {selectedKey ? (
              <p className="mb-4">
                After updating your account, it will again go for review.
              </p>
            ) : (
              <p className="mb-4">
                After creating your account, it will go for review.
              </p>
            )}
            <Button
              type="button"
              className="bg-blue-500 text-white"
              htmlType="submit"
            >
              {selectedKey ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CustomerProfile;
