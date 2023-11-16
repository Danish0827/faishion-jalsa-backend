import React, { useState, useEffect } from "react";
import { AdminUrl } from "../constant";
import { Card, Text, Metric, CategoryBar, Legend, Title } from "@tremor/react";
import SalesChart from "../components/SalesChart";

const AdminDashboard = ({
  adminLoginData,
  conversionRates,
  isCurrencyloading,
}) => {
  const [customerCounts, setCustomerCounts] = useState(null);
  const [vendorCounts, setVendorCounts] = useState(null);
  const stats = [
    {
      title: "Total Registered Customers",
      value: customerCounts?.Total || 0,
      categories: [
        `Pending Customers (${customerCounts?.Pending})`,
        `Blocked Customers (${customerCounts?.Blocked})`,
        `Archived Customers (${customerCounts?.Archived})`,
        `Approved Customers (${customerCounts?.Approved})`,
        `Rejected Customers (${customerCounts?.Rejected})`,
      ],
      colors: ["orange", "red", "blue", "green", "purple"],
    },
    {
      title: "Total Registered Vendors",
      value: vendorCounts?.Total || 0,
      categories: [
        `Pending Vendors (${vendorCounts?.Pending})`,
        `Blocked Vendors (${vendorCounts?.Blocked})`,
        `Archived Vendors (${vendorCounts?.Archived})`,
        `Approved Vendors (${vendorCounts?.Approved})`,
        `Rejected Vendors (${vendorCounts?.Rejected})`,
      ],
      colors: ["orange", "red", "blue", "green", "purple"],
    },
  ];
  useEffect(() => {
    const fetchCustomerCounts = async () => {
      try {
        const response = await fetch(`${AdminUrl}/api/customer-count`);
        const data = await response.json();
        setCustomerCounts(data);
      } catch (error) {
        console.error("Error fetching customer counts:", error);
      }
    };

    fetchCustomerCounts();
  }, []);

  useEffect(() => {
    const fetchVendorCounts = async () => {
      try {
        const response = await fetch(`${AdminUrl}/api/vendor-count`);
        const data = await response.json();
        setVendorCounts(data);
      } catch (error) {
        console.error("Error fetching vendor counts:", error);
      }
    };

    fetchVendorCounts();
  }, []);
  const DashboardCard = ({ title, value, categories, colors }) => (
    <Card className="max-w-md mx-auto">
      <Text>{title}</Text>
      <Metric>{value}</Metric>
      <Legend className="mt-3" categories={categories} colors={colors} />
    </Card>
  );

  const CardLoader = () => {
    const loaders = [];

    for (let index = 0; index < 5; index++) {
      loaders.push(
        <Card className="bg-gray-100 p-4 animate-pulse" key={index}>
          <div className="h-6 w-1/2 bg-gray-300 rounded mb-2" />
          <div className="h-8 w-full bg-gray-300 rounded mb-4" />
          <div className="h-3 w-3/4 bg-gray-300 rounded mb-2" />
          <div className="h-3 w-full bg-gray-300 rounded mb-2" />
          <div className="h-3 w-1/2 bg-gray-300 rounded mb-2" />
        </Card>
      );
    }

    return loaders;
  };

  return (
    <div className="sm:p-4 sm:ml-72">
      {adminLoginData == null || adminLoginData?.length == 0 ? (
        <>
          <div class="tremor-Grid-root grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-6 gap-6">
            <CardLoader />
          </div>
          <Card className="bg-gray-100 p-4 mt-5 animate-pulse">
            <Title>
              <div className="h-6 w-2/3 bg-gray-300 rounded mb-2" />
            </Title>
            <div className="h-56 w-full bg-gray-300 rounded mb-4" />
          </Card>
        </>
      ) : (
        <div className="rounded-lg dark:border-gray-700">
          <div class="tremor-Grid-root grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-6 gap-6">
            {stats.map((item, i) => {
              return (
                <>
                  <DashboardCard
                    key={i}
                    title={item.title}
                    value={`${item.value}`}
                    categories={item.categories}
                    values={item.values} // You can adjust the values and colors accordingly if needed
                    colors={item.colors}
                  />
                </>
              );
            })}
          </div>

          <div className="flex items-center justify-center mt-5 mb-4 rounded bg-gray-50 dark:bg-gray-800">
            <SalesChart
              adminLoginData={adminLoginData}
              conversionRates={conversionRates}
              isCurrencyloading={isCurrencyloading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
