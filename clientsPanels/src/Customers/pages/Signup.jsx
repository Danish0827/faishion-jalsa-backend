import React, { useRef, useState, useEffect } from "react";
import { AdminUrl } from "../../Admin/constant";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Spin } from "antd";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const PasswordPattern =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Signup = () => {
  const [isSuccess, setIsSuccess] = useState(false); // To track successful signup
  const [isLoading, setisLoading] = useState(false); // To track successful signup
  const [CustomerId, setCustomerId] = useState(null);
  const [code, setCode] = useState(["", "", "", ""]); // Array to store individual digit inputs
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [locationData, setLocationData] = useState({
    city: "",
    state: "",
    country: "",
  });

  const handleInputChange = (e, index) => {
    const inputValue = e.target.value;

    // Check if the input is a number and has a length of 1
    if (/^[0-9]*$/.test(inputValue) && inputValue.length === 1) {
      // Update the corresponding digit in the code array
      const newCode = [...code];
      newCode[index] = inputValue;
      setCode(newCode);

      // Move focus to the next input field if not the last one
      if (index < 3) {
        inputRefs[index + 1].current.focus();
      }
    } else if (inputValue === "") {
      // If the input is empty, clear it and move focus to the previous input (if not the first one)
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);

      if (index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const google = () => {
    window.open(`${AdminUrl}/auth/google`, "_self");
  };

  const facebook = () => {
    window.open(`${AdminUrl}/auth/facebook`, "_self");
  };

  // Function to fetch user location and update state
  const getUserLocation = async () => {
    try {
      const response = await fetch("http://ip-api.com/json");
      const data = await response.json();

      if (data.status === "success") {
        const city = data.city || "";
        const state = data.regionName || "";
        const country = data.country || "";

        setLocationData({ city, state, country });
      } else {
        console.error("Location data not found.");
      }
    } catch (error) {
      console.error("Error getting user location:", error.message);
    }
  };

  useEffect(() => {
    // Call the function to get user location when the component mounts
    if (locationData?.city === "") getUserLocation();
  }, [locationData]);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setisLoading(true);
      const mergedData = { ...values, ...locationData };

      // Send the email and password to the backend for login
      const response = await fetch(`${AdminUrl}/api/addcustomers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mergedData), // Send the form values as JSON
      });
      if (response.ok) {
        // If the response is OK (status code 200), show a success message
        const data = await response.json();
        setCustomerId(data?.insertedId);
        setIsSuccess(true); // Set the success state to true
        setisLoading(false);

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
        Swal.fire({
          title: "Error",
          text: errorData.message, // Extracted error message
          icon: "error",
        });
        setisLoading(false);
      }
    } catch (error) {
      // Handle any network or other errors that may occur
      console.error("An error occurred:", error);
      Swal.fire({
        title: "Error",
        text: "An error occurred while sign up",
        icon: "error",
      });
    }
  };

  const verifywithCode = async () => {
    // Send the 4-digit code along with the user's email to your backend
    const verificationCode = code.join("");

    // Send this data to your backend for verification
    try {
      const response = await fetch(
        `${AdminUrl}/verifyVerificationCodeCustomer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ CustomerId, verificationCode }),
        }
      );

      // Handle the response from the server
      if (response.ok) {
        // Verification successful, display a success message
        Swal.fire({
          icon: "success",
          title: "Verification Successful",
          text: "You can now proceed with your login!",
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect the user or perform any other action after successful verification
            window.location.href = "/Customers/Login"; // Redirect to the login page
          }
        });
      } else {
        // Verification failed, display an error message
        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: "Invalid verification code or the code has expired.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle other errors, e.g., network issues
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while verifying the code. Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-gray-100 justify-center bg-cover bg-center relative">
      {/* Overlay */}

      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md relative z-10">
        {/* Brand Logo */}
        <div className="flex items-center justify-center mb-6">
          <img
            src={"/logo-black.png"}
            alt="Brand Logo"
            className="h-16 rounded-full object-cover"
          />
        </div>

        {/* Login Form */}
        {isSuccess ? (
          <div>
            <p className="text-green-500 text-lg mb-4">
              Please check your email for a verification code. Enter the 4-digit
              code below to complete the signup process.
            </p>

            <Form onFinish={verifywithCode}>
              <div className="mb-4">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={inputRefs[index]}
                    value={digit}
                    onChange={(e) => handleInputChange(e, index)}
                    maxLength={1}
                    className="w-16 h-16 text-center ml-2 text-4xl border border-gray-300 rounded-md"
                  />
                ))}
              </div>

              <Form.Item>
                {code.every((digit) => digit !== "") ? (
                  <Button type="default" htmlType="submit">
                    Submit
                  </Button>
                ) : (
                  <Button type="default" disabled>
                    Submit
                  </Button>
                )}
              </Form.Item>
            </Form>
            <Link to="/Customers/Login" className="text-blue-500">
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <Form name="signupForm" form={form} onFinish={onFinish}>
              <Form.Item
                name="given_name"
                rules={[
                  { required: true, message: "Please enter your first name!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="First Name"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="family_name"
                rules={[
                  { required: true, message: "Please enter your last name!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Last Name"
                  size="large"
                />
              </Form.Item>
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
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                  {
                    pattern: PasswordPattern,
                    message:
                      "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&).",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Password"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Confirm Password"
                  size="large"
                />
              </Form.Item>
              <Form.Item>
                {isLoading ? (
                  <Button
                    type="primary"
                    className="w-full py-2 px-4 rounded-md text-white font-semibold bg-blue-500 border border-blue-500 hover:bg-blue-700 hover:border-blue-700 hover:shadow-md transition duration-300 ease-in-out"
                    size="large"
                    disabled
                  >
                    <Spin className="mr-2" />
                    Signing up...
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full py-2 px-4 rounded-md text-white font-semibold bg-blue-500 border border-blue-500 hover:bg-blue-700 hover:border-blue-700 hover:shadow-md transition duration-300 ease-in-out"
                    size="large"
                  >
                    Sign up
                  </Button>
                )}
              </Form.Item>

              {/* Login Link */}
              <div className="text-center text-gray-500 mt-2">
                Already have an account?{" "}
                <Link to="/Customers/Login" className="text-blue-500">
                  Log in
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
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
