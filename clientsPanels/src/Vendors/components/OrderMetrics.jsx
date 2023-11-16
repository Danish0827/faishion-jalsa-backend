import {
  Card,
  Metric,
  Text,
  AreaChart,
  BadgeDelta,
  Flex,
  Grid,
  ListItem,
  Bold,
} from "@tremor/react";
import { useEffect, useState } from "react";
import { AdminUrl } from "../../Admin/constant";
import { List, Modal, Select, Typography } from "antd";
import { DatePicker } from "antd";
import moment from "moment";
import Cookies from "js-cookie";

const { Option } = Select;

export default function OrderMetrics({ vendorDatastate, type, userCurrency = "USD" }) {
  const [CustomerOrdersByMonth, setCustomerOrdersByMonth] = useState(null);
  const [isCurrencyloading, setisCurrencyloading] = useState(false);
  const [SalesByMonth, setSalesByMonth] = useState(null);
  const [PurchasesByMonth, setPurchasesByMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCurrency, setSelectedCurrency] = useState(userCurrency); // Default currency
  const [PreviousCurrency, setPreviousCurrency] = useState(userCurrency); // PreviousCurrency
  const [updatedData, setUpdatedData] = useState([]);
  const [updatedCategories, setUpdatedCategories] = useState([]);
  const [metricsData, setMetricsData] = useState([]);
  const [PaymenOut, setPaymenOut] = useState([]);
  const [error, setError] = useState(0);
  const [newOrders, setnewOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  const vendorId = vendorDatastate?.[0]?.id;

  const [conversionRates, setConversionRates] = useState({
    USD: 1, // Default to 1 for USD
    EUR: 0,
    ETB: 0,
    SOS: 0,
    KES: 0,
    INR: 0,
  });

  const [orderStatuses, setorderStatuses] = useState([
    { status: "Confirmed", metric: 0 },
    { status: "Shipped", metric: 0 },
    { status: "Returned", metric: 0 },
    { status: "Exchanged", metric: 0 },
    { status: "Cancelled", metric: 0 },
    { status: "Delivered", metric: 0 },
  ]);

  const currencyOptions = [
    { value: "USD", label: "United States Dollar" },
    { value: "EUR", label: "Euro" },
    { value: "ETB", label: "Ethiopian Birr" },
    { value: "SOS", label: "Somali Shilling" },
    { value: "KES", label: "Kenyan Shilling" },
    { value: "INR", label: "Indian Ruppe" },
  ];

  const handleCurrencySelectChange = (value) => {
    setPreviousCurrency(selectedCurrency);
    setSelectedCurrency(value);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const yearOptions = [];
  for (let year = 2022; year <= 2050; year++) {
    yearOptions.push(year);
  }
  const handleYearSelectChange = (value) => {
    const selectedYear = parseInt(value);
    handleYearChange(selectedYear);
  };

  const callCustomerOrdersByMonth = async () => {
    try {
      const response = await fetch(
        `${AdminUrl}/api/customer-orders-by-month/${vendorId}`,
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
        // Process the data as needed, such as setting it to state
        setCustomerOrdersByMonth(data);
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

  const callSalesByMonth = async () => {
    try {
      const response = await fetch(`${AdminUrl}/api/sales-by-month`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, vendorId }), // Include type and vendorId in the request body
      });

      if (response.ok) {
        // Handle successful response
        const data = await response.json();
        // Process the data as needed, such as setting it to state
        setSalesByMonth(data);
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

  const callPurchasesByMonth = async () => {
    try {
      const response = await fetch(`${AdminUrl}/api/total-purchases/${vendorId}`);
      if (response.ok) {
        const data = await response.json();
        setPurchasesByMonth(data); // Store the data in the state
      } else {
        console.error("Error fetching data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  async function fetchPaymentInMetrics() {
    try {
      const response = await fetch(`${AdminUrl}/api/payment-in-metrics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, vendorId }), // Include type and vendorId in the request body
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setMetricsData(data);
    } catch (error) {
      setError(error.message);
    }
  }

  async function fetchPaymentOutMetrics() {
    try {
      const response = await fetch(`${AdminUrl}/api/payment-out-metrics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, vendorId }), // Include type and vendorId in the request body
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setPaymenOut(data);
    } catch (error) {
      setError(error.message);
    }
  }

  useEffect(() => {
    if (type === "admin") {
      callSalesByMonth();
      fetchPaymentInMetrics();
      fetchPaymentOutMetrics();
    } else {
      callSalesByMonth();
      callCustomerOrdersByMonth();
      callPurchasesByMonth();
      fetchPaymentInMetrics();
      fetchPaymentOutMetrics();
    }
  }, []);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentYear = new Date().getFullYear();

  const data = months.map((month) => ({
    Month: `${month} ${currentYear.toString().slice(-2)}`,
    Sales: 0,
    ProfitandLoss: 0,
    Customers: 0,
    Purchased: 0,
    AverageOrderValue: 0,
    PaymentIn: 0,
    Paymentout: 0,
  }));

  const monthAbbreviations = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");

  const categories = [
    {
      title: "New Orders",
      metric: "0",
      delta: "0",
      deltaType: "moderateDecrease",
    },
    {
      title: "Sales",
      metric: "0",
      metricPrev: "$ 9,456",
      delta: "34.3%",
      deltaType: "moderateDecrease",
    },
    {
      title: "Purchased",
      metric: "210",
      delta: "16.7%",
      deltaType: "moderateIncrease",
    },
    {
      title: "Customers",
      metric: "0",
      delta: "12.3%",
      deltaType: "moderateDecrease",
    },
    // ... other categories ...
    {
      title: "Payment In",
      metric: "$ 12,348",
      delta: "18.1%",
      deltaType: "moderateIncrease",
    },
    {
      title: "Payment out",
      metric: "$ 12,348",
      delta: "82.1%",
      deltaType: "moderateDecrease",
    },
  ];

  // Helper function to format currency
  const formatCurrency = (value, currency) => {
    if (currency) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(value);
    } else {
      return value
    }
  };

  const getCurrencyConversionRate = (currency) => {
    return conversionRates[currency]; // Default to 1 if currency not found
  };

  useEffect(() => {
    const updatedDatas = data.map((monthData) => {
      const [dataMonth, _] = monthData.Month.split(" ");

      const matchingYearMonthSales = SalesByMonth?.filter((item) => {
        const [itemYear, itemMonth] = item.month_start.split("-");
        const itemFormattedMonth = months[parseInt(itemMonth) - 1];
        return (
          selectedYear === parseInt(itemYear) &&
          dataMonth === itemFormattedMonth
        );
      });

      const totalSales = matchingYearMonthSales?.reduce((sum, item) => {
        const currencySymbol = item.currency_symbol;
        const salesValue = parseFloat(item.total_sales);

        const currencyConversionRate = conversionRates[currencySymbol] || 1;

        const salesInUSD =
          currencySymbol === userCurrency
            ? salesValue
            : salesValue / currencyConversionRate;

        return sum + salesInUSD;
      }, 0);

      const matchingYearMonthCustomers = CustomerOrdersByMonth?.filter(
        (item) => {
          const [itemYear, itemMonth] = item.month_start.split("-");
          const itemFormattedMonth = months[parseInt(itemMonth) - 1];
          return (
            selectedYear === parseInt(itemYear) &&
            dataMonth === itemFormattedMonth
          );
        }
      );

      const matchingYearMonthPurchased = PurchasesByMonth?.filter((item) => {
        const [itemMonth, itemYear] = item.month_start.split(" ");
        return selectedYear === parseInt(itemYear) && dataMonth === itemMonth;
      });

      const totalPurchased = matchingYearMonthPurchased?.reduce((sum, item) => {
        return sum + parseInt(item.total_purchases);
      }, 0);

      const matchingYearMonthPaymentIn = metricsData?.filter((item) => {
        const [itemMonth, itemYear] = item.month_start.split(" ");
        return selectedYear === parseInt(itemYear) && dataMonth === itemMonth;
      });

      let totalPaymentIn = 0;

      matchingYearMonthPaymentIn?.forEach((item) => {
        const currencySymbol = item.currency_symbol;
        const paymentIn = parseFloat(item.total_payment_in);

        const currencyConversionRate = conversionRates[currencySymbol] || 1;
        const paymentInUsd =
          currencySymbol === userCurrency
            ? paymentIn
            : paymentIn / currencyConversionRate;

        totalPaymentIn += paymentInUsd;
      });

      const matchingYearMonthPaymentOut = PaymenOut?.filter((item) => {
        const [itemMonth, itemYear] = item.month_start.split(" ");
        return selectedYear === parseInt(itemYear) && dataMonth === itemMonth;
      });

      let totalPaymentOut = 0;

      matchingYearMonthPaymentOut?.forEach((item) => {
        const currencySymbol = item.currency_symbol;
        const paymentOut = parseFloat(item.total_payment_out);
        const currencyConversionRate = conversionRates[currencySymbol] || 1;
        const paymentOutUsd =
          currencySymbol === userCurrency
            ? paymentOut
            : paymentOut / currencyConversionRate;

        totalPaymentOut += paymentOutUsd;
      });

      // Calculate converted sales amount based on selected currency
      const currencyConversionRate =
        getCurrencyConversionRate(selectedCurrency);
      const convertedSales = totalSales * currencyConversionRate;
      const convertedPaymentin = totalPaymentIn * currencyConversionRate;
      const convertedPaymentOut = totalPaymentOut * currencyConversionRate;

      const totalCustomers = matchingYearMonthCustomers?.reduce((sum, item) => {
        return sum + parseInt(item.total_customers_with_orders);
      }, 0);

      return {
        ...monthData,
        Sales: convertedSales,
        Purchased: totalPurchased,
        Customers: totalCustomers,
        PaymentIn: convertedPaymentin,
        Paymentout: convertedPaymentOut,
      };
    });
    setUpdatedData(updatedDatas);

    const updatedCategoriess = categories.map((category) => {
      if (category.title === "Customers") {
        const matchingYearMonth = CustomerOrdersByMonth?.filter((item) => {
          const [itemYear, _] = item.month_start.split("-");
          return parseInt(itemYear) === selectedYear;
        });

        const totalCount = matchingYearMonth?.reduce((total, obj) => {
          const customersCount = parseInt(obj.total_customers_with_orders, 10);
          return customersCount;
        }, 0);

        // Calculate the metric value for the previous month (similar to Sales)
        const previousMonthData = updatedData.find((monthData) => {
          const [month, year] = monthData.Month.split(" ");
          const monthNumerical = monthAbbreviations[month];
          const formattedMonth = String(monthNumerical).padStart(2, "0");
          return (
            formattedMonth ===
            String(parseInt(currentMonth) - 1).padStart(2, "0")
          );
        });
        const prevMonthMetric = previousMonthData?.Customers || 0;

        // Calculate delta and delta percentage
        const deltaValue = totalCount - prevMonthMetric;
        const deltaPercentage = (deltaValue / prevMonthMetric) * 100;
        // Determine delta type based on the change
        let deltaType = "moderateIncrease";
        if (deltaValue < 0) {
          deltaType = "moderateDecrease";
        }

        return {
          ...category,
          metric: totalCount,
          delta: `${deltaValue.toFixed(2)}`,
          deltaPercentage: `${deltaPercentage.toFixed(2)}%`,
          deltaType: deltaType,
        };
      } else if (category.title === "Sales") {
        const previousMonthData = updatedData.find((monthData) => {
          const [month, year] = monthData.Month.split(" ");
          const monthNumerical = monthAbbreviations[month];
          const formattedMonth = String(monthNumerical).padStart(2, "0");
          return (
            formattedMonth ===
            String(parseInt(currentMonth) - 1).padStart(2, "0")
          );
        });

        const matchingYearMonth = SalesByMonth?.filter((item) => {
          const [itemYear, itemMonth] = item.month_start.split("-");
          return (
            parseInt(itemYear) === selectedYear && itemMonth === currentMonth
          );
        });

        let totalSalesInUSD = 0;

        matchingYearMonth?.forEach((item) => {
          const currencySymbol = item.currency_symbol;
          const salesValue = parseFloat(item.total_sales);

          const currencyConversionRate = conversionRates[currencySymbol] || 1;
          const salesInUSD =
            currencySymbol === userCurrency
              ? salesValue
              : salesValue / currencyConversionRate;

          totalSalesInUSD += salesInUSD;
        });

        const currencyConversionRate =
          getCurrencyConversionRate(selectedCurrency);
        const convertedMetricValue = totalSalesInUSD * currencyConversionRate;

        // Calculate delta value and delta percentage
        const prevMonthSales =
          previousMonthData?.Sales * currencyConversionRate || 0;
        let deltaValue, deltaPercentage, deltaType;

        if (prevMonthSales === 0) {
          if (convertedMetricValue === 0) {
            deltaValue = 0;
            deltaPercentage = 0;
            deltaType = "unchanged";
          } else {
            deltaValue = convertedMetricValue;
            deltaPercentage = 100;
            deltaType = "moderateIncrease";
          }
        } else {
          deltaValue = convertedMetricValue - prevMonthSales;
          deltaPercentage = (deltaValue / prevMonthSales) * 100;
          deltaType = deltaValue < 0 ? "moderateDecrease" : "moderateIncrease";
        }

        const formattedMetric = formatCurrency(
          convertedMetricValue,
          selectedCurrency
        );

        // Return updated category object
        return {
          ...category,
          metric: formattedMetric,
          delta: `${deltaPercentage.toFixed(1)}%`,
          deltaType: deltaType,
        };
      } else if (category.title === "Purchased") {
        const previousMonthData = updatedData.find((monthData) => {
          const [month, year] = monthData.Month.split(" ");
          const monthNumerical = monthAbbreviations[month];
          const formattedMonth = String(monthNumerical).padStart(2, "0");
          return (
            formattedMonth ===
            String(parseInt(currentMonth) - 1).padStart(2, "0")
          );
        });
        const prevMonthMetric = previousMonthData?.Purchased || 0;

        const matchingYearMonthPurchased = PurchasesByMonth?.filter((item) => {
          const [itemMonth, itemYear] = item.month_start.split(" ");
          const monthNumerical = monthAbbreviations[itemMonth];

          return (
            parseInt(itemYear) === selectedYear &&
            monthNumerical === currentMonth
          );
        });

        const totalPurchased = matchingYearMonthPurchased?.reduce(
          (sum, item) => {
            return sum + parseInt(item.total_purchases);
          },
          0
        );

        // Calculate delta and delta percentage
        let deltaValue, deltaPercentage, deltaType;

        if (prevMonthMetric === 0) {
          if (totalPurchased === 0) {
            deltaValue = 0;
            deltaPercentage = 0;
            deltaType = "unchanged";
          } else {
            deltaValue = totalPurchased;
            deltaPercentage = 100;
            deltaType = "moderateIncrease";
          }
        } else {
          deltaValue = totalPurchased - prevMonthMetric;
          deltaPercentage = (deltaValue / prevMonthMetric) * 100;
          deltaType = deltaValue < 0 ? "moderateDecrease" : "moderateIncrease";
        }

        return {
          ...category,
          metric: totalPurchased,
          delta: `${deltaValue.toFixed(2)}`,
          deltaPercentage: `${deltaPercentage.toFixed(2)}%`,
          deltaType: deltaType,
        };
      } else if (category.title === "Payment In") {
        const previousMonthData = updatedData.find((monthData) => {
          const [month, year] = monthData.Month.split(" ");
          const monthNumerical = monthAbbreviations[month];
          const formattedMonth = String(monthNumerical).padStart(2, "0");
          return (
            formattedMonth ===
            String(parseInt(currentMonth) - 1).padStart(2, "0")
          );
        });

        const matchingYearMonthPaymentIn = metricsData?.filter((item) => {
          const [itemMonth, itemYear] = item.month_start.split(" ");
          const monthNumerical = monthAbbreviations[itemMonth];

          return (
            parseInt(itemYear) === selectedYear &&
            monthNumerical === currentMonth
          );
        });

        let totalPaymentIn = 0;

        matchingYearMonthPaymentIn?.forEach((item) => {
          const currencySymbol = item.currency_symbol;
          const paymentValue = parseFloat(item.total_payment_in);

          const currencyConversionRate = conversionRates[currencySymbol] || 1;
          const paymentInUSD =
            currencySymbol === userCurrency
              ? paymentValue
              : paymentValue / currencyConversionRate;

          totalPaymentIn += paymentInUSD;
        });

        const currencyConversionRate =
          getCurrencyConversionRate(selectedCurrency);
        const prevMonthPaymentIn =
          previousMonthData?.PaymentIn * currencyConversionRate || 0;
        const currentMonthPaymentIn = totalPaymentIn * currencyConversionRate;
        const deltaValue = currentMonthPaymentIn - prevMonthPaymentIn;
        let deltaPercentage;

        if (prevMonthPaymentIn === 0) {
          deltaPercentage = 0;
        } else {
          deltaPercentage = (deltaValue / prevMonthPaymentIn) * 100;
        }

        let deltaType = "moderateIncrease";
        if (deltaValue < 0) {
          deltaType = "moderateDecrease";
        }

        const formattedMetric = formatCurrency(
          currentMonthPaymentIn,
          selectedCurrency
        );

        return {
          ...category,
          metric: formattedMetric,
          delta: `${deltaPercentage.toFixed(1)}%`,
          deltaType: deltaType,
        };
      } else if (category.title === "Payment out") {
        const matchingYearMonthPaymentOut = PaymenOut?.filter((item) => {
          const [itemMonth, itemYear] = item.month_start.split(" ");
          const monthNumerical = monthAbbreviations[itemMonth];
          return (
            parseInt(itemYear) === selectedYear &&
            monthNumerical === currentMonth
          );
        });

        const totalPaymentOut = matchingYearMonthPaymentOut?.reduce(
          (sum, item) => {
            const currencySymbol = item.currency_symbol;
            const paymentOutValue = parseFloat(item.total_payment_out);

            const currencyConversionRate = conversionRates[currencySymbol] || 1;
            const paymentOutInUSD =
              currencySymbol === userCurrency
                ? paymentOutValue
                : paymentOutValue / currencyConversionRate;

            return sum + paymentOutInUSD;
          },
          0
        );

        const totalRefundAmount = matchingYearMonthPaymentOut?.reduce(
          (sum, item) => {
            const currencySymbol = item.currency_symbol;
            const refundAmountValue = parseFloat(item.total_refund_amount);

            const currencyConversionRate = conversionRates[currencySymbol] || 1;
            const refundAmountInUSD =
              currencySymbol === userCurrency
                ? refundAmountValue
                : refundAmountValue / currencyConversionRate;

            return sum + refundAmountInUSD;
          },
          0
        );

        const totalWithdrawalAmount = matchingYearMonthPaymentOut?.reduce(
          (sum, item) => {
            const currencySymbol = item.currency_symbol;
            const withdrawalAmountValue = parseFloat(
              item.total_withdrawal_amount
            );

            const currencyConversionRate = conversionRates[currencySymbol] || 1;
            const withdrawalAmountInUSD =
              currencySymbol === userCurrency
                ? withdrawalAmountValue
                : withdrawalAmountValue / currencyConversionRate;

            return sum + withdrawalAmountInUSD;
          },
          0
        );

        const totalCommissionFee = matchingYearMonthPaymentOut?.reduce(
          (sum, item) => {
            const currencySymbol = item.currency_symbol;
            const commissionFeeValue = parseFloat(item.total_commission_fee);

            const currencyConversionRate = conversionRates[currencySymbol] || 1;
            const commissionFeeInUSD =
              currencySymbol === userCurrency
                ? commissionFeeValue
                : commissionFeeValue / currencyConversionRate;

            return sum + commissionFeeInUSD;
          },
          0
        );

        const previousMonthData = updatedData.find((monthData) => {
          const [month, year] = monthData.Month.split(" ");
          const monthNumerical = monthAbbreviations[month];
          const formattedMonth = String(monthNumerical).padStart(2, "0");
          return (
            formattedMonth ===
            String(parseInt(currentMonth) - 1).padStart(2, "0")
          );
        });

        const currencyConversionRate =
          getCurrencyConversionRate(selectedCurrency);
        const prevMonthPaymentOut =
          previousMonthData?.PaymentOut * currencyConversionRate || 0;
        const currentMonthPaymentOut = totalPaymentOut * currencyConversionRate;
        const CommissionFee = totalCommissionFee * currencyConversionRate;
        const RefundAmount = totalRefundAmount * currencyConversionRate;
        const WithDrawalAmount = totalWithdrawalAmount * currencyConversionRate;
        const deltaValue = currentMonthPaymentOut - prevMonthPaymentOut;

        let deltaPercentage = 0;
        if (prevMonthPaymentOut !== 0) {
          deltaPercentage = (deltaValue / prevMonthPaymentOut) * 100;
        }

        let deltaType = "moderateIncrease";
        if (deltaValue < 0) {
          deltaType = "moderateDecrease";
        }

        const formattedMetric = formatCurrency(
          currentMonthPaymentOut,
          selectedCurrency
        );
        const formattedMetricRefund = formatCurrency(
          RefundAmount,
          selectedCurrency
        );
        const formattedMetricWithdrawal = formatCurrency(
          WithDrawalAmount,
          selectedCurrency
        );
        const formattedMetricCommission = formatCurrency(
          CommissionFee,
          selectedCurrency
        );

        return {
          ...category,
          metric: formattedMetric,
          delta: `${deltaPercentage.toFixed(1)}%`,
          deltaType: deltaType,
          totalRefundAmount: formattedMetricRefund,
          totalWithdrawalAmount: formattedMetricWithdrawal,
          totalCommissionFee: formattedMetricCommission,
        };
      } else if (category.title === "New Orders") {
        const newCategory = {
          ...category,
          metric: newOrders?.length,
        };

        return newCategory;
      }

      return category;
    });
    setUpdatedCategories(updatedCategoriess);
  }, [
    selectedCurrency,
    conversionRates,
    selectedYear,
    newOrders,
    selectedDate,
    SalesByMonth,
  ]);

  useEffect(() => {
    const fetchConversionRates = async (toCurrency) => {
      try {
        const response = await fetch(
          `${AdminUrl}/api/scrape-exchange-rate?from=${userCurrency}&to=${toCurrency}`
        );

        if (response.ok) {
          const data = await response.json();
          return parseFloat(data.exchangeRate);
        } else {
          console.error(
            `Error fetching data for ${toCurrency}:`,
            response.statusText
          );
          return 1; // Set default rate as 1 in case of error
        }
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
        return 1; // Set default rate as 1 in case of error
      }
    };

    const updateConversionRates = async () => {
      try {
        setisCurrencyloading(true);
        const currencies = ["USD", "EUR", "ETB", "SOS", "KES", "INR"]; // List of all currencies except USD

        const promises = currencies.map(async (currency) => {
          const conversionRate = await fetchConversionRates(currency);
          return [currency, conversionRate];
        });

        const conversionRateData = await Promise.all(promises);

        // Convert the array of data into an object
        const updatedConversionRates = Object.fromEntries(conversionRateData);

        // Check if all conversion rates are 1
        const allRatesAreOne = conversionRateData.every(
          ([, rate]) => rate === 1
        );

        if (!allRatesAreOne) {
          const conversionRatesCookie = Cookies.get("conversionRatesSales");
          if (conversionRatesCookie) {
            // If the cookie is set, parse it and set the state from the cookie value
            const parsedConversionRates = JSON.parse(conversionRatesCookie);
            setConversionRates(parsedConversionRates);
          } else {
            // If the cookie is not set, store the updatedConversionRates object as a JSON string in the cookie
            Cookies.set(
              "conversionRatesSales",
              JSON.stringify(updatedConversionRates),
              { expires: 1 } // Set the cookie to expire after 1 day
            );
            setConversionRates(updatedConversionRates);
          }

          setisCurrencyloading(false);
        } else {
          Modal.error({
            title: "Conversion Issue",
            content: (
              <div style={{ fontSize: "16px", lineHeight: "1.5" }}>
                <p>
                  We apologize for the inconvenience, but there is currently an
                  issue with converting all currencies to USD.
                </p>
                <p>
                  Our team is working to resolve this problem. In the meantime,
                  we recommend refreshing the page.
                </p>
              </div>
            ),
            okButtonProps: { style: { display: "none" } }, // Hide the OK button
          });
        }
      } catch (error) {
        console.error("Error updating conversion rates:", error);
      }
    };

    // Check if the "conversionRatesSales" cookie is already set
    const conversionRatesCookie = Cookies.get("conversionRatesSales");
    if (!conversionRatesCookie) {
      // If the cookie is not set, call updateConversionRates
      updateConversionRates();
    } else {
      // If the cookie is set, parse it and set the state from the cookie value
      const parsedConversionRates = JSON.parse(conversionRatesCookie);
      setConversionRates(parsedConversionRates);
      setisCurrencyloading(false);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${AdminUrl}/api/currentorders/${vendorId}?date=${selectedDate}`,
          {
            method: "GET",
            // Add headers if needed, e.g., for authentication or content type
          }
        );

        if (response.ok) {
          const data = await response.json();
          const statusCounts = {}; // Create an object to store status counts

          // Calculate status counts from the fetched data
          data.forEach((order) => {
            const orderStatus = order.order_status;
            if (orderStatus in statusCounts) {
              statusCounts[orderStatus]++;
            } else {
              statusCounts[orderStatus] = 1;
            }
          });

          setnewOrders(data);

          // Update the orderStatuses state with the counts
          const updatedOrderStatuses = orderStatuses.map((statusObj) => ({
            ...statusObj,
            metric: statusCounts[statusObj.status] || 0,
          }));

          setorderStatuses(updatedOrderStatuses);
        } else {
          console.error("Error fetching orders:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    type !== "admin" && fetchOrders();
  }, [selectedDate, vendorId]);

  const statusColors = {
    Pending: "text-yellow-600",
    Confirmed: "text-green-600",
    Shipped: "text-blue-600",
    Returned: "text-red-600",
    Exchanged: "text-indigo-600",
    Cancelled: "text-gray-600",
    Delivered: "text-green-600",
  };

  const getDeltaType = (metric) => {
    if (metric === 0) {
      return "unchanged";
    } else if (metric > 0) {
      return metric > 100 ? "increase" : "moderateIncrease";
    } else {
      return "decrease";
    }
  };

  function isToday(date) {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }

  function isYesterday(date) {
    const d = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear()
    );
  }

  function formatDate(dateString) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const isAdmin = type === "admin";

  const renderCard = (item) => {
    const category = item.title.replace(/\s/g, ""); // Remove spaces from title

    const handleDateChange = (date, datestring) => {
      // Check if date is not null, then format it and store in "YYYY-MM-DD" format
      setSelectedDate(datestring);
    };

    return (
      <Card key={item.title}>
        <Flex alignItems="start">
          <Typography.Text className="font-bold">{item.title}</Typography.Text>
          {category !== "NewOrders" && (
            <BadgeDelta deltaType={item.deltaType}>{item.delta}</BadgeDelta>
          )}
          {category == "NewOrders" && (
            <DatePicker
              onChange={handleDateChange}
              placeholder="Check another"
              allowClear={false}
              showToday={true}
              inputReadOnly
              picker="date"
            />
          )}
        </Flex>
        <Flex
          className="space-x-3 flex justify-between truncate"
          justifyContent="start"
          alignItems="baseline"
        >
          <Metric className="leading-tight">
            {category === "Paymentout" ? (
              <div className="text-left rounded-lg shadow-md">
                <p className="mb-1">{item.metric}</p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-5 text-sm">
                  <div>
                    <span className="font-medium">Refund Amount:</span>
                  </div>
                  <div>{item?.totalRefundAmount}</div>
                  <div>
                    <span className="font-medium">Withdrawal Amount:</span>
                  </div>
                  <div>{item?.totalWithdrawalAmount}</div>
                  <div>
                    <span className="font-medium">Commission Fee:</span>
                  </div>
                  <div>{item?.totalCommissionFee}</div>
                </div>
              </div>
            ) : (
              item.metric
            )}
          </Metric>
        </Flex>
        {category !== "NewOrders" && (
          <AreaChart
            className="mt-6 h-28"
            data={updatedData}
            index="Month"
            valueFormatter={(number) => {
              if (
                category === "Purchased" ||
                category === "Customers" ||
                category === "AverageOrderValue"
              ) {
                return number.toLocaleString();
              } else {
                const formattedNumber = number.toLocaleString(undefined, {
                  currency: selectedCurrency,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
                return `${formattedNumber} ${selectedCurrency}`;
              }
            }}
            categories={[category]}
            colors={["blue"]}
            showXAxis={true}
            showGridLines={true}
            startEndOnly={true}
            showYAxis={false}
            showLegend={false}
            yAxisTickCount={5}
            yAxisMaxValue={15000}
          />
        )}
        {category === "NewOrders" && (
          <div className="mt-2">
            <h1>
              {isToday(selectedDate)
                ? `Today (${formatDate(selectedDate)}) Status`
                : isYesterday(selectedDate)
                  ? `Yesterday (${formatDate(selectedDate)}) Status`
                  : formatDate(selectedDate)}
            </h1>
            <div className="grid grid-cols-2 mt-2 gap-4">
              {orderStatuses.map((item, index) => (
                <div key={index}>
                  <List className="mt-1">
                    <ListItem>
                      <Flex justifyContent="start" className="space-x-2.5">
                        <BadgeDelta deltaType={getDeltaType(item.metric)} />
                        <Text
                          className={`truncate animate-pulse ${statusColors[item.status]
                            }`}
                        >
                          {item.metric} {item.status}
                        </Text>
                      </Flex>
                    </ListItem>
                  </List>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div>
      <div className="relative flex justify-end items-center p-2 mb-4">
        <div className="relative flex items-center justify-end ">
          <span className="mr-2 font-bold">{PreviousCurrency} to: </span>
          <Select
            value={selectedCurrency}
            onChange={handleCurrencySelectChange}
            style={{ width: 220 }} // Adjust width to accommodate longer country names
          >
            {currencyOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label} ({option.value})
              </Option>
            ))}
          </Select>
        </div>
        <div className="ml-4">
          <span className="mr-2 font-bold">Select Year: </span>
          <Select
            value={selectedYear}
            onChange={handleYearSelectChange}
            style={{ width: 120 }}
          >
            {yearOptions.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
        {isCurrencyloading
          ? updatedCategories.map((_, index) => (
            <Card key={index} className={`p-4 animate-pulse`}>
              {/* Skeleton loading elements */}
              <div className="flex items-start animate-pulse">
                <div className="flex flex-col w-full space-y-2">
                  <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="ml-auto space-x-2">
                  <div className="w-12 h-4 bg-gray-300 rounded mt-2"></div>
                </div>
              </div>
              <div className="flex space-x-3 animate-pulse">
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="mt-6 h-28 bg-gray-300 rounded animate-pulse"></div>
            </Card>
          ))
          : updatedCategories.map((item) => {
            const category = item.title.replace(/\s/g, ""); // Remove spaces from title

            if (
              (isAdmin && category === "Sales") ||
              category === "PaymentIn" ||
              category === "Paymentout"
            ) {
              return renderCard(item);
            } else if (!isAdmin) {
              return renderCard(item);
            } else {
              return null;
            }
          })}
      </Grid>
    </div>
  );
}
