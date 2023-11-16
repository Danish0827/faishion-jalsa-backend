import React, { useState, useEffect } from 'react'
import { Steps, Button, message, theme, Select, Form, Input } from 'antd';
import Swal from "sweetalert2";
import { FiPhone, FiUser, FiCheckCircle } from "react-icons/fi"
import { MailOutlined } from "@ant-design/icons";
import { AdminUrl } from "../Admin/constant";

const description = 'This is a description.';

const VendorSignUp = () => {

    const [current, setCurrent] = useState(0);
    const { token } = theme.useToken();
    const [vendors, setVendors] = useState([]);
    const [selectedKey, setSelectedKey] = useState(null);
    const [form] = Form.useForm();

    const callVendor = async () => {
        try {
            const response = await fetch(`${AdminUrl}/api/allVendors`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // Handle successful response
                const data = await response.json();
                const sortedVendors = data.vendors.sort((a, b) => a.id - b.id);
                setVendors(sortedVendors);
            } else {
                // Handle error response
                console.error("Error sending form data:", response.statusText);
            }
        } catch (error) {
            // Handle error
            console.error("Error sending form data:", error);
        }
    };

    useEffect(() => {
        callVendor();
    }, []);


    // Verification
    const Pinfo = () => {
        const [, forceUpdate] = useState({});
        const { Option } = Select;
        const countryCodes = [
            { code: "+1", country: "United States" },
            { code: "+44", country: "United Kingdom" },
            { code: "+91", country: "India" },
        ];

        // To disable submit button at the beginning.
        useEffect(() => {
            forceUpdate({});
        }, []);

        const onFinish = async (values) => {
            // console.log('Finish:', values);
            if (selectedKey == null) {
                // Adding
                try {
                    // Make API call to send form data to the backend
                    const response = await fetch(`${AdminUrl}/api/addVendorstoDbByVendor`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(values),
                    });

                    if (response.ok) {
                        // Handle successful response
                        Swal.fire({
                            icon: "success",
                            title: "Vendor data added successfully",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        setVendors([
                            ...vendors,
                            {
                                id: vendors?.length + 1,
                                ...values,
                            },
                        ]);
                        const vendordata = await response.json();
                        setSelectedKey(vendordata?.lastInsertedId);
                        next(); // Move to the next step or perform any other action
                        console.log("Form data sent successfully!");
                    } else {
                        // Handle error response
                        console.error("Error sending form data:", response.statusText);
                        Swal.fire({
                            icon: "error",
                            title: "Email id already Exist",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        setVendors([
                            ...vendors,
                            {
                                id: vendors?.length + 1,
                                ...values,
                            },
                        ]);
                    }
                } catch (error) {
                    // Handle error
                    console.error("Error sending form data:", error);
                }
            } else {
                //Updating
                try {
                    // Make API call to send form data to the backend
                    const response = await fetch(`${AdminUrl}/api/updateVendorDb`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ selectedKey, values }),
                    });

                    if (response.ok) {
                        // Handle successful response
                        Swal.fire({
                            icon: "success",
                            title: "Verification Details updated successfully",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        setVendors(
                            vendors.map((item) =>
                                item.id === selectedKey ? { ...item, ...values } : item
                            )
                        );
                        next(); // Move to the next step or perform any other action
                        console.log("Form data sent successfully!");
                    } else {
                        // Handle error response
                        console.error("Error sending form data:", response.statusText);
                    }
                } catch (error) {
                    // Handle error
                    console.error("Error sending form data:", error);
                }
            }
        };

        return (
            <>
                <div className="mt-5 p-2">
                    <Form
                        form={form}
                        onFinish={onFinish}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14, }}
                        className='text-left'
                    >
                        <h1 className='text-center mb-7 uppercase text-xl font-bold text-[#081831]'>Verification</h1>
                        <Form.Item
                            name="country_code"
                            label="Country Code"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select country code!",
                                },
                            ]}
                        >
                            <Select placeholder={"Country Code"}>
                                {countryCodes.map((country) => (
                                    <Option key={country.code} value={country.code}>
                                        {country.code}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="mobile_number"
                            label="Mobile Number"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your mobile number!",
                                },
                            ]}
                        >
                            <Input
                                prefix={<FiPhone className="site-form-item-icon" />}
                                placeholder="Mobile Number"
                            />
                        </Form.Item>

                        <Form.Item
                            name="vendorname"
                            label="Vendor Name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your Full Name",
                                },
                            ]}
                        >
                            <Input
                                prefix={<FiUser className="site-form-item-icon" />}
                                placeholder="Ex. Shadab Khan"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your email address!",
                                },
                                {
                                    type: "email",
                                    message: "Please enter a valid email address!",
                                },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="site-form-item-icon" />}
                                placeholder="Email"
                            />
                        </Form.Item>

                        {/* Password Field */}
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter a password!',
                                },
                                {
                                    type: 'password',
                                    message: 'Please enter a valid password!',
                                },
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
                            hasFeedback // Add this to enable feedback
                        >
                            <Input.Password placeholder="Enter Password" />
                        </Form.Item>

                        {/* Confirm Password Field */}
                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={['password']} // Add this to establish a dependency
                            hasFeedback // Add this to enable feedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('The two passwords do not match!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm Password" />
                        </Form.Item>

                        <Form.Item shouldUpdate wrapperCol={{ offset: 6, span: 14 }}>
                            {() => (
                                <Button
                                    type="submit"
                                    htmlType="submit"
                                    // disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
                                    className={`border mt-5 ${form.isFieldsTouched(true)
                                        ? "bg-[#081831] text-white"
                                        : "bg-[#081831] text-white"
                                        }`}
                                >
                                    Save & Next
                                </Button>
                            )}
                        </Form.Item>
                    </Form>
                </div>
            </>
        );
    };


    // Brand Details
    const BrandsDetails = () => {
        const [error, updateError] = useState();

        const [, forceUpdate] = useState({});
        useEffect(() => {
            forceUpdate({});
        }, []);

        const onFinish = async (values) => {
            //   console.log("Finish:", values);
            if (selectedKey != null) {
                try {
                    // Make API call to send form data to the backend
                    const response = await fetch(`${AdminUrl}/api/updateVendorDb`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ selectedKey, values }),
                    });

                    if (response.ok) {
                        // Handle successful response
                        Swal.fire({
                            icon: "success",
                            title: "Verification Details updated successfully",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        setVendors(
                            vendors.map((item) =>
                                item.id === selectedKey ? { ...item, ...values } : item
                            )
                        );
                        next();
                    } else {
                        // Handle error response
                        console.error("Error sending form data:", response.statusText);
                    }
                } catch (error) {
                    // Handle error
                    console.error("Error sending form data:", error);
                }
            }
        };

        return (
            <>
                {selectedKey == null ? (
                    <section className="bg-blue-500 py-8">
                        <div className="container mx-auto px-4">
                            <div className="max-w-md mx-auto text-center">
                                <h2 className="text-white text-2xl font-semibold mb-4">
                                    Create an Account to Get Started
                                </h2>
                                <p className="text-white text-lg">
                                    Welcome to our platform! To access all the features and
                                    services, please create an account by providing your details.
                                    It only takes a few moments, and you'll be ready to explore
                                    the possibilities.
                                </p>
                                <button className="mt-6 bg-white text-blue-500 hover:bg-blue-100 text-lg py-2 px-6 font-semibold rounded-full">
                                    Sign Up Now
                                </button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className="mt-5 p-2">
                        <h1 className='text-center mb-7 uppercase text-xl font-bold text-[#081831]'>Brand Details</h1>
                        <Form
                            form={form}
                            onFinish={onFinish}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 14 }}
                            className='text-left'
                        >
                            <Form.Item
                                name="brand_name"
                                label="Brand Name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input the brand name!",
                                    },
                                ]}
                            >
                                <Input placeholder="Brand Name" />
                            </Form.Item>

                            <Form.Item
                                name="business_model"
                                label="Business Model"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select the business model!",
                                    },
                                ]}
                            >
                                <Select placeholder="Select Business Model">
                                    <Select.Option value="manufacturer">
                                        Manufacturer
                                    </Select.Option>
                                    <Select.Option value="designer">Designer</Select.Option>
                                    <Select.Option value="wholesaler">Wholesaler</Select.Option>
                                    <Select.Option value="trader">Trader</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item shouldUpdate wrapperCol={{ offset: 6, span: 14 }}>
                                {() => (
                                    <>
                                        <Button
                                            style={{
                                                marginRight: "8px",
                                            }}
                                            type="button"
                                            className="border border-1 bg-[#23527c] text-white hover:bg-[#081831]"
                                            onClick={() => prev()}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            type="submit"
                                            htmlType="submit"
                                            // disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
                                            className={`border mt-5 ${form.isFieldsTouched(true)
                                                ? "bg-[#081831] text-white"
                                                : "bg-[#081831] text-white"
                                                }`}
                                        >
                                            Save & Next
                                        </Button>
                                    </>
                                )}
                            </Form.Item>
                        </Form>
                        {/* <hr /> */}
                        {/* <div className='grid justify-center w-full items-center' style={{ gridTemplateColumns: '50% 50%' }}>
                            <div className="mt-4">
                                <div className='mb-2'>
                                    <label className="mr-4 font-semibold text-gray-600 text-right">Upload Few Products Images</label>
                                </div>
                                <div>
                                    <button className="bg-gray-300 text-black px-3 py-2 rounded flex items-center" onClick={handleImageUpload(selectedKey)}>
                                        <FiUpload className="mr-2" />
                                        <span className='text-sm'>Upload</span>
                                    </button>
                                </div>
                            </div>
    
                        </div> */}

                        {error && <p>{error}</p>}
                    </div>
                )}
            </>
        );
    };

    // Company Details
    const CompanyDetailsForm = () => {
        const [activePanels, setActivePanels] = useState(["basic"]);

        const togglePanel = (panelKey) => {
            const newActivePanels = activePanels.includes(panelKey)
                ? activePanels.filter((key) => key !== panelKey)
                : [...activePanels, panelKey];
            setActivePanels(newActivePanels);
        };

        const onFinish = async (values) => {
            try {
                // Send the form data to the backend
                const response = await fetch(`${AdminUrl}/api/vendorCompanyDetails`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ selectedKey, values }),
                });

                if (!response.ok) {
                    throw new Error("Failed to submit the form");
                }

                // Parse the response data
                const data = await response.json();
                if (data?.status == 200) {
                    Swal.fire({
                        title: "Vendor details updated successfully",
                        icon: "success",
                    });
                    next();
                }
                // Handle the response from the backend
                console.log("Response from backend:", data);
                // Perform any additional actions based on the response
            } catch (error) {
                console.error("Error:", error);
                // Handle any errors that occur during the request
            }
        };

        return (
            <div className="mt-10">
                {selectedKey == null ? (
                    <section className="bg-blue-500 py-8">
                        <div className="container mx-auto px-4">
                            <div className="max-w-md mx-auto text-center">
                                <h2 className="text-white text-2xl font-semibold mb-4">
                                    Create an Account to Get Started
                                </h2>
                                <p className="text-white text-lg">
                                    Welcome to our platform! To access all the features and
                                    services, please create an account by providing your details.
                                    It only takes a few moments, and you'll be ready to explore
                                    the possibilities.
                                </p>
                                <button
                                    className="mt-6 bg-white text-blue-500 hover:bg-blue-100 text-lg py-2 px-6 font-semibold rounded-full"
                                    onClick={() => prev()}
                                >
                                    Sign Up Now
                                </button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className="mt-5 p-2">
                        <h1 className='text-center mb-7 uppercase text-xl font-bold text-[#081831]'>Company Details</h1>
                        <Form
                            form={form}
                            name="company_details"
                            onFinish={onFinish}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 14 }}
                            className='text-left'
                        >
                            <Form.Item
                                label="Company Name"
                                name="company_name"
                                rules={[{ required: true, message: "Please enter company name" }]}
                            >
                                <Input className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                label="Business Phone"
                                name="business_phone"
                                rules={[
                                    { required: true, message: "Please enter business phone" },
                                ]}
                            >
                                <Input className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                label="Business Email"
                                name="business_email"
                                rules={[
                                    { required: true, message: "Please enter business email" },
                                    {
                                        type: "email",
                                        message: "Please enter a valid email address",
                                    },
                                ]}
                            >
                                <Input className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                label="Business Website"
                                name="business_website"
                                rules={[
                                    { required: true, message: "Please enter business website" },
                                ]}
                            >
                                <Input className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                label="Business Description"
                                name="business_description"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter business description",
                                    },
                                ]}
                            >
                                <Input.TextArea className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                label="Country"
                                name="company_country"
                                rules={[{ required: true, message: "Please enter country" }]}
                            >
                                <Input className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                label="State"
                                name="company_state"
                                rules={[{ required: true, message: "Please enter state" }]}
                            >
                                <Input className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                label="Company City"
                                name="company_city"
                                rules={[{ required: true, message: "Please enter company city" }]}
                            >
                                <Input className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                label="Zip Code"
                                name="company_zip_code"
                                rules={[{ required: true, message: "Please enter zip code" }]}
                            >
                                <Input className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                label="Shipping Address"
                                name="shipping_address"
                                rules={[
                                    { required: true, message: "Please enter shipping address" },
                                ]}
                            >
                                <Input className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                label="Business Type"
                                name="business_type"
                                rules={[
                                    { required: true, message: "Please enter business type" },
                                ]}
                            >
                                <Input className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                label="Tax ID Number"
                                name="tax_id_number"
                            // rules={[{ required: true, message: 'Please enter tax ID registration number' }]}
                            >
                                <Input className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                label="Support Contact 1"
                                name="support_contact_1"
                                rules={[
                                    { required: true, message: "Please enter support contact 1" },
                                ]}
                            >
                                <Input className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item
                                label="Support Contact 2"
                                name="support_contact_2"
                                rules={[
                                    { required: true, message: "Please enter support contact 2" },
                                ]}
                            >
                                <Input className="border border-gray-300 rounded-md" />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                                {/* <Button
                                type="button"
                                htmlType="submit"
                                className="bg-green-600 text-white flex justify-center items-center gap-2 text-lg p-4"
                                >
                                <FiCheckCircle /> {selectedKey == null ? "Submit" : "Update"}
                            </Button> */}
                                <>
                                    <Button
                                        style={{
                                            marginRight: "8px",
                                        }}
                                        type="button"
                                        className="border border-1 bg-[#23527c] text-white hover:bg-[#081831]"
                                        onClick={() => prev()}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        type="submit"
                                        htmlType="submit"
                                        // disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
                                        className={`border mt-5 ${form.isFieldsTouched(true)
                                            ? "bg-[#081831] text-white"
                                            : "bg-[#081831] text-white"
                                            }`}
                                    >
                                        Save & Next
                                    </Button>
                                </>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </div>
        );
    };

    // Bank Details
    const BankDetails = () => {
        const [, forceUpdate] = useState({});
        const { Option } = Select;

        // To disable submit button at the beginning.
        useEffect(() => {
            forceUpdate({});
        }, []);

        const onFinish = async (values) => {
            console.log("Finish:", values);
            if (selectedKey != null) {
                try {
                    // Make API call to send form data to the backend
                    const response = await fetch(`${AdminUrl}/api/updateVendorDb`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ selectedKey, values }),
                    });

                    if (response.ok) {
                        setVendors(
                            vendors.map((item) =>
                                item.id === selectedKey ? { ...item, ...values } : item
                            )
                        );
                        // Handle successful response
                        Swal.fire({
                            icon: "success",
                            title: "Account Created Successfully",
                            text: "Account created successfully. Account is currently under verification. One of our vendor management managers will be in touch with you within a few hours to coordinate the next steps.",
                            showConfirmButton: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Redirect to the login page here
                                window.location.href = "/Vendors/Login"; // Replace with your login page URL
                            }
                        });
                    } else {
                        // Handle error response
                        console.error("Error sending form data:", response.statusText);
                    }
                } catch (error) {
                    // Handle error
                    console.error("Error sending form data:", error);
                }
            }
        };

        const onFinishFailed = (errorInfo) => {
            console.log("Failed:", errorInfo);
        };

        return (
            <>
                {selectedKey == null ? (
                    <section className="bg-blue-500 py-8">
                        <div className="container mx-auto px-4">
                            <div className="max-w-md mx-auto text-center">
                                <h2 className="text-white text-2xl font-semibold mb-4">
                                    Create an Account to Get Started
                                </h2>
                                <p className="text-white text-lg">
                                    Welcome to our platform! To access all the features and
                                    services, please create an account by providing your details.
                                    It only takes a few moments, and you'll be ready to explore
                                    the possibilities.
                                </p>
                                <button
                                    className="mt-6 bg-white text-blue-500 hover:bg-blue-100 text-lg py-2 px-6 font-semibold rounded-full"
                                    onClick={() => prev()}
                                >
                                    Sign Up Now
                                </button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className="mt-5 p-2">
                        <h1 className='text-center mb-7 uppercase text-xl font-bold text-[#081831]'>Bank Details</h1>
                        <Form
                            name="bankAccountForm"
                            form={form}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 14, }}
                            className='text-left'
                        >
                            <Form.Item
                                label="Bank Name"
                                name="bank_name"
                                rules={[
                                    { required: true, message: "Please enter the bank name" },
                                ]}
                            >
                                <Input placeholder="Bank Name" />
                            </Form.Item>

                            <Form.Item
                                label="Bank Account Number"
                                name="bank_account_number"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the bank account number",
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input placeholder="Bank Account Number" />
                            </Form.Item>

                            <Form.Item
                                label="Confirm Account Number"
                                name="confirm_bank_account_number"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please confirm the bank account number",
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue("bank_account_number") === value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error("The two bank account numbers do not match")
                                            );
                                        },
                                    }),
                                ]}
                                hasFeedback
                            >
                                <Input placeholder="Confirm Bank Account Number" />
                            </Form.Item>

                            <Form.Item
                                label="Bank Routing Number"
                                name="bank_routing_number"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the bank routing number",
                                    },
                                ]}
                            >
                                <Input placeholder="Bank Routing Number" />
                            </Form.Item>

                            <Form.Item
                                label="Bank Account Name"
                                name="bank_account_name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the bank account name",
                                    },
                                ]}
                            >
                                <Input placeholder="Bank Account Name" />
                            </Form.Item>

                            <Form.Item
                                label="Bank Branch"
                                name="bank_branch"
                                rules={[
                                    { required: true, message: "Please enter the bank branch" },
                                ]}
                            >
                                <Input placeholder="Bank Branch" />
                            </Form.Item>

                            <Form.Item
                                label="Bank Swift Code"
                                name="bank_swift_code"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the bank Swift code",
                                    },
                                ]}
                            >
                                <Input placeholder="Bank Swift Code" />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                                <>
                                    <Button
                                        style={{
                                            marginRight: "8px",
                                        }}
                                        type="button"
                                        className="border border-1 bg-[#23527c] text-white hover:bg-[#081831]"
                                        onClick={() => prev()}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        type="submit"
                                        htmlType="submit"
                                        // disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
                                        className={`border mt-5 ${form.isFieldsTouched(true)
                                            ? "bg-[#081831] text-white"
                                            : "bg-[#081831] text-white"
                                            }`}
                                    >
                                        Sign Up
                                    </Button>
                                </>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </>
        );
    };



    const steps = [
        {
            title: "Verification",
            // description: "Details of phone number, email, password",
            content: <Pinfo />,
        },
        {
            title: "Brand Details",
            // description: "Details of Brand Name & Business Model",
            content: <BrandsDetails />,
        },
        {
            title: "Company Details",
            // description: "Details of Company Name, Address, Shipping Address & Contact",
            content: <CompanyDetailsForm />,
        },

        {
            title: "Bank Details",
            // description: "Details of Bank Name, Account Number, Account Holder Name etc",
            content: <BankDetails />,
        },
    ];

    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
        description: item.description,
    }));

    const contentStyle = {
        // lineHeight: '260px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-[#081831] overflow-y-scroll">
            <div className="my-5 mx-5 lg:mx-24 w-full px-6 py-8 bg-white rounded-lg shadow-lg">
                <div className='flex flex-col sm:flex-row items-center gap-5'>
                    <div className='w-full md:w-1/4'>
                        <div className="text-center mb-10" >
                            <img className="w-[20vw] mx-auto" src="/logo-black.png" alt="logo" />
                            <h2 className="text-xl font-semibold text-[#081831]">Vendor Sign Up</h2>
                        </div>
                        <Steps
                            direction="vertical"
                            current={current}
                            items={items}
                        />
                    </div>
                    <div className='w-full md:w-3/4 h-[80vh] overflow-x-hidden overflow-y-scroll' style={contentStyle}>{steps[current].content}
                        {/* <div
                            style={{
                                // marginTop: 24,
                                float: 'right',
                            }}>
                            {current > 0 && (
                                <Button
                                    style={{
                                        marginRight: "8px",
                                    }}
                                    type="button"
                                    className="border border-1 bg-[#23527c] text-white hover:bg-[#081831]"
                                    onClick={() => prev()}
                                >
                                    Previous
                                </Button>
                            )}
                            {current < steps.length - 1 && selectedKey !== null && current > 0 && (
                                <Button
                                    className="border border-1 border-[#081831] text-[#081831] hover:bg-[#081831] hover:text-white"
                                    type="button"
                                    onClick={() => next()}
                                >
                                    Next
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button
                                    type="button"
                                    onClick={() => message.success("Processing complete!")}
                                >
                                    Done
                                </Button>
                            )}
                        </div> */}
                    </div>
                </div>
                <p className="text-center text-md mt-5">Already have an Account?
                    <a
                        href="/Vendors/Login"
                        className="w-full text-md font-medium text-[#081831] hover:underline focus:outline-none"
                    > Login
                    </a>
                </p>
            </div>
        </section>
    )
}

export default VendorSignUp