// src/pages/OrderManagementPage.js
import React from "react";
import OrderManagementTable from "./components/OrderManagementTable";
import AuthCheck from "./components/AuthCheck"; // Assuming you have this component

const OrderManagementPage = ({
  vendorDatastate,
  conversionRates,
  isCurrencyloading,
  userCurrency,
}) => {
  return vendorDatastate && vendorDatastate?.length > 0 ? (
    <>
      {!vendorDatastate?.[0].email_verification_status ||
      !vendorDatastate?.[0].mobile_verification_status ||
      vendorDatastate?.[0].status === 1 ||
      vendorDatastate?.[0].status === 4 ? (
        <div>
          0
          <AuthCheck vendorDatastate={vendorDatastate} />
        </div>
      ) : (
        <OrderManagementTable
          vendorDatastate={vendorDatastate}
          conversionRates={conversionRates}
          isCurrencyloading={isCurrencyloading}
          userCurrency={userCurrency}
        />
      )}
    </>
  ) : (
    ""
  );
};

export default OrderManagementPage;
