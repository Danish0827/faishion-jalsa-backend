import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Pagination,
  Select,
  Space,
  Steps,
  Tabs,
  Avatar,
  Image,
} from "antd";
import { NavLink } from "react-router-dom";
import { MailOutlined } from "@ant-design/icons";
import { AdminUrl } from "../../constant";
// import InputMask from 'react-input-mask';
import {
  FiCheckCircle,
  FiEdit2,
  FiPhone,
  FiUploadCloud,
  FiUser,
} from "react-icons/fi";
import Swal from "sweetalert2";
import {
  BrandLogoUpdate,
  TrademarkUploader,
  VendorProductImageUploader,
  VendorProfileChange,
} from "../../components";
import { FcCancel } from "react-icons/fc";
import { FaArchive, FaBan, FaCheck, FaClock, FaTimes } from "react-icons/fa";

const { TabPane } = Tabs;

const Vendors = ({ adminLoginData }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [vendors, setVendors] = useState([]);
  const [current, setCurrent] = useState(0);
  const [imageUploadModal, setimageUploadModal] = useState(false);
  const [selectedVendors, setselectedVendors] = useState();
  const [activeTab, setActiveTab] = useState("1");
  const [imageUploadTab, setImageUploadTab] = useState("1"); // Separate state for the second set of tabs

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

  const allVendors = vendors.filter((vendor) => vendor);
  const activeVendors = vendors.filter((vendor) => vendor.status === 0);
  const blockedVendors = vendors.filter((vendor) => vendor.status === 1);
  const archivedVendors = vendors.filter((vendor) => vendor.status === 2);
  const approvedVendor = vendors.filter((vendor) => vendor.status === 3);
  const rejectvendor = vendors.filter((vendor) => vendor.status === 4);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      width: 40,
    },
    {
      title: "Brand Name",
      dataIndex: "brand_name",
      key: "brand_name",
      width: 350,
      render: (text, record) => (
        <div className="flex items-center">
          {record.vendor_profile_picture_url ? (
            <Image
              src={`${AdminUrl}/uploads/vendorProfile/${record.vendor_profile_picture_url?.images?.[0]}`}
              className="rounded-full"
              width={40}
              height={40}
            />
          ) : (
            <span className="inline-block h-10 w-10 bg-gray-100 rounded-full overflow-hidden">
              <svg
                class="h-full w-full text-gray-300"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.62854"
                  y="0.359985"
                  width="15"
                  height="15"
                  rx="7.5"
                  fill="white"
                />
                <path
                  d="M8.12421 7.20374C9.21151 7.20374 10.093 6.32229 10.093 5.23499C10.093 4.14767 9.21151 3.26624 8.12421 3.26624C7.0369 3.26624 6.15546 4.14767 6.15546 5.23499C6.15546 6.32229 7.0369 7.20374 8.12421 7.20374Z"
                  fill="currentColor"
                />
                <path
                  d="M11.818 10.5975C10.2992 12.6412 7.42106 13.0631 5.37731 11.5537C5.01171 11.2818 4.69296 10.9631 4.42107 10.5975C4.28982 10.4006 4.27107 10.1475 4.37419 9.94123L4.51482 9.65059C4.84296 8.95684 5.53671 8.51624 6.30546 8.51624H9.95231C10.7023 8.51624 11.3867 8.94749 11.7242 9.62249L11.8742 9.93184C11.968 10.1475 11.9586 10.4006 11.818 10.5975Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          )}
          <div className="ml-4 tracking-wide">
            <p className="font-bold">{record.vendorname}</p>
            <p className="">Brand: {text}</p>
            <p className="">Email: {record.email}</p>
            <p className="">Mobile: {record.mobile_number}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Registration Date",
      dataIndex: "registration_date",
      key: "registration_date",
      width: 230,
      sorter: (a, b) => {
        const dateA = new Date(
          a.registration_date.replace(/(\d+)(st|nd|rd|th)/, "$1")
        );
        const dateB = new Date(
          b.registration_date.replace(/(\d+)(st|nd|rd|th)/, "$1")
        );
        return dateA - dateB;
      },
      defaultSortOrder: "desc", // Set default sorting order to descending
    },
    {
      title: "Email Status",
      dataIndex: "email_verification_status",
      key: "email_verification_status",
      width: 100,
      sorter: (a, b) => {
        if (a.email_verification_status && !b.email_verification_status) {
          return -1; // 'Verified' comes first
        } else if (
          !a.email_verification_status &&
          b.email_verification_status
        ) {
          return 1; // 'Not verified' comes first
        } else {
          return 0; // no change in sorting order
        }
      },
      render: (email_verification_status) => (
        <>
          {email_verification_status ? (
            <FiCheckCircle
              className="text-green-600 text-center text-xl "
              title="Verified"
            />
          ) : (
            <FcCancel
              className="text-rose-500 text-center text-xl"
              title="Not verified"
            />
          )}
        </>
      ),
    },
    {
      title: "Mobile Status",
      dataIndex: "mobile_verification_status",
      key: "mobile_verification_status",
      width: 100,
      sorter: (a, b) => {
        if (a.mobile_verification_status && !b.mobile_verification_status) {
          return -1; // 'Verified' comes first
        } else if (
          !a.mobile_verification_status &&
          b.mobile_verification_status
        ) {
          return 1; // 'Not verified' comes first
        } else {
          return 0; // no change in sorting order
        }
      },
      render: (mobile_verification_status) => (
        <>
          {mobile_verification_status ? (
            <FiCheckCircle
              className="text-green-600 text-center text-xl"
              title="Verified"
            />
          ) : (
            <FcCancel
              className="text-rose-500 text-center text-xl"
              title="Not verified"
            />
          )}
        </>
      ),
    },
    // {
    //   title: "Medias",
    //   dataIndex: "productsListed",
    //   key: "productsListed",
    //   render: (text, record) =>
    //     record.status !== 4 ? (
    //       <>
    //         <Space>
    //           <FiUploadCloud
    //             onClick={() => handleImageUpload(record.id)}
    //             className="text-white  w-8 h-8 p-2 rounded-full hover:text-white bg-green-500 border-none hover:bg-green-600 "
    //           />
    //         </Space>
    //       </>
    //     ) : (
    //       "-"
    //     ),
    // },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status - b.status,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Select
            mode="multiple"
            placeholder="Filter by status"
            value={selectedKeys}
            onChange={(values) => {
              setSelectedKeys(values);
              confirm();
            }}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          >
            <Option value="0">Pending</Option>
            <Option value="1">Blocked</Option>
            <Option value="2">Archived</Option>
            <Option value="3">Approved</Option>
            <Option value="4">Rejected</Option>
          </Select>
          <button
            type="button"
            onClick={() => {
              setSelectedKeys([]);
              clearFilters();
            }}
            style={{ width: 90, marginRight: 8 }}
          >
            Reset
          </button>
        </div>
      ),
      onFilter: (value, record) => record.status == value,
      render: (status) => {
        let statusIcon, statusColor, statusname;

        if (status === 0) {
          statusIcon = <FaClock />;
          statusColor = "text-blue-500";
          statusname = "Pending";
        } else if (status === 1) {
          statusIcon = <FaBan />;
          statusColor = "text-rose-500";
          statusname = "Blocked";
        } else if (status === 2) {
          statusIcon = <FaArchive />;
          statusColor = "text-orange-500";
          statusname = "Archived";
        } else if (status === 3) {
          statusIcon = <FaCheck />;
          statusColor = "text-green-500";
          statusname = "Approve";
        } else if (status === 4) {
          statusIcon = <FaTimes />;
          statusColor = "text-red-500";
          statusname = "Rejected";
        }

        return (
          <span className={`${statusColor} flex items-center`}>
            {statusIcon} {statusIcon && " "}
            <p className="ml-2">{statusname}</p>
          </span>
        );
      },
    },

    {
      title: "Actions",
      key: "actions",
      render: (record) =>
        record.status !== 4 ? (
          <Space size="middle" className="flex">
            <>
              <FiEdit2
                onClick={() => handleUpdate(record.id)}
                className="text-white  w-8 h-8 p-2 rounded-full bg-[#081831] border-none hover:bg-[#337ab7] hover:text-white "
              />
            </>
          </Space>
        ) : (
          "-"
        ),
    },
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleTabChangeforTable = (key) => {
    setImageUploadTab(key);
  };

  const [form] = Form.useForm();
  const pageSize = 10;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  function handleCreate() {
    form.resetFields();
    setModalVisible(true);
    setSelectedKey(null);
  }

  function handleUpdate(key) {
    callVendor();
    const selectedRow = vendors.find((item) => item.id === key);
    form.setFieldsValue(selectedRow);
    form.setFieldsValue({ confirm_bank_account_number: "" });
    setModalVisible(true);
    setSelectedKey(key);
  }

  function handleImageUpload(key) {
    callVendor();
    setSelectedKey(key);
    setselectedVendors(vendors.find((item) => item.id === key));
    setimageUploadModal(true);
  }

  const handleCancelImageUploadModal = () => {
    setselectedVendors();
    setimageUploadModal(false);
  };

  const Pinfo = () => {
    const [, forceUpdate] = useState({});
    const { Option } = Select;
    const countryCodes = [
      { code: "+1", country: "United States" },
      { code: "+44", country: "United Kingdom" },
      { code: "+91", country: "India" },
      // Add more country codes as needed
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
          const response = await fetch(`${AdminUrl}/api/addVendorstoDb`, {
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
        <div className="mt-10 p-2">
          <Form
            form={form}
            onFinish={onFinish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
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
              <Select placeholder={"Code"}>
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

            <Form.Item shouldUpdate wrapperCol={{ offset: 6, span: 18 }}>
              {() => (
                <Button
                  type="submit"
                  htmlType="submit"
                  // disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
                  className={`border mt-5 ${form.isFieldsTouched(true)
                    ? "bg-blue-500 text-white"
                    : "bg-green-700 text-white"
                    }`}
                >
                  Save
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </>
    );
  };

  const BrandsDetails = () => {
    const [error, updateError] = useState();

    const [, forceUpdate] = useState({});
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
          <div className="mt-10 p-2">
            <Form
              form={form}
              onFinish={onFinish}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
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

              <Form.Item shouldUpdate wrapperCol={{ offset: 6, span: 18 }}>
                {() => (
                  <Button
                    type="submit"
                    htmlType="submit"
                    // disabled={!form.isFieldsTouched(true) || !!form.getFieldsError().filter(({ errors }) => errors.length).length}
                    className={`border mt-5 ${form.isFieldsTouched(true)
                      ? "bg-blue-500 text-white"
                      : "bg-green-600 text-white"
                      }`}
                  >
                    Save
                  </Button>
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
          <Form
            form={form}
            name="company_details"
            onFinish={onFinish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            {/* Basic Details */}
            <Form.Item
              label="Company Name"
              name="company_name"
              rules={[{ required: true, message: "Please enter company name" }]}
            >
              <Input className="border border-gray-300 rounded-md" />
            </Form.Item>

            {/* Add more basic details here */}
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

            {/* Intermediate Details */}

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

            {/* Add more intermediate details here */}

            {/* Hard Details */}
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

            <Form.Item wrapperCol={{ offset: 12, span: 18 }}>
              <Button
                type="button"
                htmlType="submit"
                className="bg-green-600 text-white flex justify-center items-center gap-2 text-lg p-4"
              >
                <FiCheckCircle /> {selectedKey == null ? "Submit" : "Update"}
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    );
  };

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
            // Handle successful response
            Swal.fire({
              icon: "success",
              title: "Account Update Successfully",
              text: "Account is currently under verification. One of our vendor management managers will be in touch with you within a few hours to coordinate the next steps.",
              showConfirmButton: true,
            });
            setVendors(
              vendors.map((item) =>
                item.id === selectedKey ? { ...item, ...values } : item
              )
            );
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
          <div className="mt-10 p-2">
            <Form
              name="bankAccountForm"
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
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
              >
                <Input placeholder="Bank Account Number" />
              </Form.Item>

              <Form.Item
                label="Confirm Bank Account Number"
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

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button className="bg-green-600 text-white mt-5" htmlType="submit">
                  Update
                </Button>
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
      content: <Pinfo />,
    },
    {
      title: "Brand Details",
      content: <BrandsDetails />,
    },
    {
      title: "Company Details",
      content: <CompanyDetailsForm />,
    },

    {
      title: "Bank Details",
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
  }));

  return (
    <>
      {adminLoginData == null || adminLoginData?.length == 0 ? (
        ""
      ) : (
        <div className="mx-auto p-5 mt-10 sm:ml-72 sm:p-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="my-5">
              <h1 className="text-4xl text-gray-700 font-bold mb-2">
                Vendor List ({vendors?.length})
              </h1>
              <nav
                aria-label="Breadcrumbs"
                className="order-first flex text-sm font-semibold sm:space-x-2"
              >
                <NavLink to={`${AdminUrl}`}>
                  <a
                    href=""
                    className="hover:text-slate-600 hidden text-slate-500 sm:block"
                  >
                    Home
                  </a>
                </NavLink>

                <div
                  aria-hidden="true"
                  className="hidden select-none text-slate-400 sm:block"
                >
                  /
                </div>
                <p className="text-slate-500 hover:text-slate-600">
                  Manage Vendor List
                </p>
              </nav>
            </div>
            <div className="my-5">
              <button
                onClick={handleCreate}
                className="bg-[#0391d1] hover:bg-[#0391d1]/80 text-white rounded-full p-3 px-5"
              >
                {/* <svg
                  className="w-10 h-10 "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  >
                  <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>  */}
                Add New Vendor
              </button>
            </div>
          </div>
          {
            <>
              <div className="table-responsive overflow-hidden overflow-x-auto mt-4 ">
                <Tabs
                  defaultActiveKey="1"
                  activeKey={imageUploadTab}
                  onChange={handleTabChangeforTable}
                  centered
                >
                  <TabPane className="text-[#081831]" tab={`All (${allVendors?.length})`} key="1">
                    <Table
                      columns={columns}
                      dataSource={allVendors?.slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )}
                      pagination={false}
                      className="w-full mt-10"
                      rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                    />
                    <div className="mt-4">
                      <Pagination
                        current={currentPage}
                        onChange={handlePageChange}
                        pageSize={pageSize}
                        total={allVendors?.length}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab={`Pending (${activeVendors?.length})`} key="2">
                    <Table
                      columns={columns}
                      dataSource={activeVendors?.slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )}
                      pagination={false}
                      className="w-full mt-10"
                      rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                    />
                    <div className="mt-4">
                      <Pagination
                        current={currentPage}
                        onChange={handlePageChange}
                        pageSize={pageSize}
                        total={activeVendors?.length}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab={`Blocked (${blockedVendors?.length})`} key="3">
                    <Table
                      columns={columns}
                      dataSource={blockedVendors?.slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )}
                      pagination={false}
                      className="w-full mt-10"
                      rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                    />
                    <div className="mt-4">
                      <Pagination
                        current={currentPage}
                        onChange={handlePageChange}
                        pageSize={pageSize}
                        total={blockedVendors?.length}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab={`Approved (${approvedVendor?.length})`} key="5">
                    <Table
                      columns={columns}
                      dataSource={approvedVendor?.slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )}
                      pagination={false}
                      className="w-full mt-10"
                      rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                    />
                    <div className="mt-4">
                      <Pagination
                        current={currentPage}
                        onChange={handlePageChange}
                        pageSize={pageSize}
                        total={approvedVendor?.length}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab={`Rejected (${rejectvendor?.length})`} key="6">
                    <Table
                      columns={columns}
                      dataSource={rejectvendor?.slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )}
                      pagination={false}
                      className="w-full mt-10"
                      rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                    />
                    <div className="mt-4">
                      <Pagination
                        current={currentPage}
                        onChange={handlePageChange}
                        pageSize={pageSize}
                        total={rejectvendor?.length}
                      />
                    </div>
                  </TabPane>
                  <TabPane
                    tab={`Archived (${archivedVendors?.length})`}
                    key="4"
                  >
                    <Table
                      columns={columns}
                      dataSource={archivedVendors?.slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )}
                      pagination={false}
                      className="w-full mt-10"
                      rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                    />
                    <div className="mt-4">
                      <Pagination
                        current={currentPage}
                        onChange={handlePageChange}
                        pageSize={pageSize}
                        total={archivedVendors?.length}
                      />
                    </div>
                  </TabPane>
                </Tabs>
              </div>

              <Modal
                title={
                  selectedKey === null ? "Create Vendor's" : "Update Vendor's"
                }
                visible={modalVisible}
                onOk={""}
                onCancel={() => setModalVisible(false)}
                okText={selectedKey === null ? "Create" : "Update"}
                okButtonProps={{
                  style: {
                    backgroundColor: "#081831",
                    color: "#fff",
                    display: "none",
                  }, // Set the background color and text color
                  disabled: false,
                }}
                width={800}
              >
                <Steps current={current} items={items} className="mt-5 mb-5" />
                <div>{steps[current].content}</div>
                <div
                  style={{
                    marginTop: 24,
                  }}
                >
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
                  {current < steps.length - 1 && selectedKey != null && (
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

                </div>
              </Modal>

              <Modal
                title={`Image Upload - ${selectedVendors?.brand_name != null
                  ? selectedVendors?.brand_name
                  : ""
                  }`}
                visible={imageUploadModal}
                onCancel={handleCancelImageUploadModal}
                okButtonProps={{ style: { display: "none" } }}
                width={1000}
              >
                <Tabs
                  defaultActiveKey={"1"}
                  centered
                  onChange={handleTabChange}
                >
                  <TabPane tab="Vendor Products" key="1">
                    {activeTab === "1" && (
                      <VendorProductImageUploader
                        maxFiles={10}
                        ids={selectedKey}
                        vendors={selectedVendors}
                      />
                    )}
                  </TabPane>
                  <TabPane tab="Trademark Certificate" key="2">
                    {activeTab === "2" && (
                      <>
                        <TrademarkUploader
                          maxFiles={1}
                          ids={selectedKey}
                          vendors={selectedVendors}
                          updateVendor={callVendor}
                        />
                      </>
                    )}
                  </TabPane>
                  <TabPane tab="Vendor Profile Image" key="3">
                    {activeTab === "3" && (
                      <>
                        <VendorProfileChange
                          maxFiles={1}
                          ids={selectedKey}
                          vendors={selectedVendors}
                          updateVendor={callVendor}
                        />
                      </>
                    )}
                  </TabPane>
                  <TabPane tab="Brand Logo" key="4">
                    {activeTab === "4" && (
                      <>
                        <BrandLogoUpdate
                          maxFiles={1}
                          ids={selectedKey}
                          vendors={selectedVendors}
                        />
                      </>
                    )}
                  </TabPane>
                </Tabs>
                {/* <VendorProductImageUploader maxFiles={5} ids={selectedKey} vendors={selectedVendors} />
                         <TrademarkUploader maxFiles={5} ids={selectedKey} vendors={selectedVendors} /> */}
              </Modal>
            </>
          }
        </div>
      )}
    </>
  );
};

export default Vendors;
