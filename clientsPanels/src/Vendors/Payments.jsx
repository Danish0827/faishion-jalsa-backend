import React, { useEffect, useState } from "react";
import { Card, Metric, Text, Flex, BadgeDelta, Grid } from "@tremor/react";
import { AdminUrl, formatCurrency } from "../Admin/constant";
import AuthCheck from "./components/AuthCheck";
import PaymentHistoryTable from "./components/PaymentHistoryTable";
import { Button, Tooltip } from "antd";
import WithdrawalsTable from "./components/WithdrawalRequests";
import html2pdf from "html2pdf.js";
import { FaFilePdf } from "react-icons/fa";
import "./components/Vendors.css"
export default function Payments({
  vendorDatastate,
  conversionRates,
  isCurrencyloading,
  userCurrency,
}) {
  // Initialize state variables to store the fetched data
  const [data, setData] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState("0");
  const [pendingAmounts, setPendingAmounts] = useState("0");
  const [withdrawnAmount, setWithdrawnAmount] = useState("0");
  const [CurrencyCode, setCurrencyCode] = useState(null);
  const [withdrawn, setWithdrawn] = useState(0); // State to track the withdrawal amount
  const vendor_Id = vendorDatastate?.[0]?.id;

  useEffect(() => {
    console.log(conversionRates);

    // Define the backend API URL
    const apiUrl = `${AdminUrl}/api/earnings/${vendor_Id}`; // Replace with the actual URL
    // Function to convert an amount from one currency to another based on conversion rates
    const convertCurrency = (
      amount,
      sourceCurrency,
      targetCurrency,
      conversionRates
    ) => {
      if (sourceCurrency === targetCurrency) {
        return amount; // No need to convert if the currencies are the same
      }

      // Check if conversion rates are available for both currencies
      if (conversionRates[sourceCurrency] && conversionRates[targetCurrency]) {
        // Calculate the converted amount using the conversion rates
        const convertedAmount =
          (amount / conversionRates[sourceCurrency]) *
          conversionRates[targetCurrency];
        return convertedAmount;
      } else {
        console.error(
          `Conversion rates not available for ${sourceCurrency} or ${targetCurrency}`
        );
        return amount; // Return the original amount if conversion rates are missing
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();

        // Store the data in the state
        setData(responseData);
        setCurrencyCode(responseData[0].currency_code);
        console.log(responseData);
        // Convert and store the earnings, pending amounts, and withdrawn amounts
        const convertedEarnings = convertCurrency(
          responseData[0].total_earning || 0,
          responseData[0].currency_code,
          userCurrency,
          conversionRates
        );
        setTotalEarnings(convertedEarnings);

        const convertedPendingAmounts = convertCurrency(
          responseData[0].pending_amount || 0,
          responseData[0].currency_code,
          userCurrency,
          conversionRates
        );
        setPendingAmounts(convertedPendingAmounts);

        const convertedWithdrawnAmount = convertCurrency(
          responseData[0].withdrawn_amount || 0,
          responseData[0].currency_code,
          userCurrency,
          conversionRates
        );
        setWithdrawnAmount(convertedWithdrawnAmount);
      } catch (error) { }
    };

    vendorDatastate && vendorDatastate.length > 0 && fetchData();
  }, [vendorDatastate, userCurrency]);

  const categories = [
    {
      title: "Total Earnings",
      metric: `${formatCurrency(totalEarnings, userCurrency)}`,
      note: "Your cumulative earnings, including pending and available balances.",
    },
    {
      title: "Pending Amounts",
      metric: `${formatCurrency(pendingAmounts, userCurrency)}`,
      note: "The total amount currently awaiting payment from customers.",
    },
    {
      title: "Available Balance",
      metric: `${formatCurrency(withdrawnAmount, userCurrency)}`,
      note: "The funds available for withdrawal to your bank account.",
    },
  ];

  const handleWithdraw = () => {
    // Perform withdrawal logic here
    // You can call an API or perform any other actions
    // For this example, we'll update the state to simulate a withdrawal
    setWithdrawn(withdrawnAmount); // Update the withdrawn amount to the available balance
  };

  const handlePrint = () => {
    const printElement = document.getElementById("printFullPage");
    if (printElement) {
      // Reduce font sizes
      printElement.style.fontSize = "smaller";

      // Add padding
      printElement.style.padding = "20px";

      // Remove print button
      const printButton = printElement.querySelector("button");
      if (printButton) {
        printButton.remove();
      }

      // Remove content of note
      const noteElements = printElement.querySelectorAll("#note");
      noteElements.forEach((noteElement) => {
        noteElement.innerHTML = "";
      });

      // Adjust font size and quality of metric
      const metricElements = printElement.querySelectorAll("#metric");
      metricElements.forEach((metricElement) => {
        metricElement.style.fontSize = "20px";
        metricElement.style.fontSmooth = "always"; // Set font smoothing to improve quality
      });

      html2pdf()
        .set({ html2canvas: { dpi: 500000 } }) // Set the DPI value to 300 or higher
        .from(printElement)
        .save("FJ_FinancialStats.pdf")
        .then(() => {
          // Reset settings to default
          printElement.style.fontSize = "";
          printElement.style.padding = "";
          noteElements.forEach((noteElement, index) => {
            noteElement.innerHTML = categories[index].note;
          });
          metricElements.forEach((metricElement) => {
            metricElement.style.fontSize = "";
            metricElement.style.fontSmooth = "";
          });

          // Show print button again with theme classes
          const newPrintButton = document.createElement("button");
          newPrintButton.innerText = "Download PDF";
          newPrintButton.className =
            "flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";
          newPrintButton.addEventListener("click", handlePrint);
          printElement
            .querySelector(".print-button-container")
            .appendChild(newPrintButton);
        });
    }
  };
  return vendorDatastate && vendorDatastate?.length > 0 ? (
    <>
      {!vendorDatastate?.[0].email_verification_status ||
        !vendorDatastate?.[0].mobile_verification_status ||
        vendorDatastate?.[0].status === 1 ||
        vendorDatastate?.[0].status === 4 ? (
        <>
          <AuthCheck vendorDatastate={vendorDatastate} />
        </>
      ) : (
        <>
          <div className="mb-24" id="printFullPage">
            <div className="w-full md:flex md:justify-between md:self-end">
              <div>
                <h1 className="fashionfont text-[20px] text-[#000] font-semibold mb-1 font-sans">
                  Financial Insights
                </h1>

                <p className="text-[14px] text-[#495057]">
                  Gain valuable insights into your payment data and financial
                  transactions.
                </p>
              </div>
              <div className="print-button-container">
                <button
                  className="flex items-center bg-[#003032] hover:bg-[#003032]/80 text-white font-semibold py-2 px-4 rounded"
                  onClick={handlePrint}
                >
                  <FaFilePdf className="mr-2" /> Download PDF
                </button>
              </div>
            </div>
            <Grid numItemsSm={2} numItemsLg={4} className="gap-6 mt-10">
              {categories.map((item) => (
                <Card key={item.title}>
                  <Text className="text-[#495057]">{item.title}</Text>
                  <Flex
                    justifyContent="start"
                    alignItems="baseline"
                    className="truncate space-x-3"
                  >
                    <Metric className="mt-0 text-xl" id="metric">
                      {item.metric}
                    </Metric>
                  </Flex>
                  <div>
                    <small
                      className="text-gray-600 block mt-2 text-justify"
                      id="note"
                    >
                      {item.note}
                    </small>
                  </div>
                </Card>
              ))}
            </Grid>

            <PaymentHistoryTable data={data} />
            <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

            <div className="w-full md:flex md:justify-between md:self-end mt-5">
              <div>
                <h1 className="fashionfont text-[20px] text-[#495057] font-semibold mb-1 font-sans">
                  Withdrawal Requests
                </h1>
                <p className="text-[14px] text-[#495057]">
                  View and manage your withdrawal requests and financial
                  transactions.
                </p>
              </div>
            </div>

            <WithdrawalsTable vendorId={vendor_Id} />
          </div>
        </>
      )}
    </>
  ) : (
    ""
  );
}
