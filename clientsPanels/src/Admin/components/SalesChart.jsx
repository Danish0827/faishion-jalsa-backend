import React, { useState, useEffect } from "react";
import { Card, Title, AreaChart, Flex } from "@tremor/react";
import { AdminUrl } from "../constant";
import { Select } from "antd";

const { Option } = Select;

const SalesChart = ({ conversionRates, isCurrencyloading }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState([]);
  const [fetchCount, setFetchCount] = useState(0); // Initialize a counter
  const [isCurrencyloadings, setiscurrencyloading] = useState(true);

  useEffect(() => {
    // Check if fetchCount is less than 2 before calling fetchChartData
    if (fetchCount < 2) {
      fetchChartData();
      setFetchCount(fetchCount + 1); // Increment the counter

      if (fetchCount === 0) {
        // If it's the first call, schedule the second call after 3 seconds
        setTimeout(() => {
          setFetchCount(fetchCount + 1); // Increment the counter again
          setiscurrencyloading(false);
        }, 2000); // 3000 milliseconds = 3 seconds
      }
    }
    fetchChartData();
  }, [selectedYear, fetchCount]); // Include fetchCount in the dependencies array

  const fetchChartData = async () => {
    try {
      const response = await fetch(
        `${AdminUrl}/api/chart-data?year=${selectedYear}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch chart data");
      }
      const data = await response.json();

      // Apply currency conversion to the data and store it in state
      const dataWithCurrencyConversion = data.map((item) => {
        if (
          item.currency_symbol !== "USD" &&
          conversionRates[item.currency_symbol]
        ) {
          const exchangeRate = conversionRates[item.currency_symbol];
          const convertedRevenue = (item.Revenue * exchangeRate).toFixed(2);
          return {
            ...item,
            Revenue: parseFloat(convertedRevenue), // Convert back to a floating-point number
            currency_symbol: "USD",
          };
        }
        return item;
      });

      // Group data by date and merge TotalOrders and Revenue for the same date
      const groupedData = dataWithCurrencyConversion.reduce((acc, item) => {
        const date = item.date; // Replace 'date' with the actual property name in your data
        if (!acc[date]) {
          acc[date] = {
            TotalOrders: 0,
            Revenue: 0,
          };
        }
        acc[date].TotalOrders += item.TotalOrders;
        acc[date].Revenue += item.Revenue;
        return acc;
      }, {});

      console.log(groupedData);

      // Convert the grouped data back into an array format if needed
      const chartData = Object.keys(groupedData).map((date) => ({
        date,
        ...groupedData[date],
      }));

      // Set the grouped data in the state
      setChartData(chartData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  return !isCurrencyloadings ? (
    <Card>
      <Flex className="mb-4">
        <Title>Sales and Revenue over time (USD)</Title>
        <div>
          <label htmlFor="year" className="mr-2">
            Select Year:
          </label>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: 120 }}
          >
            {Array.from({ length: 29 }, (_, index) => (
              <Option key={index} value={2022 + index}>
                {2022 + index}
              </Option>
            ))}
          </Select>
        </div>
      </Flex>
      <AreaChart
        data={Object.values(chartData).flat()} // Flatten the data from the grouped object
        index="date"
        categories={["TotalOrders", "Revenue"]}
        colors={["indigo", "cyan"]}
        selectedYear={selectedYear}
        width={800}
        height={400}
        margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
        tooltip={{ show: true }}
        legend={{ show: true }}
        grid={{ show: true }}
      />
    </Card>
  ) : (
    ""
  );
};

export default SalesChart;
