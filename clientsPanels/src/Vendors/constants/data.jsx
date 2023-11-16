import {
  AiOutlinePieChart,
  AiOutlineUnorderedList,
  AiOutlineShoppingCart,
  AiOutlineDollar,
  AiOutlineLineChart,
  AiOutlineBell,
} from "react-icons/ai";
import { FaFileInvoice, FaListOl } from "react-icons/fa";
import { IoIosStats, IoIosDocument } from "react-icons/io";

export const vendorLinks = [
  {
    title: "Main",
    links: [
      {
        id: 1,
        name: "Dashboard",
        icon: <AiOutlinePieChart />,
        to: "/Vendors",
      },
      {
        id: 2,
        name: "Products",
        icon: <AiOutlineUnorderedList />,
        dropdown: true,
        start: '/Vendors/products',
        dropList: [
          {
            id: 31,
            name: "All Products",
            to: "/Vendors/products/all",
          },
          {
            id: 35,
            name: "All Products New",
            to: "/Vendors/vp",
          },
          {
            id: 32,
            name: "Bulk Upload",
            to: "/Vendors/products/bulkUpload",
          },
          {
            id: 322,
            name: "Rejected Products",
            to: "/Vendors/products/Rejected",
          },
        ],
      },
      {
        id: 10,
        name: "Attributes",
        icon: <FaListOl />,
        to: "/Vendors/attributes",
      },
      {
        id: 3,
        name: "Orders",
        icon: <AiOutlineShoppingCart />,
        to: "/Vendors/Orders",
      },

      {
        id: 4,
        name: "Reports",
        icon: <IoIosDocument />,
        to: "/Vendors/reports",
      },
      {
        id: 5,
        name: "Payments",
        icon: <AiOutlineDollar />,
        to: "/Vendors/Payments",
      },
      {
        id: 6,
        name: "Sales & Return Report",
        icon: <AiOutlineLineChart />,
        to: "/Vendors/SalesReturns",
      },
      // {
      //   id: 7,
      //   name: "Commission Invoices",
      //   icon: <FaFileInvoice />,
      //   to: "/Vendors/commission-invoices",
      // },
      {
        id: 9,
        name: "Notifications",
        icon: <AiOutlineBell />,
        to: "/Vendors/Notifications",
      },
    ],
  },
];
