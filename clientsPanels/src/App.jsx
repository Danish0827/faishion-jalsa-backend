import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  AcceptReject,
  AdminDashboard,
  Login,
  ManageCategory,
  ManagePermisson,
  NotFound,
  VendorApproval,
  VendorEnable,
  Vendors,
  ViewDetails,
  AdminAttributes,
  EnquiryForms,
  Inventory
} from "./Admin/pages";
import { AdminSidebar } from "./Admin/components";
import { AdminUrl, adminData, links, vendorDataDb } from "./Admin/constant";
import {
  BulkProductUpload,
  OrderManagementPage,
  Profile,
  RejectedProducts,
  VendorDashboard,
  VendorLogin,
  Logout,
  Payments,
  VendorProducts,
  Notifications,
  SalesReturn,
  Reports,
  Attributes,
  VendorSignUp,
  VendorP,
} from "./Vendors";
import VendorSidebar from "./Vendors/components/VendorSidebar";
import { AbandonCart, CustomerHome, Support, ViewTicket } from "./Admin/pages/Customers";
import { AllOrders } from "./Admin/pages/Orders";
import Cookies from "js-cookie";
import { Modal } from "antd";
import {
  CustomerLogin,
  CustomerProfile,
  Homepage,
  Signup,
} from "./Customers/pages";
import Apitest from "./Vendors/api";
import { Header } from "./Customers/components";
import VariantsCrud from "./Vendors/VariantCrud";

