import React, { useState, useEffect } from "react";
import { DatePicker, Button, Typography, Table, Card, Row, Col } from "antd";
import { AdminUrl } from "../Admin/constant";
const { Title, Text } = Typography;
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaDownload } from "react-icons/fa";
import "./components/Vendors.css";

const Reports = ({ vendorDatastate }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [reportData, setReportData] = useState(null);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleSubmit = () => {
    const [startDate, endDate] = dateRange;
    const vendorId = vendorDatastate?.[0]?.id;

    fetch(
      `${AdminUrl}/api/generateReport?startDate=${startDate}&endDate=${endDate}&vendorId=${vendorId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setReportData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function generatePDF(reportData, dateRange, vendorDatastate) {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Define a function for adding centered text
    function addCenteredText(text, fontSize, yPosition) {
      const textWidth =
        (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
      const pageWidth = doc.internal.pageSize.getWidth();
      const xPosition = (pageWidth - textWidth) / 2;
      doc.setFontSize(fontSize);
      doc.text(text, xPosition, yPosition);
    }

    // Add company logo (small and fixed in top-left corner)
    const logoWidth = 40;
    const logoHeight = 25;
    doc.addImage("/logo-black.png", "JPEG", 10, 10, logoWidth, logoHeight);

    // Add start and end date on the right top corner
    const formattedStartDate =
      dateRange[0] && new Date(dateRange[0]).toLocaleDateString("en-US");
    const formattedEndDate =
      dateRange[1] && new Date(dateRange[1]).toLocaleDateString("en-US");
    const rightX = doc.internal.pageSize.getWidth() - 80; // Rightmost position

    // Add formatted start and end date
    doc.setFontSize(12);
    doc.text(`${formattedStartDate} - ${formattedEndDate}`, rightX, 20);

    // Set the font size for vendor details
    doc.setFontSize(10);

    // Add vendor details text
    doc.text(`ID: ${vendorDatastate?.[0]?.id}`, rightX, 25);
    doc.text(`Brand Name: ${vendorDatastate?.[0]?.brand_name}`, rightX, 30);
    doc.text(`Email: ${vendorDatastate?.[0]?.email}`, rightX, 35);
    doc.text(`Vendor Name: ${vendorDatastate?.[0]?.vendorname}`, rightX, 40);

    // Currency Reports
    addCenteredText("Currency Reports", 14, 60);

    // Create a data array for currency reports
    const currencyData = [];
    reportData.currencyReports.forEach((report) => {
      currencyData.push([
        report.currencySymbol,
        report.totalEarnings,
        report.expenses,
        report.netProfit,
      ]);
    });

    // Add currency reports as a table
    doc.autoTable({
      head: [["Currency Symbol", "Total Earnings", "Expenses", "Net Profit"]],
      body: currencyData,
      startY: 70,
    });

    // Order Metrics
    addCenteredText("Order Metrics", 14, doc.autoTable.previous.finalY + 20);

    // Create data arrays for order metrics
    Object.entries(reportData.orderMetrics).forEach(([status, orders]) => {
      const orderData = orders.map((order) => [
        order.order_status, // Add 'Status' text as the first column
        order.order_id,
        order.product_name,
        new Date(order.order_date).toLocaleString("en-US"),
        `${order.currency_symbol} - ${order.total_amount}`,
      ]);

      // Add order metrics as a table
      doc.autoTable({
        head: [
          ["Status", "Order ID", "Product Name", "Order Date", "Total Amount"],
        ],
        body: orderData,
        startY: doc.autoTable.previous.finalY + 10,
        margin: { top: 10 },
      });
    });

    // Add a section for top-performing products
    addCenteredText(
      "Top Performing Products",
      14,
      doc.autoTable.previous.finalY + 20
    );

    // Extract and format category and subcategory information
    const categoryData = reportData?.filteredProducts.map((product) => ({
      uniqueId: product.uniquepid,
      productName: product.ad_title,
      category: product.category, // Assuming category and subcategory are available in your data
      subcategory: product.subcategory,
    }));

    // Define the table columns for categories and subcategories
    const categoryColumns = [
      { title: "Unique Id", dataKey: "uniqueId" },
      { title: "Product Name", dataKey: "productName" },
      { title: "Category", dataKey: "category" },
      { title: "Subcategory", dataKey: "subcategory" },
    ];

    // Create a data array for categories and subcategories
    const categoryTableData = categoryData.map((product) => ({
      uniqueId: product.uniqueId,
      productName: product.productName,
      category: product.category,
      subcategory: product.subcategory,
    }));

    // Add categories and subcategories as a table
    doc.autoTable({
      columns: categoryColumns,
      body: categoryTableData,
      startY: doc.autoTable.previous.finalY + 25,
    });

    // Save the PDF with a unique name
    const pdfFileName = `report_${new Date().toISOString()}.pdf`;
    doc.save(pdfFileName);
  }

  const categories = {}; // Store categories and their subcategories

  reportData?.filteredProducts.forEach((product) => {
    const category = product.category; // Replace with your actual category field name
    const subcategory = product.subcategory; // Replace with your actual subcategory field name

    if (!categories[category]) {
      categories[category] = {
        subcategories: {},
        products: [],
      };
    }

    if (!categories[category].subcategories[subcategory]) {
      categories[category].subcategories[subcategory] = {
        products: [],
      };
    }

    categories[category].subcategories[subcategory].products.push(product);
    categories[category].products.push(product);
  });

  return (
    <div className="md:p-1">
      {/* <Title  level={2}>Reports</Title> */}
      <h1 className="fashionfont text-[20px] text-[#000] font-semibold mb-5 font-sans">Reports</h1>
      <div className="mb-4">
        <div className="flex items-center">
          <Text className="mr-2 font-semibold">Date Range:</Text>
          <DatePicker.RangePicker onChange={handleDateRangeChange} />
          <Button
            type="default"
            className="ml-3 bg-blue-500 hover:bg-blue-600 text-white hover:text-white font-bold rounded-md"
            onClick={handleSubmit}
            disabled={!dateRange || !dateRange[0] || !dateRange[1]}
          >
            Generate Report
          </Button>
        </div>
        <div className="mt-4"></div>
      </div>

      {reportData !== null &&
        dateRange !== null &&
        dateRange[0] !== null &&
        dateRange[1] !== null && (
          <div className="mt-4 bg-gray-100 shadow-lg p-4">
            <div className="lg:flex lg:items-center">
              <div className="lg:w-1/2">
                <img
                  src="/logo-black.png"
                  alt="Company Logo"
                  className="h-16 rounded-full mb-4 mx-auto lg:mx-0"
                />
              </div>
              <div className="lg:w-1/2 lg:text-right">
                <div className="mb-2">
                  {Array.isArray(dateRange) && dateRange[0] && dateRange[1] && (
                    <>
                      <Text strong className="mr-2">
                        {new Date(dateRange[0]).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>{" "}
                      -
                      <Text strong className="ml-2">
                        {new Date(dateRange[1]).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                    </>
                  )}
                </div>

                <Title level={4}>Vendor Details</Title>
                <Text>ID: {vendorDatastate?.[0]?.id}</Text>
                <br />
                <Text>Brand Name: {vendorDatastate?.[0]?.brand_name}</Text>
                <br />
                <Text>Email: {vendorDatastate?.[0]?.email}</Text>
                <br />
                <Text>Vendor Name: {vendorDatastate?.[0]?.vendorname}</Text>
              </div>
            </div>

            <div className="mt-8">
              <Title level={3}>Currency Reports</Title>
              <div className="lg:flex lg:flex-wrap">
                {reportData?.currencyReports.map((report) => (
                  <div className="lg:w-1/4 mb-4" key={report.currencySymbol}>
                    <Card title={report.currencySymbol}>
                      <p>
                        <span className="font-medium">Total Earnings</span>:{" "}
                        {parseFloat(report.totalEarnings).toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: report.currencySymbol,
                          }
                        )}
                      </p>
                      <p>
                        <span className="font-medium">Expenses</span>:{" "}
                        {parseFloat(report.expenses).toLocaleString("en-US", {
                          style: "currency",
                          currency: report.currencySymbol,
                        })}
                      </p>
                      <p>
                        <span className="font-medium">Net Profit</span>:{" "}
                        {parseFloat(report.netProfit).toLocaleString("en-US", {
                          style: "currency",
                          currency: report.currencySymbol,
                        })}
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Title level={3}>Order Metrics</Title>
              {Object.entries(reportData.orderMetrics).map(
                ([status, orders]) => (
                  <div key={status}>
                    <Title level={4} className="mt-4">
                      {status}
                    </Title>
                    <Table
                      dataSource={orders}
                      columns={[
                        {
                          title: "Order ID",
                          dataIndex: "order_id",
                          key: "order_id",
                        },
                        {
                          title: "Product Name",
                          dataIndex: "product_name",
                          key: "product_name",
                        },
                        {
                          title: "Order Date",
                          dataIndex: "order_date",
                          key: "order_date",
                          render: (text) =>
                            new Date(text).toLocaleString("en-US"),
                        },
                        {
                          title: "Total Amount",
                          dataIndex: "total_amount",
                          key: "total_amount",
                          render: (total_amount, record) => {
                            return (
                              <>
                                <p>
                                  {record.currency_symbol} - {total_amount}
                                </p>
                              </>
                            );
                          },
                        },
                        {
                          title: "Order Status",
                          dataIndex: "order_status",
                          key: "order_status",
                        },
                      ]}
                      pagination={false}
                    />
                  </div>
                )
              )}
            </div>

            <div className="mt-8">
              {Object.keys(categories).map((category) => (
                <div key={category}>
                  <Title level={4}>{category}</Title>
                  {Object.keys(categories[category].subcategories).map(
                    (subcategory) => (
                      <div key={subcategory}>
                        <Title level={5}>{subcategory}</Title>
                        <Row gutter={16}>
                          {categories[category].subcategories[
                            subcategory
                          ].products.map((product) => (
                            <Col span={6} key={product.uniquepid}>
                              <Card
                                hoverable
                                style={{ width: "100%", marginBottom: "16px" }}
                                cover={
                                  <img
                                    alt={product.ad_title}
                                    src={`${AdminUrl}/uploads/UploadedProductsFromVendors/${product.images?.[0]}`}
                                  />
                                }
                              >
                                <p>{product.ad_title}</p>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              {reportData?.currencyReports?.length > 0 && (
                <button
                  className="bg-[#000] hover:bg-[#000]/80 flex justify-center items-center  text-white font-bold py-2 px-4 rounded-md shadow-md "
                  onClick={() =>
                    generatePDF(reportData, dateRange, vendorDatastate)
                  }
                >
                  <FaDownload className="mr-2" /> Download PDF
                </button>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default Reports;
