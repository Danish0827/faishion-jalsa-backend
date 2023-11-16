import React, { useEffect, useState } from "react";
import DashboardMetrics from "./components/DashboardsMetrics";
import AuthCheck from "./components/AuthCheck";
import CategorySales from "./components/CategorySales";

const VendorDashboard = ({
  vendorDatastate,
  conversionRates,
  isCurrencyloading,
  userCurrency,
}) => {
  return vendorDatastate && vendorDatastate?.length > 0 ? (
    <>
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
            <DashboardMetrics
              vendorDatastate={vendorDatastate}
              conversionRates={conversionRates}
              isCurrencyloading={isCurrencyloading}
              userCurrency={userCurrency}
            />
            {/* <SalesChart /> */}
            <div className="mt-10">
              <CategorySales
                vendorDatastate={vendorDatastate}
                conversionRates={conversionRates}
                isCurrencyloading={isCurrencyloading}
                userCurrency={userCurrency}
              />
            </div>
          </>
        )}
      </>
    </>
  ) : (
    ""
  );
};

export default VendorDashboard;