function AdminRoutes() {
  const [superad, setsuperadmin] = useState(false);
  const [vendorExists, setvendorExists] = useState(false);
  const [customerExists, setcustomerExists] = useState(false);
  const [collapse, setcollapse] = useState(true);
  const [adminLoginData, setadminLoginData] = useState(null);
  const [vendorDatastate, setvendorDatastate] = useState(null);
  const [user, setUser] = useState(null);
  const [locationData, setLocationData] = useState({
    city: "",
    state: "",
    country: "",
  });

  let userCurrency = "KES";

  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const [conversionRates, setConversionRates] = useState({
    USD: 1, // Default to 1 for USD
    EUR: 0,
    ETB: 0,
    SOS: 0,
    KES: 0,
    INR: 0,
  });

  const [isCurrencyloading, setisCurrencyloading] = useState(true);

  useEffect(() => {
    const fetchConversionRates = async (toCurrency) => {
      try {
        const response = await fetch(
          `${AdminUrl}/api/scrape-exchange-rate?from=${toCurrency}&to=${userCurrency}`
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
        const currencies = ["USD", "EUR", "ETB", "SOS", "KES", "INR"]; // List of all currencies except USD

        const promises = currencies.map(async (currency) => {
          const conversionRate = await fetchConversionRates(currency);
          console.log(currency, conversionRate);

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
          const conversionRatesCookie = Cookies.get("conversionRates");
          if (conversionRatesCookie) {
            // If the cookie is set, parse it and set the state from the cookie value
            const parsedConversionRates = JSON.parse(conversionRatesCookie);
            setConversionRates(parsedConversionRates);
          } else {
            // If the cookie is not set, store the updatedConversionRates object as a JSON string in the cookie
            Cookies.set(
              "conversionRates",
              JSON.stringify(updatedConversionRates),
              {
                expires: 1, // Set cookie expiry to 1 day
              }
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

    // Check if the "conversionRates" cookie is already set
    const conversionRatesCookie = Cookies.get("conversionRates");
    if (!conversionRatesCookie) {
      // Call the updateConversionRates function when the cookie is not set
      updateConversionRates();
    } else {
      // If the cookie is set, parse it and set the state
      const parsedConversionRates = JSON.parse(conversionRatesCookie);
      setConversionRates(parsedConversionRates);
      setisCurrencyloading(false);
    }
  }, []);

  useEffect(() => {
    const AdminData = async () => {
      try {
        const jsondata = await adminData();
        setadminLoginData(jsondata);
      } catch (err) {
        console.log(err);
      }
    };

    adminLoginData === null && AdminData();

    const vendorData = async () => {
      try {
        const jsondata = await vendorDataDb();
        setvendorDatastate(jsondata);
      } catch (err) {
        console.log(err);
      }
    };

    vendorDatastate === null && vendorData();
  }, [vendorDatastate]);

  useEffect(() => {
    const SuperAdmin = [
      "/Admin",
      "/Admin/Vendors",
      "/Admin/Vendors/Approval&Reject",
      "/Admin/Vendors/viewDetails",
      "/Admin/Vendors/vendorEnable",
      "/Admin/ManagePermisson",
      "/Admin/Attributes",
      "/Admin/ManageCategory",
      "/Admin/Customers",
      "/Admin/Customers/AbandonCart",
      "/Admin/Customers/Support",
      "/Admin/Customers/viewTicket",
      "/Admin/Products/AcceptReject",
      "/Admin/Orders/all",
      "/Admin/EnquiryForms",
      "/Admin/Inventory"
    ];
    const checkSuperAdmin = SuperAdmin.includes(path);
    setsuperadmin(checkSuperAdmin);
  }, [path]);

  useEffect(() => {
    const VendorPanel = [
      "/Vendors",
      "/Vendors/products/all",
      "/Vendors/vp",
      "/Vendors/Profile",
      "/Vendors/products/bulkUpload",
      "/Vendors/products/Rejected",
      "/Vendors/logout",
      "/Vendors/Orders",
      "/Vendors/Payments",
      "/Vendors/Notifications",
      "/Vendors/SalesReturns",
      "/Vendors/reports",
      "/Vendors/attributes",
      "/Vendors/test",
    ];
    const checkVendorPanel = VendorPanel.includes(path);
    setvendorExists(checkVendorPanel);
  }, [path]);

  useEffect(() => {
    const CustomerPanel = ["/Customers/Profile", "/"];
    const checkCustomerPanel = CustomerPanel.includes(path);
    setcustomerExists(checkCustomerPanel);
  }, [path]);

  useEffect(() => {
    const googleLoginCookie = Cookies.get("googleLogin");
    const getUser = async () => {
      try {
        const response = await fetch(`${AdminUrl}/auth/login/success`, {
          method: "GET",
          credentials: "include", // Include credentials
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (response.status === 200) {
          const resObject = await response.json();
          setUser(resObject.user);
        } else {
          throw new Error("Authentication has failed!");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    getUser();
  }, []);

  // const isVendorLoggedIn = vendorDatastate && vendorDatastate.length == 0;

  const handleCollapseAPP = (collapse) => {
    setcollapse(collapse);
  };

  const handleUser = (user) => {
    setUser(user);
  };

  const getUserLocation = async () => {
    try {
      const response = await fetch("http://ip-api.com/json");
      const data = await response.json();

      if (data.status === "success") {
        const city = data.city || "";
        const state = data.regionName || "";
        const country = data.country || "";

        setLocationData({ city, state, country });
      } else {
        console.error("Location data not found.");
      }
    } catch (error) {
      console.error("Error getting user location:", error.message);
    }
  };

  useEffect(() => {
    // Call the function to get user location when the component mounts
    if (locationData?.city === "") getUserLocation();
  }, [locationData]);

  console.log(locationData);

  return (
    <div className="h-screen bg-[#ecf0f5] overflow-y-scroll">
      {superad ? (
        <>
          <AdminSidebar adminLoginData={adminLoginData} />
          <Routes>
            <Route
              exact
              path="/Admin"
              element={
                <AdminDashboard
                  adminLoginData={adminLoginData}
                  conversionRates={conversionRates}
                  isCurrencyloading={isCurrencyloading}
                />
              }
            />
            <Route
              path="/Admin/Vendors"
              element={<Vendors adminLoginData={adminLoginData} />}
            />
            <Route
              path="/Admin/Vendors/Approval&Reject"
              element={<VendorApproval adminLoginData={adminLoginData} />}
            />
            <Route
              path="/Admin/Vendors/ViewDetails"
              element={<ViewDetails adminLoginData={adminLoginData} />}
            />
            <Route
              path="/Admin/Vendors/vendorEnable"
              element={<VendorEnable adminLoginData={adminLoginData} />}
            />
            <Route
              path="/Admin/Attributes"
              element={<AdminAttributes adminLoginData={adminLoginData} />}
            />
            <Route
              path="/Admin/ManagePermisson"
              element={<ManagePermisson adminLoginData={adminLoginData} />}
            />
            <Route
              path="/Admin/ManageCategory"
              element={<ManageCategory adminLoginData={adminLoginData} />}
            />
            <Route
              path="/Admin/Customers"
              element={<CustomerHome adminLoginData={adminLoginData} />}
            />
            <Route
              path="/Admin/Customers/AbandonCart"
              element={<AbandonCart adminLoginData={adminLoginData} />} />
            <Route
              path="/Admin/Customers/Support"
              element={<Support adminLoginData={adminLoginData} />}
            />
            <Route
              path="/Admin/Customers/viewTicket"
              element={<ViewTicket adminLoginData={adminLoginData} />}
            />
            <Route
              path="/Admin/Products/AcceptReject"
              element={<AcceptReject adminLoginData={adminLoginData} />}
            />
            <Route
              path="/Admin/Orders/all"
              element={
                <AllOrders
                  adminLoginData={adminLoginData}
                  conversionRates={conversionRates}
                  isCurrencyloading={isCurrencyloading}
                />
              }
            />
            <Route
              path="/Admin/EnquiryForms"
              element={<EnquiryForms adminLoginData={adminLoginData} />} />
            <Route
              path="/Admin/Inventory"
              element={<Inventory adminLoginData={adminLoginData} />} />
          </Routes>
        </>
      ) : vendorExists ? (
        <>
          <VendorSidebar
            vendorDatastate={vendorDatastate}
            handleCollapseAPP={handleCollapseAPP}
          />
          <div
            className={`mx-auto py-2 px-8 mt-20 ${collapse
              ? "sm:ml-64 transition-all duration-300 ease-in"
              : "sm:ml-0 transition-all duration-300 ease-out"
              }`}
          >
            <Routes>
              {/* Other routes */}
              <Route
                path="/Vendors"
                element={
                  <VendorDashboard
                    vendorDatastate={vendorDatastate}
                    conversionRates={conversionRates}
                    isCurrencyloading={isCurrencyloading}
                    userCurrency={userCurrency}
                  />
                }
              />
              <Route
                path="/Vendors/products/all"
                element={<VendorProducts vendorDatastate={vendorDatastate} />}
              />
              <Route
                path="/Vendors/vp"
                element={<VendorP vendorDatastate={vendorDatastate} />}
              />
              <Route
                path="/Vendors/Profile"
                element={<Profile vendorDatastate={vendorDatastate} />}
              />
              <Route
                path="/Vendors/products/bulkUpload"
                element={
                  <BulkProductUpload vendorDatastate={vendorDatastate} />
                }
              />
              <Route
                path="/Vendors/products/Rejected"
                element={<RejectedProducts vendorDatastate={vendorDatastate} />}
              />
              <Route path="/Vendors/logout" element={<Logout />} />
              <Route
                path="/Vendors/Orders"
                element={
                  <OrderManagementPage
                    vendorDatastate={vendorDatastate}
                    conversionRates={conversionRates}
                    isCurrencyloading={isCurrencyloading}
                    userCurrency={userCurrency}
                  />
                }
              />
              <Route
                path="/Vendors/Payments"
                element={
                  <Payments
                    vendorDatastate={vendorDatastate}
                    conversionRates={conversionRates}
                    isCurrencyloading={isCurrencyloading}
                    userCurrency={userCurrency}
                  />
                }
              />
              <Route
                path="/Vendors/SalesReturns"
                element={
                  <SalesReturn
                    vendorDatastate={vendorDatastate}
                    conversionRates={conversionRates}
                    isCurrencyloading={isCurrencyloading}
                    userCurrency={userCurrency}
                  />
                }
              />
              <Route
                path="/Vendors/Notifications"
                element={<Notifications vendorDatastate={vendorDatastate} />}
              />
              <Route
                path="/Vendors/reports"
                element={<Reports vendorDatastate={vendorDatastate} />}
              />
              <Route
                path="/Vendors/attributes"
                element={<Attributes vendorDatastate={vendorDatastate} />}
              />
              <Route
                path="/Vendors/test"
                element={<VariantsCrud vendorDatastate={vendorDatastate} />}
              />
              {/* ... other routes */}
            </Routes>
          </div>
        </>
      ) : customerExists ? (
        <>
          <Header user={user} />

          <Routes>
            <Route
              path="/Customers/Profile"
              element={
                user ? <CustomerProfile /> : <Navigate to="/Customers/Login" />
              }
            />
            <Route
              path="/"
              element={user ? <Homepage /> : <Navigate to="/Customers/Login" />}
            />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/Admin/Login" element={<Login />} />
          <Route
            path="/Admin/404"
            element={<NotFound adminLoginData={adminLoginData} />}
          />
          {/* For Vendor Login Route  */}
          <Route path="/Vendors/Login" element={<VendorLogin />} />
          <Route path="/Vendors/SignUp" element={<VendorSignUp />} />
          <Route path="/Vendors/api" element={<Apitest />} />
          <Route
            path="/Customers/Login"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <CustomerLogin user={user} handleUser={handleUser} />
              )
            }
          />
          <Route
            path="/Customers/Signup"
            element={user ? <Navigate to="/" /> : <Signup />}
          />
        </Routes>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AdminRoutes />
    </BrowserRouter>
  );
}

export default App;