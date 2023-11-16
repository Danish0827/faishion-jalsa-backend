import React, { useEffect, useState } from "react";
import { Table, Button, Image, Input, Modal, Tooltip } from "antd";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import { AdminUrl } from "../../constant";
import VendorProfileDetails from "../../components/VendorProfileDetails ";
import Swal from "sweetalert2";
import { FiAlertCircle, FiCheckCircle, FiClock } from "react-icons/fi";
import moment from "moment";

const AcceptReject = () => {
  const [rejectedProducts, setRejectedProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [RejectModal, setRejectModal] = useState(false);
  const [ApproveModal, setApproveModal] = useState(false);
  const [modalDescription, setModalDescription] = useState("");
  const [vendorProfileModalVisible, setVendorProfileModalVisible] =
    useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null); // New state for selected product ID
  const [rejectReason, setRejectReason] = useState(""); // New state for reject reason

  // categories
  const [categories, setCategories] = useState([]);

  // subcategories
  const [subcategories, setSubcategories] = useState([]);

  const openModal = (description) => {
    setModalDescription(description);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProductId(null);
    setRejectReason("");
    setModalVisible(false);
    setRejectModal(false);
    setApproveModal(false);
  };

  // function for getting all categories
  const categoryFunction = async () => {
    try {
      // Your API call to fetch categories data
      const response = await fetch(`${AdminUrl}/api/getAllProductCatgeory`);
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  // function for getting all subcategories
  const subcategoryFunction = async () => {
    try {
      // Your API call to fetch subcategories data
      const response = await fetch(`${AdminUrl}/api/getAllSubcategories`);
      const data = await response.json();
      setSubcategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Check if 'categories' and 'subcategories' are empty
    const categoriesEmpty = categories === null || categories.length === 0;
    const subcategoriesEmpty = subcategories.length === 0;

    // Fetch data only if both 'categories' and 'subcategories' are empty
    if (categoriesEmpty || subcategoriesEmpty) {
      categoryFunction();
      subcategoryFunction();
    }
  }, [])

  useEffect(() => {
    const fetchRejectedProducts = async () => {
      try {
        const response = await fetch(`${AdminUrl}/api/getVendorProducts`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const { products } = await response.json();

        // Group products by vendorId and create products array
        const productsByVendor = {};
        products.forEach((product) => {
          const { vendor_id, ...productData } = product;
          if (!productsByVendor[vendor_id]) {
            productsByVendor[vendor_id] = {
              vendor_id,
              vendorname: product.vendorname,
              products: [],
            };
          }
          productsByVendor[vendor_id].products.push(productData);
        });

        const modifiedData = Object.values(productsByVendor);
        setRejectedProducts(modifiedData);
        setExpandedRowKeys(products.map((product) => product.vendor_id));
      } catch (error) {
        console.error("Error fetching rejected products:", error);
      }
    };
    fetchRejectedProducts();
  }, []);

  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="button"
          onClick={() => handleSearch(selectedKeys, confirm)}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <AiOutlineSearch style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  const openVendorProfileModal = (vendor, rejectedProducts) => {
    setSelectedVendor({ ...vendor, rejectedProducts });
    setVendorProfileModalVisible(true);
  };

  const closeVendorProfileModal = () => {
    setSelectedVendor(null);
    setVendorProfileModalVisible(false);
  };

  const statusMap = {
    0: "Pending",
    1: "Approved",
    2: "Rejected",
    3: "Sold",
  };

  const columns = [
    {
      title: "Vendor Name",
      dataIndex: "vendorname",
      key: "vendorname",
      render: (_, record) => {
        return (
          <p className="font-bold text-xl">
            {record.vendorname} (VID: {record.vendor_id})
          </p>
        );
      },
      ...getColumnSearchProps("vendorname"), // Apply search filter
    },
    {
      title: "Id",
      dataIndex: "product_id",
      key: "product_id",
      render: (_, record) => {
        return <p>{record.product_id}</p>;
      },
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      width: 350,
      render: (_, record) => {
        let description = record.description;
        let words = description?.split(" ");

        if (description?.length <= 10) {
          return (
            <>
              <p className="text-lg font-semibold text-justify">
                {record.product_name}
              </p>
              <p className="text-sm text-gray-400 text-justify">
                {description}
              </p>
              <p className="text-lg font-bold mt-2 text-slate-900">
                <span className="text-gray-500 mr-1">
                  {record.currency_symbol}
                </span>
                {record.price}
              </p>
            </>
          );
        } else {
          let shortDescription = words?.slice(0, 10)?.join(" ");
          return (
            <>
              <p className="text-lg font-semibold text-justify">
                {record.product_name}
              </p>
              <p className="text-sm text-gray-400 text-justify">
                {shortDescription}...{" "}
                <span
                  className="text-[12px] cursor-pointer text-blue-500"
                  type
                  onClick={() => openModal(description)}
                >
                  Read More
                </span>
              </p>
              <p className="text-lg font-bold mt-2 text-slate-900">
                <span className="text-gray-500 mr-1">
                  {record.currency_symbol}
                </span>
                {record.price}
              </p>
            </>
          );
        }
      },
    },
    {
      title: "Product Image",
      dataIndex: "images",
      key: "images",
      width: 100,
      render: (imageSrcArray) => (
        <div className="image-gallery">
          <div>
            <Image.PreviewGroup>
              {imageSrcArray?.slice(0, 2).map((image, index) => (
                <Image
                  key={index}
                  src={`${AdminUrl}/uploads/UploadedProductsFromVendors/${image}`}
                  alt="Product Image"
                  width={50}
                  height={50}
                  className="border rounded-full p-1 "
                />
              ))}
            </Image.PreviewGroup>
            {imageSrcArray?.length > 2 && (
              <Button
                className="text-sm border border-b-4"
                onClick={() => handleViewImages(imageSrcArray)}
              >
                View All {imageSrcArray?.length} Images
              </Button>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category_id",
      render: (_, record) => {
        const category = categories.find(item => item.category_id === record.category_id);
        const categoryName = category ? category.category_name : 'N/A';

        return (
          <p className="text-md font-semibold">{categoryName}</p>
        );
      }
    },
    {
      title: "SubCategory",
      dataIndex: "subcategory_id",
      key: "subcategory_id",
      render: (_, record) => {
        const subcategory = subcategories.find(item => item.subcategory_id === record.subcategory_id);
        const subcategoryName = subcategory ? subcategory.subcategory_name : 'N/A';

        return (
          <p className="text-md font-semibold">{subcategoryName}</p>
        );
      }
    },
    {
      title: "Rejection Reason",
      dataIndex: "rejection_reason",
      key: "rejection_reason",
      render: (rejection_reason, record) => {
        const truncatedReason = rejection_reason?.slice(0, 25);
        const isTruncated = rejection_reason?.length > 25;

        return (
          <div>
            <Tooltip title={rejection_reason}>
              <p className="font-semibold">
                {isTruncated ? `${truncatedReason}...` : rejection_reason}
              </p>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Vendor Details",
      dataIndex: "vendorname",
      key: "vendor-details",
      render: (_, record) => (
        <Button
          className="transition transform hover:scale-105"
          onClick={() => openVendorProfileModal(record, rejectedProducts)}
        >
          Vendor Profile
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "product_status",
      key: "product_status",
      render: (product_status, record) => {
        let icon, color;
        switch (product_status) {
          case 0:
            icon = <FiClock className="text-blue-500" />;
            color = "text-blue-600";
            break;
          case 1:
            icon = <FiCheckCircle className="text-green-500" />;
            color = "text-green-500";
            break;
          case 2:
            icon = <FiAlertCircle className="text-red-500" />;
            color = "text-red-500";
            break;
          // case 3:
          //   icon = <FiAlertCircle className="text-orange-500" />;
          //   color = "text-orange-500";
          //   break;
          default:
            icon = <FiClock className="text-gray-500" />;
            color = "text-gray-500";
        }
        return (
          <span className={`flex items-center ${color}`}>
            {icon}
            <span className="ml-1">{statusMap[product_status]}</span>
          </span>
        );
      },
      filters: [
        { text: "Pending", value: 0 },
        { text: "Approved", value: 1 },
        { text: "Rejected", value: 2 },
        // { text: "Sold", value: 3 },
      ],
      onFilter: (value, record) => record.product_status === value,
      sorter: (a, b) => a.product_status - b.product_status,
    },
    {
      title: "Uploaded at",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) =>
        moment(a.created_at).unix() - moment(b.created_at).unix(), // Custom sorting function
      render: (_, record) => (
        <p className="text-md font-semibold">
          {moment(record.created_at).format("MMMM D, YYYY hh:mm:ss A")}
        </p>
      ),
      sortDirections: ["descend", "ascend"],
      defaultSortOrder: "ascend",
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex">
          <button
            className="mr-2 flex items-center bg-green-600 rounded-lg hover:bg-green-700 text-white px-4 py-2  focus:outline-none"
            onClick={() => handleApprove(record)}
          >
            <span className="mr-1">
              <AiOutlineCheckCircle className="h-5 w-5" />
            </span>
            Approve
          </button>

          <button
            className="flex items-center bg-red-600 rounded-lg hover:bg-red-700 text-white px-4 py-2  focus:outline-none"
            onClick={() => handleReject(record)}
          >
            <span className="mr-1">
              <AiOutlineCloseCircle className="h-5 w-5" />
            </span>
            Reject
          </button>
        </div>
      ),
    },
  ];

  const handleApprove = (record) => {
    // Implement approve logic here
    setSelectedProductId(record); // Store the selected product ID
    setApproveModal(true); // Open the modal
  };

  const handleReject = (record) => {
    setSelectedProductId(record); // Store the selected product ID
    setRejectReason(record?.rejection_reason); // Reset the reject reason
    setRejectModal(true); // Open the modal
  };

  const handleModalOk = async () => {
    try {
      const response = await fetch(`${AdminUrl}/api/rejectProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProductId.product_id,
          rejectReason: rejectReason,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject the product");
      }

      const data = await response.json();

      const updatedRejectedProducts = rejectedProducts.map((item) => ({
        ...item,
        products: item.products.map((inner_i) =>
          inner_i.product_id === selectedProductId.product_id
            ? { ...inner_i, rejection_reason: rejectReason, product_status: 2 }
            : inner_i
        ),
      }));

      setRejectedProducts(updatedRejectedProducts);

      // Show success popup using Swal
      Swal.fire({
        icon: "success",
        title: "Product Rejected",
        text: data.message, // Use the success message received from the API
        confirmButtonText: "OK",
      });

      closeModal();
    } catch (error) {
      console.error("Error rejecting product:", error);
      // Show error popup using Swal
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reject the product. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleApproveLogic = async () => {
    try {
      const response = await fetch(`${AdminUrl}/api/approveProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProductId.product_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject the product");
      }

      const data = await response.json();

      const updatedRejectedProducts = rejectedProducts.map((item) => ({
        ...item,
        products: item.products.map((inner_i) =>
          inner_i.product_id === selectedProductId.product_id
            ? { ...inner_i, product_status: 1, rejection_reason: "" }
            : inner_i
        ),
      }));

      setRejectedProducts(updatedRejectedProducts);

      // Show success popup using Swal
      Swal.fire({
        icon: "success",
        title: "Product Approved",
        text: data.message, // Use the success message received from the API
        confirmButtonText: "OK",
      });

      closeModal();
    } catch (error) {
      console.error("Error Approved product:", error);
      // Show error popup using Swal
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reject the product. Please try again.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleViewImages = (images) => {
    Modal.success({
      title: "All Images",
      width: 800,
      content: (
        <div className="grid grid-cols-2 gap-4">
          {images?.map((image) => (
            <div className="w-[350px] p-2 border">
              <Image
                key={image}
                src={`${AdminUrl}/uploads/UploadedProductsFromVendors/${image}`}
                alt="Product Image"
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      ),
      okText: "Close",
      okButtonProps: { style: { backgroundColor: "green" } },
    });
  };

  return (
    <div className="sm:p-4 sm:ml-64">
      <div className="lg:w-1/2 md:w-3/4 sm:w-full p-2">
        <h1 className="text-3xl lg:text-4xl font-semibold mb-2 lg:mb-4">
          Accept/Reject Products
        </h1>
        <p className="text-sm lg:text-base text-gray-600 mb-8">
          Manage your product approvals with ease by accepting or rejecting
          product submissions.
        </p>
      </div>

      <div className="overflow-x-auto md:overscroll-none border-2">
        <Table
          className="bg-white overflow-y-auto"
          columns={columns.slice(0, -10)}
          dataSource={rejectedProducts}
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpand: (expanded, record) => {
              if (expanded) {
                setExpandedRowKeys((prevKeys) => [...prevKeys, record.vendor_id]);
              } else {
                setExpandedRowKeys((prevKeys) =>
                  prevKeys.filter((key) => key !== record.vendor_id)
                );
              }
            },
            expandedRowRender: (record) => (
              <Table
                columns={columns.slice(1)} // Exclude the Vendor Name column
                dataSource={record.products}
                rowKey="productId"
                pagination={false}
              />
            ),
          }}
          rowKey="vendor_id"
        />
      </div>

      <Modal
        title="Full Description"
        visible={modalVisible}
        onCancel={closeModal}
        footer={null}
      >
        <p>{modalDescription}</p>
      </Modal>

      <Modal
        visible={vendorProfileModalVisible}
        onCancel={closeVendorProfileModal}
        footer={null}
        width={800}
        centered
        className="my-10"
      >
        {selectedVendor && <VendorProfileDetails vendor={selectedVendor} />}
      </Modal>

      <Modal
        title={`Reject Product - Id ${selectedProductId?.product_id}`}
        visible={RejectModal}
        onCancel={closeModal}
        onOk={handleModalOk}
        okText="Reject"
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-red-500 hover:bg-red-700 text-white",
          disabled: rejectReason?.length < 25,
        }}
      >
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center justify-center text-red-600 mb-4">
            <svg
              className="h-8 w-8 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="font-semibold">Confirm Product Rejection</p>
          </div>
          <p className="text-gray-800">
            You are about to reject the product{" "}
            <span className="text-red-500 font-semibold">
              "{selectedProductId?.product_name}"
            </span>
            . This action can be undone if needed.
          </p>
          <div className="mt-4">
            <p className="mb-2 text-gray-800">
              Please provide a reason for rejecting the product (Min 25
              characters):
            </p>
            <Input.TextArea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="bg-gray-100 text-gray-800 rounded p-2"
            />
            {rejectReason?.length < 25 && (
              <p className="text-red-500 text-sm mt-2">
                Minimum 25 characters required. <br />
                {25 - rejectReason?.length} characters left.
              </p>
            )}
          </div>
          <p className="mt-4 text-gray-600 text-sm">
            Providing a reason for rejection helps maintain transparency and
            communication with vendors. It also provides valuable feedback and
            allows vendors to understand the decision better.
          </p>
        </div>
      </Modal>

      <Modal
        title={`Approve Product - ID: ${selectedProductId?.product_id}`}
        visible={ApproveModal}
        onCancel={closeModal}
        onOk={handleApproveLogic}
        okText="Approve"
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-green-500 hover:bg-green-700 text-white",
        }}
        width={600} // Adjust the width as needed
        centered // Center the modal vertically
      >
        <div>
          <p className="text-lg font-semibold">Product Information</p>
          <p className="text-gray-600 mb-4">
            Please review the product details before approving it.
          </p>

          {/* Display product details such as name, category, etc. */}
          <p>
            <strong>Product Name:</strong> {selectedProductId?.product_name}
          </p>
          <p>
            <strong>Category:</strong> {categories.find(item => item.category_id === selectedProductId?.category_id)?.category_name}
          </p>
          <p>
            <strong>Subcategory:</strong> {subcategories.find(item => item.subcategory_id === selectedProductId?.subcategory_id)?.subcategory_name}
          </p>
          {/* Include more product details as needed */}
        </div>

        <div className="mt-6">
          <p className="text-lg font-semibold">Terms and Conditions</p>
          <p className="text-gray-600 mb-4">
            By approving this product, you agree to the following terms and
            conditions:
          </p>

          <ul className="list-disc ml-8">
            <li>
              The product details and images provided by the vendor are accurate
              and valid.
            </li>
            <li>
              The product complies with all applicable regulations and laws.
            </li>
            {/* Add more terms and conditions as needed */}
          </ul>
        </div>

        <div className="mt-6">
          <p className="text-lg font-semibold">Key Notes</p>
          <p className="text-gray-600">
            Please keep the following key notes in mind while reviewing and
            approving the product:
          </p>

          <ul className="list-disc ml-8">
            <li>Ensure that the product images are clear and high-quality.</li>
            <li>
              Double-check the product description and specifications for
              accuracy.
            </li>
            <li>Verify the product pricing and currency.</li>
            <li>Confirm that the product is categorized accurately.</li>
            <li>
              Review the availability and shipping details provided by the
              vendor.
            </li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default AcceptReject;
