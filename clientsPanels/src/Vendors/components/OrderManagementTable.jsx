import React, { useEffect, useRef, useState } from "react";
import { Table, Tag, Space, Button, Modal, Image, Descriptions, Pagination, Row, Col, Tabs, Badge, Tooltip, Dropdown, Menu, Input, } from "antd";
import { FaCheck, FaClock, FaExchangeAlt, FaFilePdf, FaTimes, FaTruck, FaUndo, } from "react-icons/fa";
import { AdminUrl } from "../../Admin/constant";
import jsPDF from "jspdf";
import { CalendarOutlined, MoreOutlined, CheckCircleOutlined, CloseCircleOutlined, UndoOutlined, SwapOutlined, } from "@ant-design/icons";
import autoTable from "jspdf-autotable"; // Import the autotable function from jspdf-autotable
import OrderMetics from "./OrderMetrics";
import { DatePicker } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import Swal from "sweetalert2"; // Import SweetAlert2
import { RiEyeLine, RiRefund2Fill } from "react-icons/ri";
import "./Vendors.css";

const OrderManagementTable = ({
  vendorDatastate,
  type,
  conversionRates,
  isCurrencyloading,
  userCurrency,
}) => {
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [showCalendar, setshowCalendar] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [vendorOrder, setvendorOrder] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [DownloadOrders, setDownloadOrders] = useState([]);
  const [filteredDateRange, setFilteredDateRange] = useState(null);
  const vendorId = vendorDatastate?.[0].id;
  const { confirm } = Modal; // Import the Modal component
  const [orderDetails, setOrderDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDateRangeChange = (dates) => {
    setFilteredDateRange(dates);
  };

  const showProductDetailsModal = (product) => {
    setSelectedProduct(product);
    setProductModalVisible(true);
  };

  // const callVendorProductOrder = async () => {
  //   try {
  //     const response = await fetch(`${AdminUrl}/api/VendorProductOrder`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ type, vendorId }),
  //     });

  //     if (response.ok) {
  //       // Handle successful response
  //       const data = await response.json();
  //       setvendorOrder(data);
  //       setDownloadOrders(data);
  //       // console.log(data)
  //     } else {
  //       // Handle error response
  //       console.error("Error sending form data:", response.statusText);
  //     }
  //   } catch (error) {
  //     // Handle error
  //     console.error("Error sending form data:", error);
  //   }
  // };

  const callVendorProductOrder = async () => {
    try {

      let reqUrl = `${AdminUrl}/api/orders-all`;
      if (vendorId) {
        reqUrl = `${AdminUrl}/api/orders/vendor/${vendorId}`
      }

      const response = await fetch(reqUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })

      if (response.ok) {
        const data = await response.json()
        setvendorOrder(data)
        setDownloadOrders(data)
      } else {
        console.error("Error getting orders data: ", response.statusText)
      }
    } catch (error) {
      console.error("Error sending orders data:", error)
    }
  }

  useEffect(() => {
    callVendorProductOrder();
  }, []);

  useEffect(() => {
    // Frontend code (e.g., in a web browser)
    const shipmentDetails = {
      // Populate this object with your shipment details
      sender: {
        city: "Los Angeles",
        postalCode: "90001",
        countryCode: "US",
      },
      recipient: {
        city: "New York",
        postalCode: "10001",
        countryCode: "US",
      },
      packages: [
        {
          weight: 1,
          dimensions: {
            length: 20,
            width: 15,
            height: 10,
          },
        },
      ],
    };

    // fetch(`${AdminUrl}/api/dhlshipping`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(shipmentDetails),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     // Handle the DHL API response data from your backend here
    //     console.log(data);
    //   })
    //   .catch((error) => {
    //     // Handle any errors that occur during the request
    //     console.error(error);
    //   });
  }, []);

  const statusColorMap = {
    Pending: "blue",
    Confirmed: "green",
    Shipped: "blue", // You can adjust this color as needed
    Returned: "orange",
    Refunded: "yellow",
    Exchanged: "orange",
    Cancelled: "red",
    Delivered: "green",
  };

  const statusIconMap = {
    Pending: <FaClock />,
    Confirmed: <FaCheck />,
    Shipped: <FaTruck />,
    Returned: <FaUndo />,
    Exchanged: <FaExchangeAlt />,
    Refunded: <RiRefund2Fill />,
    Cancelled: <FaTimes />,
    Delivered: <FaTruck />,
  };

  // const columns = [
  //   {
  //     title: "Date",
  //     dataIndex: "order_date",
  //     key: "order_date",
  //     defaultSortOrder: "ascend",
  //     sorter: (a, b) => {
  //       const dateA = new Date(a.order_date);
  //       const dateB = new Date(b.order_date);
  //       const today = new Date();
  //       const yesterday = new Date(today);
  //       yesterday.setDate(yesterday.getDate() - 1);

  //       if (dateA.toDateString() === today.toDateString()) {
  //         return -1; // Date A is "Today", so it comes first
  //       } else if (dateB.toDateString() === today.toDateString()) {
  //         return 1; // Date B is "Today", so it comes first
  //       } else if (dateA.toDateString() === yesterday.toDateString()) {
  //         return -1; // Date A is "Yesterday", so it comes next
  //       } else if (dateB.toDateString() === yesterday.toDateString()) {
  //         return 1; // Date B is "Yesterday", so it comes next
  //       } else {
  //         return dateB - dateA; // Compare other dates normally in descending order
  //       }
  //     },
  //     render: (order_date) => {
  //       const date = new Date(order_date);
  //       const today = new Date();
  //       const yesterday = new Date(today);
  //       yesterday.setDate(yesterday.getDate() - 1);

  //       let dateString;

  //       if (date.toDateString() === today.toDateString()) {
  //         dateString = "Today";
  //       } else if (date.toDateString() === yesterday.toDateString()) {
  //         dateString = "Yesterday";
  //       } else {
  //         dateString = date.toLocaleDateString("en-US", {
  //           year: "numeric",
  //           month: "short",
  //           day: "numeric",
  //         });
  //       }

  //       return (
  //         <p
  //           style={{
  //             fontSize: "16px", // Adjust the font size as needed
  //             fontWeight: "bold", // Set text to bold
  //             fontFamily: "Arial", // Change to desired font family
  //             margin: "0", // Remove any margin to avoid extra spacing
  //           }}
  //         >
  //           {dateString}
  //         </p>
  //       );
  //     },
  //     // Add filter properties
  //   },
  //   {
  //     title: "Order ID",
  //     dataIndex: "order_id",
  //     key: "order_id",
  //     width: 90,
  //   },
  //   {
  //     title: "Product Name",
  //     dataIndex: "product_name",
  //     key: "product_name",
  //     width: 200,
  //     render: (product_name, record) => (
  //       <Button type="link" onClick={() => showProductDetailsModal(record)}>
  //         {product_name}
  //       </Button>
  //     ),
  //   },
  //   {
  //     title: "Customer",
  //     dataIndex: "customer_name",
  //     key: "customer_name",
  //     width: 150,
  //     render: (customer_name, record) => (
  //       <div>
  //         <p>{customer_name}</p>
  //         <p>{record.customer_email}</p>
  //         <p>{record.customer_phone_number}</p>
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Order Date",
  //     dataIndex: "order_date",
  //     key: "order_date",
  //     width: 200,
  //     sorter: (a, b) => new Date(a.order_date) - new Date(b.order_date),
  //     render: (order_date) => {
  //       const formattedDate = new Date(order_date).toLocaleDateString("en-US", {
  //         year: "numeric",
  //         month: "short",
  //         day: "numeric",
  //         hour: "numeric",
  //         minute: "numeric",
  //         hour12: true,
  //       });

  //       return <p>{formattedDate}</p>;
  //     },
  //   },
  //   {
  //     title: "Total Amount",
  //     dataIndex: "total_amount",
  //     key: "total_amount",
  //     width: 150,
  //     render: (total_amount, record) =>
  //       `${record.currency_symbol} ${total_amount}`,
  //   },
  //   {
  //     title: "Status",
  //     dataIndex: "order_status",
  //     key: "order_status",
  //     width: 150,
  //     onFilter: (value, record) => record.order_status.includes(value),
  //     render: (order_status) => (
  //       <Tag
  //         className={`flex justify-center items-center px-2 py-2 border-none text-sm text-${statusColorMap[order_status]}-500`}
  //       >
  //         {statusIconMap[order_status]}
  //         <p className="px-2">{order_status}</p>
  //       </Tag>
  //     ),
  //   },
  //   {
  //     title: "Transaction ID",
  //     dataIndex: "transaction_id",
  //     key: "transaction_id",
  //     width: 150,
  //     render: (transactionId) => transactionId || "N/A", // Render 'N/A' if transaction_id is null
  //   },
  //   {
  //     title: "Payment Method",
  //     dataIndex: "payment_method",
  //     key: "payment_method",
  //     width: 150,
  //   },
  //   {
  //     title: "Payment Status",
  //     dataIndex: "payment_status",
  //     key: "payment_status",
  //     width: 150,
  //   },
  //   {
  //     title: "Actions",
  //     dataIndex: "actions",
  //     key: "actions",
  //     width: 150, // Adjust the width as needed
  //     render: (text, record) => (
  //       <Space>
  //         <Dropdown
  //           overlay={
  //             <Menu
  //               onClick={({ key }) => handleActionClick(key, record.order_id)}
  //             >
  //               <Menu.Item key="confirm">Confirmed</Menu.Item>
  //               <Menu.Item key="cancel">Cancel</Menu.Item>
  //               <Menu.Item key="return">Return</Menu.Item>
  //               <Menu.Item key="exchange">Exchange</Menu.Item>
  //               <Menu.Item key="refund">Refunded</Menu.Item>
  //             </Menu>
  //           }
  //           trigger={["click"]}
  //         >
  //           <Button type="button" icon={<MoreOutlined />} />
  //         </Dropdown>
  //       </Space>
  //     ),
  //   },
  // ];

  useEffect(() => {
    // This code will run whenever vendorOrder changes
    if (modalVisible) {
      setOrderDetails(vendorOrder.find((order) => order.order_id === orderDetails.order_id));
    }
  }, [modalVisible, vendorOrder]);

  const viewOrderItems = (order_id) => {
    setOrderDetails(vendorOrder.find((order) => order.order_id === order_id))
    setModalVisible(true)
  }
  const handleCancel = () => {
    setModalVisible(false)
    setOrderDetails([])
  }

  const ordercolumns = [
    {
      title: "Order Item ID",
      dataIndex: "order_item_id",
      key: "order_item_id",
      sorter: (a, b) => a.order_item_id - b.order_item_id
    },
    {
      title: "Vendor",
      dataIndex: "vendor_id",
      key: "vendor_id",
      sorter: (a, b) => a.vendor_id - b.vendor_id,
      render: (vendor_id, record) => {
        return <p><span className="font-semibold">[{vendor_id}]</span> {record.vendor_name}</p>
      }
    },
    {
      title: "Product",
      dataIndex: "product_id",
      key: "product_id",
      sorter: (a, b) => a.product_id - b.product_id,
      render: (product_id, record) => {
        return <p><span className="font-semibold">[{product_id}]</span> {record.product_name}</p>
      }
    },
    {
      title: "Add-Ons",
      dataIndex: "add_ons",
      key: "add_ons",
      render: (add_ons) => (
        <ul style={{ listStyleType: "disc" }}>
          {add_ons ? (add_ons.map((addon, index) => (
            <li key={index}>{addon}</li>
          ))) : (<span></span>)}
        </ul>
      ),
    },
    {
      title: "Size",
      dataIndex: "product_size",
      key: "product_size",
    },
    {
      title: "Color",
      dataIndex: "product_color",
      key: "product_color",
    },
    {
      title: "Product Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price, record) => {
        return (record.currency !== null ? record.currency : '') + " " + (price !== null ? price : 0)
      }
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity
    },
    {
      title: "Order Item Status",
      dataIndex: "order_item_status",
      key: "order_item_status",
      render: (order_item_status) => (
        <Tag
          className={`flex justify-center items-center px-2 py-2 border-none text-sm text-${statusColorMap[order_item_status]}-500`}
        >
          {statusIconMap[order_item_status]}
          <p className="px-2">{order_item_status}</p>
        </Tag>
      )
    },
    {
      title: "Cancellation Reason",
      dataIndex: "cancellation_reason",
      key: "cancellation_reason"
    },
    {
      title: "Status Update Date",
      dataIndex: "statusupdate_date",
      key: "statusupdate_date",
      sorter: (a, b) => new Date(a.statusupdate_date) - new Date(b.statusupdate_date),
      render: (statusupdate_date) => {
        return new Date(statusupdate_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
      }
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 150, // Adjust the width as needed
      render: (text, record) => (
        <Space>
          <Dropdown
            overlay={
              <Menu
                onClick={({ key }) => handleItemActionClick(record.order_id, record.order_item_id, key)}
              >
                <Menu.Item key="confirm">Confirmed</Menu.Item>
                <Menu.Item key="cancel">Cancel</Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button type="button" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ]

  const paymentcolumns = [
    {
      title: "Payment ID",
      dataIndex: "payment_id",
      key: "payment_id",
      sorter: (a, b) => a.payment_id - b.payment_id
    },
    {
      title: "Transaction ID",
      dataIndex: "transaction_id",
      key: "transaction_id",
      sorter: (a, b) => a.transaction_id - b.transaction_id
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Payment Date",
      dataIndex: "payment_date",
      key: "payment_date",
      sorter: (a, b) => new Date(a.payment_date) - new Date(b.payment_date),
      render: (payment_date) => {
        return new Date(payment_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
      }
    },
  ]

  const columns = [
    {
      title: "Date",
      dataIndex: "order_date",
      key: "order_date",
      defaultSortOrder: "ascend",
      sorter: (a, b) => {
        const dateA = new Date(a.order_date);
        const dateB = new Date(b.order_date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (dateA.toDateString() === today.toDateString()) {
          return -1; // Date A is "Today", so it comes first
        } else if (dateB.toDateString() === today.toDateString()) {
          return 1; // Date B is "Today", so it comes first
        } else if (dateA.toDateString() === yesterday.toDateString()) {
          return -1; // Date A is "Yesterday", so it comes next
        } else if (dateB.toDateString() === yesterday.toDateString()) {
          return 1; // Date B is "Yesterday", so it comes next
        } else {
          return dateB - dateA; // Compare other dates normally in descending order
        }
      },
      render: (order_date) => {
        const date = new Date(order_date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let dateString;

        if (date.toDateString() === today.toDateString()) {
          dateString = "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
          dateString = "Yesterday";
        } else {
          dateString = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }

        return (
          <p
            style={{
              fontSize: "16px", // Adjust the font size as needed
              fontWeight: "bold", // Set text to bold
              fontFamily: "Arial", // Change to desired font family
              margin: "0", // Remove any margin to avoid extra spacing
            }}
          >
            {dateString}
          </p>
        );
      },
      // Add filter properties
    },
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
      width: 90,
    },
    {
      title: "Customer",
      dataIndex: "customer_name",
      key: "customer_name",
      width: 150,
      render: (customer_name, record) => (
        <div>
          <p>{customer_name}</p>
          <p>{record.customer_email}</p>
          <p>{record.customer_phone_number}</p>
        </div>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "order_date",
      key: "order_date",
      width: 200,
      sorter: (a, b) => new Date(a.order_date) - new Date(b.order_date),
      render: (order_date) => {
        const formattedDate = new Date(order_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });

        return <p>{formattedDate}</p>;
      },
    },
    {
      title: "Order Updated Date",
      dataIndex: "order_updated_date",
      key: "order_updated_date",
      width: 200,
      sorter: (a, b) => new Date(a.order_updated_date) - new Date(b.order_updated_date),
      render: (order_updated_date) => {
        const formattedDate = new Date(order_updated_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });

        return <p>{formattedDate}</p>;
      },
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      width: 150,
      render: (total_amount, record) =>
        `${record.currency} ${total_amount}`,
    },
    {
      title: "Status",
      dataIndex: "order_status",
      key: "order_status",
      width: 150,
      onFilter: (value, record) => record.order_status.includes(value),
      render: (order_status) => (
        <Tag
          className={`flex justify-center items-center px-2 py-2 border-none text-sm text-${statusColorMap[order_status]}-500`}
        >
          {statusIconMap[order_status]}
          <p className="px-2">{order_status}</p>
        </Tag>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 150, // Adjust the width as needed
      render: (text, record) => (
        <Space>
          {record.order_items ? (
            <Badge size="small" count={record.order_items.length}>
              <RiEyeLine
                onClick={() => viewOrderItems(record.order_id)}
                className="text-white w-8 h-8 p-2 rounded-full bg-[#081831] border-none hover:bg-[#337ab7] hover:text-white"
              />
            </Badge>
          ) : (
            // Handle the case where record.order_items is null or undefined
            <span>No order items</span>
          )}
          {
            !vendorId && (
              <Dropdown
                overlay={
                  <Menu
                    onClick={({ key }) => handleActionClick(key, record.order_id)}
                  >
                    <Menu.Item key="confirm">Confirmed</Menu.Item>
                    <Menu.Item key="cancel">Cancel</Menu.Item>
                    <Menu.Item key="return">Return</Menu.Item>
                    <Menu.Item key="exchange">Exchange</Menu.Item>
                    <Menu.Item key="refund">Refunded</Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
              >
                <Button type="button" icon={<MoreOutlined />} />
              </Dropdown>
            )
          }
        </Space>
      ),
    },
  ];

  // Define a function to send the status update request
  const sendStatusUpdateRequest = async (order_id, order_status) => {
    try {
      // const requestData = {
      //   order_id: order_id,
      //   status: status,
      //   vendorId,
      // };

      // const response = await fetch(`${AdminUrl}/api/manageStatus`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(requestData),
      // });

      const response = await fetch(`${AdminUrl}/api/orders/${order_id}/status`, {
        method: 'PUT',
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({ order_status: order_status })
      })

      if (response.ok) {
        const updatedOrders = vendorOrder.map((order) => {
          if (order.order_id === order_id) {
            return {
              ...order,
              order_status: order_status,
            };
          }
          return order;
        });

        setvendorOrder(updatedOrders);

        // Display a success message using SweetAlert2
        Swal.fire({
          icon: "success",
          title: `Order ${order_status} successfully`,
          showConfirmButton: false,
          timer: 1500, // Automatically close after 1.5 seconds
        });
      } else {
        // Display an error message using SweetAlert2
        Swal.fire({
          icon: "error",
          title: `Error ${order_status}ing order`,
          text: "An error occurred while updating the order status.",
        });
      }
    } catch (error) {
      console.error(`An error occurred while ${order_status}ing the order`, error);

      // Display an error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: `Error ${order_status}ing order`,
        text: "An error occurred while updating the order status.",
      });
    }
  };

  // Define the handleActionClick function
  const handleActionClick = (action, order_id) => {
    let confirmationMessage = "";
    let actionIcon = null;
    let valuableInfo = "";
    let okButtonText = "OK";
    let status = "";
    let buttonColor = "";

    switch (action) {
      case "confirm":
        confirmationMessage = "Are you sure you want to confirm this order?";
        actionIcon = <CheckCircleOutlined className="text-green-600" />;
        valuableInfo = "confirm this order to proceed.";
        okButtonText = "Confirm";
        status = "Confirmed";
        buttonColor = "green";
        break;
      case "cancel":
        confirmationMessage = "Are you sure you want to cancel this order?";
        actionIcon = <CloseCircleOutlined className="text-red-600" />;
        valuableInfo = "Cancelling this order will mark it as cancelled.";
        okButtonText = "Cancel";
        status = "Cancelled";
        buttonColor = "red";
        break;
      case "return":
        confirmationMessage =
          "Are you sure you want to process a return for this order?";
        actionIcon = <UndoOutlined className="text-blue-600" />;
        valuableInfo =
          "Processing a return for this order will initiate a return request.";
        okButtonText = "Return";
        status = "Returned";
        buttonColor = "blue";
        break;
      case "refund":
        confirmationMessage =
          "Are you sure you want to process a refund for this order?";
        actionIcon = <UndoOutlined className="text-blue-600" />;
        valuableInfo =
          "Processing a refund for this order will initiate a refund request.";
        okButtonText = "Refund";
        status = "Refunded";
        buttonColor = "blue";
        break;
      case "exchange":
        confirmationMessage =
          "Are you sure you want to process an exchange for this order?";
        actionIcon = <SwapOutlined className="text-orange-600" />;
        valuableInfo =
          "Processing an exchange for this order will initiate an exchange request.";
        okButtonText = "Exchange";
        status = "Exchanged";
        buttonColor = "orange";
        break;
      default:
        break;
    }

    confirm({
      title: "Confirm Action",
      icon: actionIcon,
      content: (
        <div>
          <p>{confirmationMessage}</p>
          <p style={{ color: buttonColor }}>{valuableInfo}</p>
        </div>
      ),
      okText: okButtonText,
      okButtonProps: {
        style: {
          background: buttonColor,
          borderColor: buttonColor,
          color: "white",
        },
      },
      onOk() {
        sendStatusUpdateRequest(order_id, status);
      },
      onCancel() {
        // User canceled the action
      },
    });
  };

  const cancellationReasonRef = useRef("");

  // Define a function to send the item status update request
  const sendItemStatusUpdateRequest = async (order_id, order_item_id, order_item_status) => {
    const cancellationReason = cancellationReasonRef.current.value;
    // console.log(cancellationReason)
    try {
      const response = await fetch(`${AdminUrl}/api/orders/order_item_status`, {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
        },
        body: JSON.stringify({ order_item_id: order_item_id, order_item_status: order_item_status, cancellation_reason: cancellationReason })
      })

      if (response.ok) {
        const updatedOrders = vendorOrder.map((order) => {
          if (order.order_id === order_id.toString()) {
            const updatedOrderItems = order.order_items.map((orderItem) => {
              if (orderItem.order_item_id === order_item_id) {
                // console.log("Updating order item:", orderItem);
                const updatedItem = {
                  ...orderItem,
                  order_item_status: order_item_status,
                  cancellation_reason: cancellationReason,
                };
                // console.log("Updated order item:", updatedItem);
                return updatedItem;
              }
              return orderItem;
            });

            // console.log("Updating order:", order);
            const updatedOrder = {
              ...order,
              order_items: updatedOrderItems,
            };
            // console.log("Updated order:", updatedOrder);
            return updatedOrder;
          }
          return order;
        });

        // console.log("Updated orders array:", updatedOrders);
        setvendorOrder(updatedOrders);

        // Display a success message using SweetAlert2
        Swal.fire({
          icon: "success",
          title: `Order ${order_item_status} successfully`,
          showConfirmButton: false,
          timer: 1500, // Automatically close after 1.5 seconds
        });
      } else {
        // Display an error message using SweetAlert2
        Swal.fire({
          icon: "error",
          title: `Error ${order_item_status}ing order`,
          text: "An error occurred while updating the order status.",
        });
      }
    } catch (error) {
      console.error(`An error occurred while ${order_item_status}ing the order`, error);

      // Display an error message using SweetAlert2
      Swal.fire({
        icon: "error",
        title: `Error ${order_item_status}ing order`,
        text: "An error occurred while updating the order status.",
      });
    }
  };


  // Define the handleItemActionClick function
  const handleItemActionClick = (order_id, order_item_id, action) => {
    let confirmationMessage = "";
    let actionIcon = null;
    let valuableInfo = "";
    let okButtonText = "OK";
    let status = "";
    let buttonColor = "";

    switch (action) {
      case "confirm":
        confirmationMessage = "Are you sure you want to confirm this order?";
        actionIcon = <CheckCircleOutlined className="text-green-600" />;
        valuableInfo = "confirm this order to proceed.";
        okButtonText = "Confirm";
        status = "Confirmed";
        buttonColor = "green";
        break;
      case "cancel":
        confirmationMessage = "Are you sure you want to cancel this order?";
        actionIcon = <CloseCircleOutlined className="text-red-600" />;
        valuableInfo = "Cancelling this order will mark it as cancelled.";
        okButtonText = "Cancel";
        status = "Cancelled";
        buttonColor = "red";
        break;
      case "return":
        confirmationMessage =
          "Are you sure you want to process a return for this order?";
        actionIcon = <UndoOutlined className="text-blue-600" />;
        valuableInfo =
          "Processing a return for this order will initiate a return request.";
        okButtonText = "Return";
        status = "Returned";
        buttonColor = "blue";
        break;
      case "refund":
        confirmationMessage =
          "Are you sure you want to process a refund for this order?";
        actionIcon = <UndoOutlined className="text-blue-600" />;
        valuableInfo =
          "Processing a refund for this order will initiate a refund request.";
        okButtonText = "Refund";
        status = "Refunded";
        buttonColor = "blue";
        break;
      case "exchange":
        confirmationMessage =
          "Are you sure you want to process an exchange for this order?";
        actionIcon = <SwapOutlined className="text-orange-600" />;
        valuableInfo =
          "Processing an exchange for this order will initiate an exchange request.";
        okButtonText = "Exchange";
        status = "Exchanged";
        buttonColor = "orange";
        break;
      default:
        break;
    }

    confirm({
      title: "Confirm Action",
      icon: actionIcon,
      content: (
        <div>
          <p>{confirmationMessage}</p>
          {action === 'cancel' && (
            <div className="my-2">
              <label htmlFor="cancellationReason">Please provide a cancellation reason:</label>
              <textarea
                className="border border-1 text-sm p-2 w-full rounded-md focus:border-none"
                ref={cancellationReasonRef}
              />
            </div>
          )}
          <p style={{ color: buttonColor }}>{valuableInfo}</p>
        </div>
      ),
      okText: okButtonText,
      okButtonProps: {
        style: {
          background: buttonColor,
          borderColor: buttonColor,
          color: "white",
        },
      },
      onOk() {
        sendItemStatusUpdateRequest(order_id, order_item_id, status);
      },
      onCancel() {
        // User canceled the action
      },
    });
  };

  const statusSteps = [
    { status: "Placed", label: "Order Placed", color: "blue" },
    { status: "Processing", label: "Order Processing", color: "orange" },
    { status: "Shipped", label: "Order Shipped", color: "green" },
    { status: "Delivered", label: "Order Delivered", color: "green" },
    { status: "Cancelled", label: "Order Cancelled", color: "red" },
  ];

  // Find the corresponding status step object based on the order status
  const currentStep = statusSteps.find(
    (step) => step.status === selectedProduct?.order_status
  );

  const handleDownloadPDF = () => {
    if (!jsPDF) {
      return;
    }

    const doc = new jsPDF();
    const shortenedTableHeaders = [
      "ID",
      // "Product",
      "Customer",
      "Date",
      "Amount",
      "Status",
      // "Trans",
      // "Method",
      // "Pay",
    ];

    const filteredOrders = DownloadOrders.filter((order) => {
      const orderDate = new Date(order.order_date);
      return (
        !filteredDateRange ||
        (orderDate >= filteredDateRange[0] && orderDate <= filteredDateRange[1])
      );
    });

    const sortedVendorOrder = filteredOrders
      .slice()
      .sort((a, b) => a.order_id - b.order_id);

    const tableData = sortedVendorOrder.map((order) => [
      order.order_id,
      // order.product_name,
      order.customer_name,
      // order.customer_name +
      // "\n" +
      // order.customer_email +
      // "\n" +
      // order.customer_phone_number,
      new Date(order.order_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      `${order.currency} ${order.total_amount}`,
      order.order_status,
      // order.transaction_id || "N/A",
      // order.payment_method,
      // order.payment_status,
    ]);

    const startY = 46;
    const startX = 10;

    const logoDataURL = "/logo.png";

    const logoElement = document.createElement("img");
    logoElement.src = logoDataURL;

    logoElement.onload = function () {
      const logoWidth = 20;
      const logoHeight = (logoElement.height * logoWidth) / logoElement.width;

      const tableOptions = {
        startY,
        startX,
        margin: { top: 10, bottom: 10 },
        headStyles: { fontSize: 8, textColor: [255, 255, 255] },
        bodyStyles: { fontSize: 8 },
        styles: { overflow: "linebreak" },
        columnStyles: {
          2: { columnWidth: "auto" },
          3: { columnWidth: "auto" },
          4: { columnWidth: "auto" },
          6: { columnWidth: "auto" },
          8: { columnWidth: "auto" },
        },
      };

      const titleText = "All Orders";
      const dateRangeText = filteredDateRange
        ? `Date Range: ${filteredDateRange[0].format(
          "DD MMM, YYYY"
        )} - ${filteredDateRange[1].format("DD MMM, YYYY")}`
        : "Overall Records";

      const textWidth =
        (doc.getStringUnitWidth(titleText) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.addImage(logoElement, "PNG", 10, 15, logoWidth, logoHeight);
      doc.text(titleText, (pageWidth - textWidth) / 2, 25);
      doc.text(
        dateRangeText,
        (pageWidth -
          (doc.getStringUnitWidth(dateRangeText) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor) /
        2,
        35
      );
      doc.setFontSize(10);

      doc.autoTable(shortenedTableHeaders, tableData, tableOptions);
      doc.save("order_management.pdf");
    };
  };

  const generateOrderTableContent = (orderStatus) => {
    let filteredOrders;
    if (orderStatus === "All") {
      filteredOrders = vendorOrder.filter((order) => {
        if (!filteredDateRange) {
          return true; // No filter applied
        }
        const orderDate = new Date(order.order_date);
        const startDate = new Date(filteredDateRange[0]);
        startDate.setDate(startDate.getDate() - 1); // Subtract 1 day from the start date
        const endDate = new Date(filteredDateRange[1]);
        return orderDate >= startDate && orderDate <= endDate;
      });
    } else {
      filteredOrders = vendorOrder
        .filter((order) => order.order_status === orderStatus)
        .filter((order) => {
          if (!filteredDateRange) {
            return true; // No filter applied
          }
          const orderDate = new Date(order.order_date);
          const startDate = new Date(filteredDateRange[0]);
          startDate.setDate(startDate.getDate() - 1); // Subtract 1 day from the start date
          const endDate = new Date(filteredDateRange[1]);
          return orderDate >= startDate && orderDate <= endDate;
        });
    }

    const groupedOrders = filteredOrders.reduce((result, order) => {
      const orderDate = new Date(order.order_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      if (!result[orderDate]) {
        result[orderDate] = [];
      }

      result[orderDate].push(order);
      return result;
    }, {});

    const expandedRowKeys = Object.keys(groupedOrders);

    return (
      <Table
        columns={columns.slice(0, -7)}
        dataSource={Object.entries(groupedOrders).map(
          ([orderDate, orders]) => ({
            order_date: orderDate,
            orders,
          })
        )}
        pagination={false}
        className="ant-table-bordered"
        expandable={{
          expandedRowKeys: expandedRowKeys,
          onExpand: (expanded, record) => {
            // This part can be left as is
            if (expanded) {
              setExpandedRowKeys((prevKeys) => [
                ...prevKeys,
                record.order_date,
              ]);
            } else {
              setExpandedRowKeys((prevKeys) =>
                prevKeys.filter((key) => key !== record.order_date)
              );
            }
          },
          expandedRowRender: (record) => {
            const filteredNestedOrders = record.orders;

            return (
              <Table
                columns={columns.slice(1)} // Exclude the Order Date column
                dataSource={filteredNestedOrders}
                rowKey="order_id"
                pagination={false}
              />
            );
          },
        }}
        rowKey="order_date"
      />
    );
  };

  const CustomBadge = ({ count }) => (
    <span
      className={`inline-flex items-center justify-center rounded-full w-8 h-8 text-[14px]  ml-2 ${count === 0 ? "bg-red-200" : "bg-green-200"
        }`}
    >
      {count === 0 ? 0 : count}
    </span>
  );

  const generateTabTitle = (orderStatus, count) => (
    <div className="flex justify-center w-full items-center">
      {orderStatus} <CustomBadge count={count} />
    </div>
  );

  const handleTabChange = (key) => {
    // Filter the vendorOrder array based on the order_status using the key parameter
    const filteredOrders =
      key === "All"
        ? vendorOrder.filter((order) => {
          if (!filteredDateRange) {
            return true; // No filter applied
          }
          const orderDate = new Date(order.order_date);
          const startDate = new Date(filteredDateRange[0]);
          startDate.setDate(startDate.getDate() - 1); // Subtract 1 day from the start date
          const endDate = new Date(filteredDateRange[1]);
          return orderDate >= startDate && orderDate <= endDate;
        })
        : vendorOrder
          .filter((order) => order.order_status === key)
          .filter((order) => {
            if (!filteredDateRange) {
              return true; // No filter applied
            }
            const orderDate = new Date(order.order_date);
            const startDate = new Date(filteredDateRange[0]);
            startDate.setDate(startDate.getDate() - 1); // Subtract 1 day from the start date
            const endDate = new Date(filteredDateRange[1]);
            return orderDate >= startDate && orderDate <= endDate;
          });

    setDownloadOrders(filteredOrders);

    // Add your logic here with the filteredOrders array
  };

  const OpenDatepicker = () => {
    setshowCalendar(!showCalendar);
  };

  return (
    <div className="mb-72">
      {type !== "admin" && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="fashionfont text-[20px] text-[#000] font-semibold mb-1 font-sans">Order Management</h2>
              <p className="text-[14px] text-[#495057]">
                Explore the key metrics and performance indicators for your order management.
              </p>
            </div>
          </div>

          <OrderMetics
            vendorDatastate={vendorDatastate}
            type={""}
            conversionRates={conversionRates}
            isCurrencyloading={isCurrencyloading}
            userCurrency={userCurrency}
          />
        </>
      )}

      <div className="mt-10">
        <div className="flex justify-between">
          <div>
            <h1 className="fashionfont text-[20px] text-[#000] font-semibold mb-1 font-sans ">
              {type === "admin"
                ? "Handle All Orders "
                : "Manage Your Orders Here "}
              {filteredDateRange && (
                <>
                  ({filteredDateRange[0].format("DD MMM, YYYY")} -{" "}
                  {filteredDateRange[1].format("DD MMM, YYYY")})
                </>
              )}
            </h1>

            <p className="text-[14px] text-[#495057] mb-6">
              Effortlessly organize and control orders in a structured table
            </p>
          </div>
          {DownloadOrders?.length > 0 && (
            <Row justify="end" align="middle" className="mb-5 mr-4">
              <div className="relative">
                <CalendarOutlined
                  onClick={OpenDatepicker}
                  className="w-96 p-2 justify-end flex text-2xl mr-4"
                />
                {showCalendar && (
                  <div className="absolute top-1 -left-14 w-full">
                    <DatePicker.RangePicker
                      value={filteredDateRange}
                      onChange={handleDateRangeChange}
                      className="mb-4 w-full"
                      suffixIcon={<CalendarOutlined />}
                    />
                  </div>
                )}
              </div>
              {/* <Col> */}
              <Button
                // type="primary"
                icon={<FaFilePdf className="hover:text-white" style={{ fontSize: "24px" }} />} // Increase the fontSize value to adjust the size
                onClick={handleDownloadPDF}
                className="dsagarh hover:text-white flex py-5 border-none justify-center items-center bg-[#003032] hover:bg-[#003032]/80 text-white transform transition-all duration-300 ease-in-out hover:scale-105"
              >
                Download PDF
              </Button>
              {/* </Col> */}
            </Row>
          )}
        </div>
        <Tabs defaultActiveKey="All" onChange={handleTabChange}>
          <TabPane
            tab={generateTabTitle("All", vendorOrder?.length)}
            key={"All"}
          >
            {generateOrderTableContent("All")}
          </TabPane>
          <TabPane
            tab={generateTabTitle(
              "Pending",
              vendorOrder.filter((order) => order.order_status === "Pending")
                .length
            )}
            key={"Pending"}
          >
            {generateOrderTableContent("Pending")}
          </TabPane>

          <TabPane
            tab={generateTabTitle(
              "Confirmed",
              vendorOrder.filter((order) => order.order_status === "Confirmed")
                .length
            )}
            key={"Confirmed"}
          >
            {generateOrderTableContent("Confirmed")}
          </TabPane>

          <TabPane
            tab={generateTabTitle(
              "Shipped",
              vendorOrder.filter((order) => order.order_status === "Shipped")
                .length
            )}
            key={"Shipped"}
          >
            {generateOrderTableContent("Shipped")}
          </TabPane>

          <TabPane
            tab={generateTabTitle(
              "Returned",
              vendorOrder.filter((order) => order.order_status === "Returned")
                .length
            )}
            key={"Returned"}
          >
            {generateOrderTableContent("Returned")}
          </TabPane>

          <TabPane
            tab={generateTabTitle(
              "Refunded",
              vendorOrder.filter((order) => order.order_status === "Refunded")
                .length
            )}
            key={"Refunded"}
          >
            {generateOrderTableContent("Refunded")}
          </TabPane>
          <TabPane
            tab={generateTabTitle(
              "Exchanged",
              vendorOrder.filter((order) => order.order_status === "Exchanged")
                .length
            )}
            key={"Exchanged"}
          >
            {generateOrderTableContent("Exchanged")}
          </TabPane>

          <TabPane
            tab={generateTabTitle(
              "Cancelled",
              vendorOrder.filter((order) => order.order_status === "Cancelled")
                .length
            )}
            key={"Cancelled"}
          >
            {generateOrderTableContent("Cancelled")}
          </TabPane>

          <TabPane
            tab={generateTabTitle(
              "Delivered",
              vendorOrder.filter((order) => order.order_status === "Delivered")
                .length
            )}
            key={"Delivered"}
          >
            {generateOrderTableContent("Delivered")}
          </TabPane>
        </Tabs>
      </div>
      <Modal
        visible={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="ok" type="primary" onClick={handleCancel} className='bg-[#081831] hover:bg-[#337ab7]'>
            Close
          </Button>,
        ]}
        width={900}
      >
        <div className="table-responsive overflow-hidden overflow-x-auto mt-4 ">
          <h1 className="text-xl">Order Items</h1>
          <Table
            columns={ordercolumns}
            dataSource={orderDetails.order_items}
            pagination={false}
            className="w-full overflow-auto"
            rowClassName="bg-white dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
          />
          {!vendorId && (
            <>
              <h1 className="text-xl mt-10">Payment Transactions</h1>
              <Table
                columns={paymentcolumns} // Define columns for payment transactions
                dataSource={orderDetails.payment_transactions}
                pagination={false}
                className="w-full"
                rowClassName="bg-white dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
              />
            </>
          )}

        </div>
      </Modal>

      <Modal
        title="Product Details"
        visible={productModalVisible}
        onCancel={() => setProductModalVisible(false)}
        footer={null}
        width={1000} // Set an appropriate width for the modal
      >
        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:pr-4 grid place-items-center md:mb-24 max-sm:p-2">
              {selectedProduct.product_image ? (
                <Image
                  src={selectedProduct.product_image}
                  alt={selectedProduct.product_name}
                  className="max-w-full h-full cursor-pointer object-contain"
                />
              ) : (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi3iWCijcyjAgZtojGrZI_-2w3Xi8L3xHkoMDnSRmPRquaCRgXYhoeoDZDydqgRUGlG28&usqp=CAU"
                  alt={selectedProduct.product_name}
                  className="max-w-full h-full cursor-pointer object-contain"
                />
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                {selectedProduct.product_name}
              </h3>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Unique ID">
                  {selectedProduct.product_uniqueid}
                </Descriptions.Item>
                <Descriptions.Item label="Price">
                  {selectedProduct.currency_symbol}{" "}
                  {selectedProduct.total_amount}
                </Descriptions.Item>
                <Descriptions.Item label="Location">
                  {selectedProduct.city}, {selectedProduct.state},{" "}
                  {selectedProduct.country}
                </Descriptions.Item>
                <Descriptions.Item label="Brand">
                  {selectedProduct.brand}
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                  {selectedProduct.category}
                </Descriptions.Item>
                <Descriptions.Item label="Subcategory">
                  {selectedProduct.subcategory}
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                  {currentStep ? (
                    <span className={`text-${currentStep.color}-600`}>
                      {currentStep.label}
                    </span>
                  ) : (
                    <span className="text-gray-600">Unknown Status</span>
                  )}
                </Descriptions.Item>
                {selectedProduct.rejection_reason && (
                  <Descriptions.Item label="Rejection Reason">
                    {selectedProduct.rejection_reason}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Product Type">
                  {selectedProduct.product_type}
                </Descriptions.Item>
                {/* Add more product details as needed */}
              </Descriptions>
              <div className="mt-4 space-y-4">
                <h4 className="text-lg font-semibold">Customer Information</h4>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedProduct.customer_email}
                </p>
                <p>
                  <span className="font-semibold">Phone Number:</span>{" "}
                  {selectedProduct.customer_phone_number}
                </p>
                {/* Add more customer details as needed */}
              </div>
              <div className="mt-8 space-y-4">
                <h4 className="text-lg font-semibold">Payment Information</h4>
                <p>
                  <span className="font-semibold">Method:</span>{" "}
                  {selectedProduct.payment_method}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedProduct.payment_status}
                </p>
                {selectedProduct.payment_method !== "Cash" && (
                  <p>
                    <span className="font-semibold">Transaction ID:</span>{" "}
                    {selectedProduct.transaction_id}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Customer Details"
        visible={customerModalVisible}
        onCancel={() => setCustomerModalVisible(false)}
        footer={null}
      >
        {/* Render customer details here using selectedCustomer */}
      </Modal>
    </div>
  );
};

export default OrderManagementTable;
