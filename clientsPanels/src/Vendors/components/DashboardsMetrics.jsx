import { Card, Metric, Text, Flex, BadgeDelta, Grid } from "@tremor/react";
import { DatePicker } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { AdminUrl, formatCurrency } from "../../Admin/constant";

const colors = {
  increase: "emerald",
  moderateIncrease: "emerald",
  unchanged: "green",
  moderateDecrease: "rose",
  decrease: "rose",
};

export default function DashboardMetrics({
  vendorDatastate,
  conversionRates,
  userCurrency,
  isCurrencyloading,
}) {
  console.log(isCurrencyloading);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [categories, setCategories] = useState([
    {
      title: "Today Sales",
      metric: "0",
      metricPrev: "0",
      delta: "0",
      deltaType: "moderateIncrease",
    },
    {
      title: "Completed Orders",
      metric: "0",
      metricPrev: "0",
      delta: "0",
      deltaType: "moderateIncrease",
    },
  ]);

  // Parse the selected date with moment.js
  const selectedDateMoment = moment(selectedDate, "YYYY-MM-DD");
  // Calculate dayBeforeSelectedDate using moment.js
  const dayBeforeSelectedDateMoment = selectedDateMoment
    .clone()
    .subtract(1, "days");
  const formattedSelectedDate = selectedDateMoment.format("YYYY-MM-DD");
  const formattedDayBeforeDate =
    dayBeforeSelectedDateMoment.format("YYYY-MM-DD");

  const vendorId = vendorDatastate?.[0].id;

  const callSalesByDay = async () => {
    try {
      const response = await fetch(
        `${AdminUrl}/api/sales-by-day/${vendorId}?date=${formattedSelectedDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Handle successful response
        const data = await response.json();

        // Filter the data to get the categories for "Today Sales" and "Yesterday Sales"
        const todaySalesData = data?.filter(
          (item) => item.sale_date === formattedSelectedDate
        );
        const YesterdaySalesData = data?.filter(
          (item) => item.sale_date === formattedDayBeforeDate
        );

        // Find the category with title "Today Sales"
        const todaySalesCategory = categories.find(
          (category) => category.title === "Today Sales"
        );

        if (todaySalesData.length > 0 || YesterdaySalesData.length > 0) {
          if (todaySalesCategory) {
            let totalSalesYesterdayUSD = 0; // Initialize total sales today in USD
            let totalSalesTodayUSD = 0; // Initialize total sales today in USD

            for (const item of todaySalesData) {
              const currencySymbol = item.currency_symbol;
              let metric = parseFloat(item.total_sale_today); // Parse the total_sale_today as a float
              let day_before_saleMetric = parseFloat(item.day_before_sale); // Parse the day_before_sale as a float
              // Convert metric to USD if currency is not USD
              if (currencySymbol !== userCurrency) {
                // Implement a currency conversion function here
                metric = await convertToUSD(metric, currencySymbol);
                day_before_saleMetric = await convertToUSD(
                  day_before_saleMetric,
                  currencySymbol
                );
                // console.log(`Converting ${currencySymbol} to USD: ${metric}`);
              }

              // Add the converted or original metric to totalSalesTodayUSD
              totalSalesTodayUSD += metric;
              totalSalesYesterdayUSD += day_before_saleMetric;
            }

            for (const item of YesterdaySalesData) {
              const currencySymbol = item.currency_symbol;
              let metric = parseFloat(item.total_sale_today); // Parse the total_sale_today as a float
              let day_before_saleMetric = parseFloat(item.day_before_sale); // Parse the day_before_sale as a float
              // Convert metric to USD if currency is not USD
              if (currencySymbol !== userCurrency) {
                // Implement a currency conversion function here
                metric = await convertToUSD(metric, currencySymbol);
                day_before_saleMetric = await convertToUSD(
                  day_before_saleMetric,
                  currencySymbol
                );
                // console.log(`Converting ${currencySymbol} to USD: ${metric}`);
              }

              totalSalesTodayUSD += metric;
              totalSalesYesterdayUSD += day_before_saleMetric;

              // Perform any calculations or operations needed for YesterdaySalesData
              // For example, you can accumulate metrics or perform comparisons.
            }

            // Calculate delta and set deltaType for today's sales
            const metricPrevToday = totalSalesYesterdayUSD; // Use total sales today in USD as previous metric
            const deltaToday = totalSalesTodayUSD - metricPrevToday;
            const deltaTypeToday =
              deltaToday > 0
                ? "moderateIncrease"
                : deltaToday < 0
                  ? "moderateDecrease"
                  : "noChange";

            // Create the delta message for today's sales
            const deltaMessageToday =
              deltaToday > 0
                ? `Sales have increased by ${formatCurrency(
                  deltaToday,
                  userCurrency
                )} USD compared to the previous date (${moment(
                  formattedDayBeforeDate
                ).format("LL")})`
                : deltaToday < 0
                  ? `Sales have decreased by ${formatCurrency(
                    deltaToday,
                    userCurrency
                  )} USD compared to the previous date`
                  : `Sales remain unchanged compared to the previous date (${moment(
                    formattedDayBeforeDate
                  ).format("LL")})`;

            // Update the category object for today's sales with the converted values
            todaySalesCategory.metric = formatCurrency(
              totalSalesTodayUSD.toFixed(2),
              userCurrency
            ); // Convert totalSalesTodayUSD to string with 2 decimal places
            todaySalesCategory.metricPrev = formatCurrency(
              metricPrevToday.toFixed(2),
              userCurrency
            ); // Convert metricPrevToday to string with 2 decimal places
            todaySalesCategory.delta = deltaMessageToday;
            todaySalesCategory.deltaType = deltaTypeToday;
          }
        } else {
          todaySalesCategory.metric = 0; // Convert totalSalesTodayUSD to string with 2 decimal places
          todaySalesCategory.metricPrev = 0; // Convert metricPrevToday to string with 2 decimal places
          todaySalesCategory.delta = "No Sales";
          todaySalesCategory.deltaType = "unchanged";
        }

        // Update the state with the modified categories
        setCategories([...categories]);
      } else {
        // Handle error response
        console.error(
          "Error fetching customer orders by month:",
          response.statusText
        );
      }
    } catch (error) {
      // Handle error
      console.error("Error fetching customer orders by month:", error);
    }
  };

  // Implement the currency conversion function (convertToUSD)
  const convertToUSD = async (amount, currency) => {
    try {
      // Get the conversion rate for the given currency symbol
      const conversionRate = conversionRates[currency];
      if (conversionRate === undefined) {
        // Handle the case where the conversion rate is not available
        console.error(`Conversion rate not available for ${currency}`);
        return amount; // Return the original amount
      }

      // Perform the conversion
      const convertedAmount = amount * conversionRate;
      return convertedAmount;
    } catch (error) {
      // Handle any errors that may occur during conversion
      console.error(`Error converting ${currency} to USD:`, error);
      return amount; // Return the original amount in case of an error
    }
  };

  const callCompletedOrders = async () => {
    try {
      const response = await fetch(
        `${AdminUrl}/api/completedOrders/${vendorId}?date=${moment(
          selectedDate
        ).format("YYYY-MM-DD")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const targetCategoryTitle = "Completed Orders";

        // Find the "Completed Orders" category
        const totalCompletedOrders = categories.find(
          (category) => category.title === targetCategoryTitle
        );

        if (totalCompletedOrders) {
          const selectedDateFormatted =
            moment(selectedDate).format("YYYY-MM-DD");
          const totalCompletedOrdersValue =
            data.find((item) => item.custom_month === selectedDateFormatted)
              ?.total_completed_paid_orders || "0";

          // Fetch data for yesterday
          const yesterdayDate = moment(selectedDate).subtract(1, "days");
          const yesterdayDateFormatted = yesterdayDate.format("YYYY-MM-DD");
          const responseYesterday = await fetch(
            `${AdminUrl}/api/completedOrders/${vendorId}?date=${yesterdayDateFormatted}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (responseYesterday.ok) {
            const dataYesterday = await responseYesterday.json();
            const yesterdayCompletedOrdersValue =
              dataYesterday.find(
                (item) => item.custom_month === yesterdayDateFormatted
              )?.total_completed_paid_orders || "0";

            // Calculate delta and set deltaType for completed orders
            const metricPrevCompleted = yesterdayCompletedOrdersValue || 0;
            const deltaCompleted =
              totalCompletedOrdersValue - metricPrevCompleted;
            const deltaTypeCompleted =
              deltaCompleted > 0
                ? "moderateIncrease"
                : deltaCompleted < 0
                  ? "moderateDecrease"
                  : "unchanged";

            // Update the metric of the category
            totalCompletedOrders.metric = totalCompletedOrdersValue;
            totalCompletedOrders.metricPrev = metricPrevCompleted;
            totalCompletedOrders.deltaType = deltaTypeCompleted;
            totalCompletedOrders.delta =
              deltaCompleted > 0
                ? `Completed orders have increased by ${deltaCompleted} compared to the previous day`
                : deltaCompleted < 0
                  ? `Completed orders have decreased by ${Math.abs(
                    deltaCompleted
                  )} compared to the previous day`
                  : "Completed orders remain unchanged compared to the previous day";

            // Update the state with the modified categories
            setCategories([...categories]);
          } else {
            console.error(
              "Error fetching completed orders for yesterday:",
              responseYesterday.statusText
            );
          }
        } else {
          console.log(`Category "${targetCategoryTitle}" not found.`);
        }
      } else {
        console.error("Error fetching completed orders:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    // Call the completed orders function when selectedDate changes
    callCompletedOrders();
  }, [selectedDate]);

  useEffect(() => {
    // Call the sales by day function when selectedDate changes
    callSalesByDay();
  }, [selectedDate]);

  const handleDateChange = (date, datestring) => {
    // Check if date is not null, then format it and store in "YYYY-MM-DD" format
    setSelectedDate(datestring);
  };

  return (
    <div className="flex flex-col relative">
      <div className="w-full md:flex md:justify-between md:self-end">
        <div className="text-center">
          <h5 className="fashionfont text-[20px] text-[#000] font-semibold mb-1 font-sans">Performance Dashboard</h5>
          <p className="text-[14px] text-[#495057] md:absolute md:left-0">
            Unlock Insights, Track Progress, Drive Success
          </p>
        </div>
        <DatePicker
          onChange={handleDateChange}
          placeholder="Check another"
          allowClear={false}
          showToday={true}
          inputReadOnly
          picker="date"
        />
      </div>

      <Grid numItemsSm={2} numItemsLg={4} className="gap-6 mt-12">
        {categories.map((item) => {
          if (isCurrencyloading) {
            // Render a skeleton card
            return (
              <div className="bg-white rounded-lg p-4 shadow-md">
                <div className="animate-pulse">
                  <div className="bg-gray-300 h-4 w-1/2 mb-2"></div>
                  <div className="bg-gray-300 h-4 w-1/4 mb-2"></div>
                  <div className="bg-gray-300 h-4 w-1/3 mb-2"></div>
                  <div className="bg-gray-300 h-4 w-1/4 mb-2"></div>
                </div>
              </div>
            );
          } else {
            // Render the actual content
            return (
              <Card key={item.title}>
                <Flex>
                  <Text className="font-semibold text-[16px] text-[#495057] mb-3">{item.title}</Text>
                </Flex>
                <Flex
                  justifyContent="start"
                  alignItems="baseline"
                  className="truncate space-x-3 items-center"
                >
                  <Metric>{item.metric}</Metric>
                  <Text className="truncate text-[#74788d] text-[15px]">from {item.metricPrev}</Text>
                  {/* Calendar icon */}
                </Flex>
                <Flex justifyContent="start" className="space-x-2 mt-4">
                  <BadgeDelta deltaType={item.deltaType} />
                  <Flex justifyContent="start" className="space-x-1 ">
                    <Text className="text-[11.5px]" color={colors[item.deltaType]}>{item.delta}</Text>
                  </Flex>
                </Flex>
              </Card>
            );
          }
        })}
      </Grid>
    </div>
  );
}
