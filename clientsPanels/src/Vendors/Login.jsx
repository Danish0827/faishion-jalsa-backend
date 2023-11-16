import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminUrl, vendorDataDb } from "../Admin/constant";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { Form, Input, Button, Modal, InputNumber } from "antd";
import { useForm } from "antd/es/form/Form";

const VendorLogin = () => {
  const navigate = useNavigate();
  const [vendorLoginData, setvendorLoginData] = useState([]);
  const [error, seterror] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [response, setResponse] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    const savedEmail = Cookies.get("rememberedEmail");
    const savedPassword = Cookies.get("rememberedPassword");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const validateForm = () => {
    let isValid = true;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    // Validate password is not empty
    if (password.trim() === "") {
      setPasswordError("Password is required.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Send the email and password to the Node.js server
    try {
      const response = await fetch(`${AdminUrl}/api/vendorLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      if (data?.status === 200) {
        Cookies.set("vendorData", data.data.loggedId);
        if (rememberMe) {
          Cookies.set("rememberedEmail", email, { expires: 30 }); // Expires in 30 days
          Cookies.set("rememberedPassword", password, { expires: 30 });
        } else {
          // Clear cookies if "Remember Me" is not selected
          Cookies.remove("rememberedEmail");
          Cookies.remove("rememberedPassword");
        }
        let timerInterval;
        Swal.fire({
          title: "Logged Successfully",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
              window.location.href = "/Vendors"; // Redirect to dashboard after successful login
            }, 1500);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        });
      } else if (data?.status === 300) {
        Swal.fire({
          title: `${data?.message}`,
          icon: "error",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Report Issue",
        }).then((result) => {
          if (result.isConfirmed) {
            // Handle the action when the user clicks the "Report Issue" button
            // You can redirect the user to a reporting page or perform any other action
            // For example, you can use window.location.href to redirect to a reporting form
            window.location.href = "/report-issue";
          }
        });
      } else if (data?.error) {
        Swal.fire({
          title: "Internal Server Error..",
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          title: "Invalid Credentials",
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleForgotPassword = async (values) => {
    setResponse(true);
    try {
      // Create a data object with the user's email
      const requestData = {
        email: values.email,
      };

      // Send an HTTP POST request to the backend using fetch
      const response = await fetch(`${AdminUrl}/api/resetVendorPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the request content type
        },
        body: JSON.stringify(requestData), // Convert requestData to JSON format
      });

      if (response.ok) {
        // Password reset link sent successfully
        // You can update the UI or perform any necessary actions
        console.log("Password reset link sent successfully");
        setModalVisible(true);
        setShowForgotPassword(false);
        setResponse(false);
      } else {
        // Handle other response statuses if needed
        setResponse(false);

        Swal.fire({
          title: "Email Not Found",
          icon: "error",
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      // Handle errors or network issues
      console.error(
        "An error occurred while sending the password reset link",
        error
      );
    }
  };

  useEffect(() => {
    const vendorDataDbs = async () => {
      try {
        const jsondata = await vendorDataDb();

        if (jsondata.length > 0) {
          setvendorLoginData(jsondata);
        }
        if (jsondata?.error) {
          seterror(true);
        }
      } catch (err) {
        console.log(err);
        seterror(true);
      }
    };

    vendorLoginData?.length == 0 ||
      vendorLoginData == null ||
      vendorLoginData == undefined
      ? vendorDataDbs()
      : error
        ? Swal.fire({
          icon: "error",
          title: "Internal Server Error",
          text: "Something went wrong on the server side.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        })
        : (window.location.href = "/Vendors");
  }, [vendorLoginData]);

  const handleResetPassword = async (values) => {
    const { otp, newPassword } = values;

    try {
      // Create a data object with otp and newPassword
      const requestData = {
        otp: otp,
        newPassword: newPassword,
        email,
      };

      // Send an HTTP POST request to the backend using fetch
      const response = await fetch(`${AdminUrl}/api/updateForgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the request content type
        },
        body: JSON.stringify(requestData), // Convert requestData to JSON format
      });

      if (response.ok) {
        // Password reset successful
        // You can update the UI or perform any necessary actions
        console.log("Password reset successful");

        // Show a success SweetAlert
        Swal.fire({
          icon: "success",
          title: "Password Reset Successful",
          text: "Your password has been reset successfully.",
        });

        // Reset the form or perform any other actions
        setModalVisible(false);
        setShowForgotPassword(false);
        form.resetFields();
      } else {
        // Handle other response statuses if needed
        console.log("Error resetting password");

        // Handle different status codes with SweetAlert
        if (response.status === 401) {
          // Invalid OTP
          Swal.fire({
            icon: "error",
            title: "Invalid OTP",
            text: "The OTP you provided is invalid.",
          });
        } else if (response.status === 404) {
          // User not found
          Swal.fire({
            icon: "error",
            title: "User not found",
            text: "No user was found with the provided email.",
          });
        } else if (response.status === 500) {
          // Internal server error
          Swal.fire({
            icon: "error",
            title: "Internal Server Error",
            text: "An error occurred on the server. Please try again later.",
          });
        }
      }
    } catch (error) {
      // Handle errors or network issues
      console.error("An error occurred while resetting the password", error);

      // Show a generic error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again later.",
      });
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-[#081831]">
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <img className="w-[20vw] mx-auto mb-4" src="/logo-black.png" alt="logo" />
          <h2 className="text-xl font-semibold text-[#081831]">Vendor Login</h2>
        </div>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className={`mt-1 px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400 text-gray-900 ${emailError ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="name@company.com"
              required
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className={`mt-1 px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400 text-gray-900 ${passwordError ? "border-red-500" : "border-gray-300"
                }`}
              placeholder="••••••••"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center">
              <input
                id="remember"
                aria-describedby="remember"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 bg-gray-50 focus:ring-1 rounded focus:ring-[#081831] dark:bg-[#081831] dark:border-[#081831] dark:focus:ring-[#081831] dark:ring-offset-[#081831] text-[#081831]"
                // className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-600 dark:ring-offset-gray-800"
                required=""
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-500"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm font-medium text-[#081831] hover:underline focus:outline-none"
            >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            className="mt-6 mb-3 w-full py-3 bg-[#081831] hover:bg-[#081831] text-white font-semibold rounded-lg transition duration-300"
          >
            Sign in
          </button>
          <p className="text-center">Don't have an Account?
            <a
              href="/Vendors/SignUp"
              className="mt-6 w-full text-md font-medium text-[#081831] hover:underline focus:outline-none"
            > Sign Up
            </a>
          </p>
        </form>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 w-full max-w-md rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
            <p className="text-sm text-gray-600">
              Please provide your registered vendor email address, and we'll
              send you an OTP to reset your password
            </p>
            <div className="mt-10">
              <Form onFinish={handleForgotPassword}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email",
                    },
                    {
                      type: "email",
                      message: "Please enter a valid email",
                    },
                  ]}
                >
                  <Input
                    type="email"
                    id="forgotEmail"
                    className=" w-full border rounded-lg focus:ring-2 focus:ring-indigo-400 text-gray-900"
                    required
                    value={email}
                    onChange={handleEmailChange}
                  />
                </Form.Item>
                <Form.Item>
                  <div className="flex justify-between mt-10">
                    <Button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      htmlType="submit"
                      className="px-4 py-2 flex justify-center items-center bg-[#081831] hover:bg-[#081831] text-white font-medium rounded-lg transition duration-300"
                      disabled={!email}
                    >
                      {response ? "Sending OTP...." : "Send OTP"}
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      )}

      <Modal
        title="Reset Password"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <p className="text-sm text-gray-500 mb-4">
          An OTP has been sent to your email. Please check your inbox and enter
          the OTP to reset your password.
        </p>
        <Form form={form} layout="vertical" onFinish={handleResetPassword}>
          <Form.Item
            label="OTP"
            name="otp"
            rules={[
              {
                required: true,
                message: "Please enter the OTP",
              },
              {
                pattern: /^\d{4}$/, // Pattern to allow only 4-digit numbers
                message: "Please enter a 4-digit OTP",
              },
            ]}
          >
            <InputNumber min={0} maxLength={4} />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please enter the new password" },
              {
                min: 8, // Minimum password length
                message: "Password must be at least 8 characters long",
              },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm the new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end mt-10">
              <Button
                type="submit"
                htmlType="submit"
                className="px-4 py-2 flex justify-center items-center bg-[#081831] hover:bg-[#081831] text-white font-medium rounded-lg transition duration-300"
              >
                Reset
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default VendorLogin;
