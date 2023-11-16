import React from "react";
import { Table, Tag } from "antd";
import moment from "moment";

const PaymentHistoryTable = ({ data }) => {
  // Define the columns for the table
  const columns = [
    {
      title: "Payment Date",
      dataIndex: "payment_date",
      key: "payment_date",
      render: (date) => moment(date).format("MMM D, YYYY HH:mm A"), // Format date
      sorter: (a, b) =>
        moment(a.payment_date).unix() - moment(b.payment_date).unix(), // Sort by date
      defaultSortOrder: "descend", // Default sorting order
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Payment Amount",
      dataIndex: "payment_amount",
      key: "payment_amount",
      render: (amount, record) => {
        const parsedAmount = parseFloat(amount);
        if (!isNaN(parsedAmount)) {
          return `${record.currency_code} ${parsedAmount.toFixed(2)}`;
        }
        return amount; // Return as is if not a valid number
      },
    },

    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status) => (
        <Tag
          color={
            status === "Paid"
              ? "green"
              : status === "Pending"
              ? "orange"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
      filters: [
        { text: "Paid", value: "Paid" },
        { text: "Pending", value: "Pending" },
        { text: "Withdraw", value: "Withdraw" },
      ],
      onFilter: (value, record) => record.payment_status === value,
    },
  ];

  return (
    <div className="mt-10">
      <Table
        dataSource={data}
        columns={columns}
        pagination={false} // Disable pagination if not needed
      />
    </div>
  );
};

export default PaymentHistoryTable;
