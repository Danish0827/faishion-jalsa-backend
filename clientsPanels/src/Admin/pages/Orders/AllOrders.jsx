import React from "react";
import OrderMetrics from "../../../Vendors/components/OrderMetrics";
import OrderManagementTable from "../../../Vendors/components/OrderManagementTable";

const AllOrders = ({ conversionRates, isCurrencyloading }) => {
  return (
    <div className="sm:ml-72">
      <OrderMetrics type={"admin"} conversionRates={conversionRates} isCurrencyloading={isCurrencyloading} />
      <OrderManagementTable type={"admin"} />
    </div>
  );
};

export default AllOrders;
