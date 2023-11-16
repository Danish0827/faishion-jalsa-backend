import React, { useEffect, useState } from "react";
import { Table, Button, DatePicker, Space } from "antd";
import { FileExcelOutlined } from "@ant-design/icons"; // Import the Excel icon
import * as XLSX from "xlsx";
import { AdminUrl, formatCurrency } from "../Admin/constant";
import moment from "moment";
import "./components/Vendors.css"

const SalesReturn = ({
  conversionRates,
  isCurrencyloading,
  vendorDatastate,
  userCurrency,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const vendorId = vendorDatastate?.[0]?.id;

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => (
        <span>
          {`#${record.pid} - ${text}`}{" "}
          {/* Render product name and pid with # */}
        </span>
      ),
    },

    {
      title: "Sale Date",
      dataIndex: "saleDate",
      key: "saleDate",
      render: (saleDate) => moment(saleDate).format("MMMM DD, YYYY"), // Format the date
    },
    {
      title: "Amount Sold",
      dataIndex: "amountSold",
      key: "amountSold",
      render: (_, record) => {
        return (
          <>
            <p>{formatCurrency(_, userCurrency)}</p>
          </>
        );
      },
    },
    {
      title: "Fees",
      dataIndex: "fees",
      key: "fees",
      render: (_, record) => {
        return (
          <>
            <p>{formatCurrency(_, userCurrency)}</p>
          </>
        );
      },
    },
    {
      title: "Taxes",
      dataIndex: "taxes",
      key: "taxes",
      render: (_, record) => {
        return (
          <>
            <p>{formatCurrency(_, userCurrency)}</p>
          </>
        );
      },
    },
  ];

  // State for date range
  const [dateRange, setDateRange] = useState([]);

  // Handle date range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // Filter data based on selected date range
  const filteredDataSource = data.filter((item) => {
    const saleDate = item.saleDate.split("T")[0]; // Extract only the date part

    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      // Handle the case when dateRange is not set
      return true; // Or return false depending on your requirements
    }

    return (
      saleDate >= dateRange[0].format("YYYY-MM-DD") &&
      saleDate <= dateRange[1].format("YYYY-MM-DD")
    );
  });

  // Calculate total fees, taxes, and returns
  const totalFees = filteredDataSource.reduce(
    (acc, current) => acc + parseFloat(current.fees),
    0
  );

  const totalTaxes = filteredDataSource.reduce(
    (acc, current) => acc + parseFloat(current.taxes),
    0
  );

  const totalReturns = filteredDataSource.reduce(
    (acc, current) => acc + parseInt(current.returns),
    0
  );

  // Function to handle Excel download
  const handleExcelDownload = () => {
    let filename = "sales_return_report_all"; // Default filename

    if (dateRange?.length === 2) {
      // If both start and end date are selected
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");
      filename = `sales_return_report_${startDate}_to_${endDate}`;
    }

    // Prepare data for Excel export
    const dataForExcel = [
      // Header row
      ["Product Name", "Sale Date", "Amount Sold", "Fees", "Taxes", "Returns"],
      // Data rows
      ...filteredDataSource.map((item) => [
        item.productName,
        moment(item.saleDate).format("LL"),
        `${formatCurrency(item.amountSold, userCurrency)}`, // Include currency symbol
        `${formatCurrency(item.fees, userCurrency)}`, // Include currency symbol
        `${formatCurrency(item.taxes, userCurrency)}`, // Include currency symbol
        item.returns,
      ]),
      // Totals row
      [
        "Total",
        "",
        "",
        `${formatCurrency(totalFees, userCurrency)}`,
        `${formatCurrency(totalTaxes, userCurrency)}`,
        ` ${totalReturns}`,
      ],
    ];

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(dataForExcel);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales_Return_Report");

    // Save the workbook as a blob with the dynamically generated filename
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Define the data to send in the request body
        const requestData = {
          vendor_id: vendorId, // Replace with the actual vendor_id
        };

        const response = await fetch(`${AdminUrl}/api/sales-and-returns`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const salesAndReturnsData = await response.json();

        // Convert sales data to USD for items with non-USD currency
        const convertedData = salesAndReturnsData.map((item) => {
          if (item.currency_symbol !== userCurrency) {
            const conversionRate = conversionRates[item.currency_symbol];
            if (conversionRate) {
              item.amountSold = item.amountSold * conversionRate;
              item.fees = item.fees * conversionRate;
              item.taxes = item.taxes * conversionRate;
            }
          }
          return item;
        });

        setData(convertedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendorId]); // Empty dependency array to run once when the component mounts

  return vendorDatastate && vendorDatastate?.length > 0 ? (
    <div className="p-4">
      <h1 className="fashionfont text-[20px] text-[#000] font-semibold mb-4 font-sans">Sales & Return Report</h1>
      <div className="mb-4 flex justify-between">
        <DatePicker.RangePicker onChange={handleDateRangeChange} />
        <div
          className="flex
        "
        >
          <Button
            type="default"
            className="gsfbgbcgb hover:text-white px-4 py-3 border-none mr-2 bg-[#003032] hover:bg-[#003032]/80 text-white flex justify-center items-center important"
            icon={<FileExcelOutlined />} // Excel icon
            onClick={handleExcelDownload}
          >
            Download as Excel
          </Button>
        </div>
      </div>
      <div className="my-5">
        <p className="mb-2 flex text-[#495057] text-sm">
          <p className="text-[#000]">Total Fees Paid &nbsp;:&nbsp;</p> {userCurrency} {totalFees.toFixed(2)}
        </p>
        <p className="mb-2 flex text-sm">
          <p className="text-[#000]">Total Taxes Collected &nbsp;:&nbsp;</p> {userCurrency} {totalTaxes.toFixed(2)}
        </p>
        <p className="mb-2 flex text-sm">
          <p className="text-[#000]">Total Returns &nbsp;:&nbsp;</p> {totalReturns}
        </p>
      </div>
      <Table dataSource={filteredDataSource} columns={columns} />

      <div className="mb-4 mt-54">
        <h2 className="fashionfont text-[20px] text-[#000] font-semibold my-2 font-sans">Understanding the Report</h2>
        <p className="text-justify mb-2 text-sm">
          <strong className="font-semibold">Total Fees Paid :</strong> This represents the cumulative
          amount of fees that you, as a vendor, have paid for selling your
          products on the marketplace. These fees are typically charged by the
          marketplace for using their platform.
        </p>
        <p className="text-justify mb-2 text-sm">
          <strong className="font-semibold">Total Taxes Collected:</strong> This figure reflects the total
          amount of taxes you have collected from your customers on the sales
          made through the marketplace. Taxes are often levied based on the
          products and location of the sale.
        </p>
        <p className="text-justify mb-2 text-sm">
          <strong className="font-semibold">Total Returns:</strong> This indicates the total number of
          products that have been returned by customers. Returns can occur for
          various reasons, such as customer dissatisfaction or product defects.
        </p>
      </div>
    </div>
  ) : (
    ""
  );
};

export default SalesReturn;
