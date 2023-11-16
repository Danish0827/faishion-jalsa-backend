import { AiOutlinePieChart, AiOutlineUserAdd } from "react-icons/ai";
import {
  RiFileList3Line,
  RiAppsFill,
  RiUserSettingsFill,
  RiContactsFill,
  RiListCheck2,
  RiStore3Fill
} from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import Cookies from "js-cookie";
import { FaUserCheck } from "react-icons/fa";

export const AdminUrl = "http://localhost:3001";

export const links = [
  {
    title: "Main",
    links: [
      {
        id: 1,
        name: "Dashboard",
        icon: <AiOutlinePieChart />,
        to: "/Admin",
      },
      {
        id: 2,
        name: "Vendors Management",
        icon: <AiOutlineUserAdd />,
        dropdown: true,
        start: '/Admin/Vendors',
        dropList: [
          { name: "Vendor List", to: "/Admin/Vendors" },
          {
            name: "Approve/Reject Applications",
            to: "/Admin/Vendors/Approval&Reject",
          },
          {
            name: "Enable/Disable Accounts",
            to: "/Admin/Vendors/vendorEnable",
          },
          { name: "", to: "/Admin/Vendors/viewDetails" },
          { name: "Product Approval", to: "/Admin/Products/AcceptReject" },
        ],
      },
      {
        id: 3,
        name: "Category Management",
        icon: <RiAppsFill />,
        to: "/Admin/ManageCategory",
      },
      {
        id: 9,
        name: "Inventory Management",
        icon: <RiStore3Fill />,
        to: "/Admin/Inventory",
      },
      {
        id: 4,
        name: "Customer Management",
        icon: <FaUserCheck />,
        dropdown: true,
        start: '/Admin/Customers',
        dropList: [
          { name: "View Customers", to: "/Admin/Customers" },
          { name: 'Abandon Cart', to: "/Admin/Customers/AbandonCart" },
          { name: 'Support Ticket', to: "/Admin/Customers/Support" },
          { name: "", to: "/Admin/Customers/viewTicket" },
        ],
      },
      {
        id: 5,
        name: "Orders Management",
        icon: <RiFileList3Line />,
        dropdown: true,
        start: '/Admin/Orders',
        dropList: [
          { name: "View Orders", to: "/Admin/Orders/all" },
          { name: "Track Orders", to: "/Admin/Orders/track" },
        ],
      },
      {
        id: 6,
        name: "Attributes",
        icon: <RiListCheck2 />,
        to: "/Admin/Attributes",
      },
      {
        id: 7,
        name: "Roles & Permissons",
        icon: <RiUserSettingsFill />,
        to: "/Admin/ManagePermisson",
      },
      {
        id: 8,
        name: "Enquiry Forms",
        icon: <RiContactsFill />,
        to: "/Admin/EnquiryForms"
      }
    ],
  },
];

export const adminData = async () => {
  const loggedId = Cookies.get("adminData");
  try {
    const response = await fetch(`${AdminUrl}/api/getAdminData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loggedId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const vendorDataDb = async () => {
  const loggedId = Cookies.get("vendorData");
  try {
    const response = await fetch(`${AdminUrl}/api/getVendorData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loggedId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const customerDataDB = async () => {
  const customerLoginCookies = Cookies.get("customerLoginCookies");
  try {
    const response = await fetch(`${AdminUrl}/api/getCustomerLoginData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerLoginCookies,
      }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const categoriesData = async () => {
  try {
    const response = await fetch(`${AdminUrl}/api/getAllProductCatgeory`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch categories data.");
  }
};

export const subcategoriesData = async () => {
  try {
    const response = await fetch(`${AdminUrl}/api/getAllSubcategories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch categories data.");
  }
};


export const getAllVendorProductvariants = async (vendorId) => {
  try {
    const response = await fetch(`${AdminUrl}/api/getAllVendorAttributes/${vendorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch categories data.");
  }
};

export async function fetchVariantProducts() {
  try {
    // Make a GET request to the backend API endpoint that fetches variant products
    const response = await fetch(`${AdminUrl}/api/variant-products`); // Replace with your actual API endpoint

    // Check if the response status is OK (HTTP 200)
    if (!response.ok) {
      // Handle errors, e.g., throw an error or return an error message
      throw new Error('Error fetching variant products');
    }

    // Parse the JSON response data
    const data = await response.json();

    // Handle the data as needed, e.g., update your component state
    // Return the fetched data if needed
    return data;
  } catch (error) {
    // Handle any errors that occur during the fetch or data processing
    console.error('Fetch error:', error);

    // You can also throw the error or return an error message
    throw error;
  }
}

export const formatCurrency = (value, currency) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(value);
};
