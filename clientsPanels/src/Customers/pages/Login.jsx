import React, { useEffect, useRef, useState } from "react";
import { AdminUrl, customerDataDB } from "../../Admin/constant";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const CustomerLogin = ({ user, handleUser }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [codes, setCodes] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [visible, setvisible] = useState(false);
  const [ButtonLoading, setButtonLoading] = useState(false);
  const [userData, setCodeUser] = useState([]);

  useEffect(() => {
    // Check if all codes are filled to enable the "Submit" button
    setIsSubmitEnabled(codes.every((code) => code.length === 1));
  }, [codes]);

  const handleCodeChange = (e, index) => {
    const newCode = e.target.value.slice(0, 1); // Accept only one character
    const newCodes = [...codes];
    newCodes[index] = newCode;
    setCodes(newCodes);

    // Focus on the next input if available
    if (index < 3 && newCode.length === 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const google = () => {
    window.open(`${AdminUrl}/auth/google`, "_self");
  };

  const facebook = () => {
    window.open(`${AdminUrl}/auth/facebook`, "_self");
  };

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setButtonLoading(true);

      // Send the email and password to the backend for login
      const response = await fetch(`${AdminUrl}/api/customerLoginEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Send the form values as JSON
      });

      if (response.ok) {
        // If the response is OK (status code 200), show a success message
        const data = await response.json();
        Cookies.set("customerLoginCookies", data?.loggedid);

        handleUser(data?.customerData);
        Swal.fire({
          title: "Success",
          text: data.message, // Extracted response message
          icon: "success",
          timer: 1500, // Auto-close the pop-up after 1.5 seconds
          showConfirmButton: false,
        });
      } else {
        // If the response status is not OK, extract and display the error message
        const errorData = await response.json();
        if (errorData?.status === 301) {
          setvisible(true);
          setButtonLoading(false);
          setCodeUser(errorData?.user);

          return;
        }
        setButtonLoading(false);
        Swal.fire({
          title: "Error",
          text: errorData.message, // Extracted error message
          icon: "error",
        });
      }
    } catch (error) {
      // Handle any network or other errors that may occur
      console.error("An error occurred:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while logging in",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    const getCustomerLoginData = async () => {
      try {
        const jsondata = await customerDataDB();

        if (jsondata?.length > 0) {
          handleUser(jsondata[0]);
        }
        if (jsondata?.error) {
          console.log(jsondata?.error);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getCustomerLoginData();
  }, []);

  const handleFinish = async () => {
    const enteredCode = codes.join(""); // Combine the array of codes into a single string

    try {
      // Define the data to send in the request body
      const requestBody = {
        verificationCode: enteredCode,
        CustomerId: userData?.customer_id,
      };

      // Send the data to the backend
      const response = await fetch(
        `${AdminUrl}/verifyVerificationCodeCustomer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody), // Send the data as JSON in the request body
        }
      );

      if (response.ok) {
        // Handle the successful response from the backend
        // You can extract and process any data received from the backend here
        const responseData = await response.json();
        handleUser(userData);
        console.log("Response from backend:", responseData);
      } else {
        // Handle errors or unsuccessful responses from the backend
        console.error("Error response from backend:", response.status);
      }
    } catch (error) {
      // Handle any network or other errors that may occur
      console.error("An error occurred:", error);
    }
  };

  const handleCloseModal = () => {
    setvisible(false);
  };

  return !user ? (
    <div className="min-h-screen flex items-center bg-gray-100 justify-center bg-cover bg-center relative">
      {/* Overlay */}

      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md relative z-10">
        {/* Brand Logo */}
        {/* <div className="flex items-center justify-center mb-6">
          <img
            src={"/logo.png"}
            alt="Brand Logo"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div> */}
        <div className="flex items-center justify-center mb-6">
        <img
            src={"/logo-black.png"}
            alt="Brand Logo"
            className="h-16"
          />
          </div>

        {/* Login Form */}
        <Form name="loginForm" form={form} onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <a
              className="float-right text-sm text-gray-500"
              href="/forgot-password"
            >
              Forgot password?
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full py-2 px-4 rounded-md text-white font-semibold bg-blue-500 border border-blue-500 hover:bg-blue-700 hover:border-blue-700 hover:shadow-md transition duration-300 ease-in-out"
              size="large"
              loading={ButtonLoading} // Set the loading prop based on ButtonLoading state
            >
              Log in
            </Button>
          </Form.Item>

          {/* Sign-up Link */}
          <div className="text-center text-gray-500 mt-2">
            Don't have an account?{" "}
            <Link to="/Customers/Signup" className="text-blue-500">
              Sign up
            </Link>
          </div>
        </Form>

        {/* Or Log in with Google */}
        <div className="text-center text-gray-500 mt-4 mb-4">
          Or log in with
        </div>

        <div className="md:flex justify-center items-center">
          {/* Login with Google Button */}
          <Button
            type="default"
            onClick={google}
            className="w-full flex items-center justify-center rounded-lg bg-white border border-gray-300 hover:border-gray-400 hover:text-gray-800 p-2"
            size="large"
          >
            <img
              src="/Google.webp"
              alt="Login with Google"
              className="w-5 mr-2"
            />
            <span className="font-bold text-gray-500 text-sm">
              Login with Google
            </span>
          </Button>

          {/* Login with Facebook Button */}
          <Button
            type="default"
            onClick={facebook}
            className="w-full flex items-center justify-center rounded-lg  text-white p-2 max-md:mt-2 md:ml-2"
            size="large"
          >
            <img
              src="/Facebook.webp"
              alt="Login with Facebook"
              className="w-5 mr-2"
            />
            <span className="font-bold text-gray-500 text-sm">
              Login with Facebook
            </span>
          </Button>
        </div>
      </div>

      <Modal
        title="Enter 4-Digit Code"
        visible={visible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            className="bg-green-500 text-white hover:text-white"
            onClick={handleFinish}
            disabled={!isSubmitEnabled}
          >
            Submit
          </Button>,
        ]}
      >
        <p className="mb-4">
          You have received an OTP on your Gmail. Please enter the 4-digit codes
          below:
        </p>
        <div className="mb-10  flex justify-center">
          {codes.map((code, index) => (
            <Input
              key={index}
              value={code}
              onChange={(e) => handleCodeChange(e, index)}
              maxLength={1}
              ref={(input) => (inputRefs.current[index] = input)}
              className="w-12 ml-2"
            />
          ))}
        </div>
      </Modal>
    </div>
  ) : (
    "Loading...."
  );
};

export default CustomerLogin;
