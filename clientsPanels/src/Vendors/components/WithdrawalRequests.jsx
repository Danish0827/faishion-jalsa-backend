import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { AdminUrl } from "../../Admin/constant";
import moment from "moment";
const WithdrawalsTable = ({ vendorId }) => {
  console.log(vendorId);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWithdrawals() {
      try {
        const response = await fetch(`${AdminUrl}/api/withdrawals/${vendorId}`); // Pass the vendor_id to the backend
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setWithdrawals(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching withdrawal data:", error);
        setLoading(false);
      }
    }

    fetchWithdrawals();
  }, [vendorId]); // Include vendorId as a dependency

  const columns = [
    {
      title: "Withdrawal ID",
      dataIndex: "withdrawal_id",
      key: "withdrawal_id",
      width: 120, // Set the width for this column
    },
    {
      title: "Currency & Amount",
      dataIndex: "currency_and_amount",
      key: "currency_and_amount",
      width: 150, // Set the width for this column
      render: (text, record) => (
        <span>
          {record.currency_code} {record.amount}
        </span>
      ),
    },
    {
      title: "Withdrawal Date",
      dataIndex: "withdrawal_date",
      key: "withdrawal_date",
      width: 150, // Set the width for this column
      render: (text) => {
        const formattedDate = moment(text).format("MM/DD/YYYY"); // American format
        return <span>{formattedDate}</span>;
      },
      defaultSortOrder: "desc", // Set default sort order to descending
      sorter: (a, b) => {
        // Assuming "withdrawal_date" is in ISO date string format
        const dateA = moment(a.withdrawal_date);
        const dateB = moment(b.withdrawal_date);
        return dateA - dateB;
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120, // Set the width for this column
      filterMultiple: false, // Allow only one status filter at a time
      filters: [
        { text: "Approved", value: "Approved" },
        { text: "Pending", value: "Pending" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (text, record) => (
        <span style={{ color: getStatusColor(record.status) }}>
          {record.status}
        </span>
      ),
    },
    {
      title: "Bank Details",
      dataIndex: "bank_details",
      key: "bank_details",
      width: 200, // Set the width for this column
      render: (text, record) => (
        <>
          <h1>Account: {record.bank_account_number}</h1>
          <h1>Bank: {record.bank_name}</h1>
          <h1>Branch: {record.bank_branch}</h1>
        </>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      width: 150, // Set the width for this column
      render: (text) => {
        const formattedDate = moment(text).format("MM/DD/YYYY HH:mm:ss"); // American format with time
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      width: 150, // Set the width for this column
      render: (text) => {
        const formattedDate = moment(text).format("MM/DD/YYYY HH:mm:ss"); // American format with time
        return <span>{formattedDate}</span>;
      },
    },
  ];

  // Define a function to determine the status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Pending":
        return "orange";
      default:
        return "black";
    }
  };

  return (
    <div className="mt-5">
      <Table
        columns={columns}
        dataSource={withdrawals}
        loading={loading}
        rowKey="withdrawal_id" // Specify a unique key for each row
        pagination={false}
      />
    </div>
  );
};

export default WithdrawalsTable;
