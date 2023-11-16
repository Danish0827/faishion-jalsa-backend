import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { vendorLinks } from "../constants/data";
import { Menu } from "antd";
import "./Vendors.css"
import {
  UserOutlined,
  SettingOutlined,
  MessageOutlined,
  FlagOutlined,
  DollarOutlined,
  LockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const VendorSidebar = ({ vendorDatastate, handleCollapseAPP }) => {
  const [dropdown, setDropdown] = useState(false);
  const [collapse, setcollapse] = useState(true);
  const location = useLocation();
  const currentUrl = location.pathname;
  const [current, setCurrent] = useState("mail");
  const navigate = useNavigate();

  const handleDropdown = (drpIndex) => {
    setDropdown(!dropdown);
    if (dropdown) {
      document.getElementById(drpIndex).classList.remove("hidden");
    } else {
      document.getElementById(drpIndex).classList.add("hidden");
    }
  };
  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.link);
    navigate(e.key);
  };
  const items = [
    {
      label:
        vendorDatastate?.length > 0
          ? vendorDatastate[0]?.brand_name
          : "Profile",
      key: "SubMenu",
      icon: <UserOutlined />,
      children: [
        {
          type: "group",
          label: "Profile",
          children: [
            {
              label: "Profile",
              key: "/Vendors/Profile",
              icon: <UserOutlined />,
            },
            {
              label: "Messages",
              key: "/Messages",
              icon: <MessageOutlined />,
            },
            {
              label: "Help",
              key: "/help",
              icon: <FlagOutlined />,
            },
          ],
        },
        {
          type: "group",
          label: "Auth",
          children: [
            {
              label: "Balance",
              key: "/balance",
              icon: <DollarOutlined />,
            },
            {
              label: "Settings",
              key: "/ettings",
              icon: <SettingOutlined />,
            },
            {
              label: "Lock Screen",
              key: "/lockscreen",
              icon: <LockOutlined />,
            },
            {
              label: "Logout",
              key: "/Vendors/logout",
              icon: <LogoutOutlined />,
            },
          ],
        },
      ],
    },
  ];


  const handleCollapse = () => {
    setcollapse(!collapse);
    handleCollapseAPP(!collapse);
  };

  return (
    <>
      {vendorDatastate == null || vendorDatastate?.length == 0 ? (
        ""
      ) : (
        <>
          <nav className={`shadow fashionfont fixed top-0 right-0 z-50 w-full lg:w-4/5 bg-[#fff] dark:bg-[#081831] dark:border-gray-700${collapse
            ? "fixed top-0 right-0 z-50 lg:w-4/5 bg-[#003032] dark:bg-[#081831] sm:translate-x-0 transition-all duration-300 ease-in"
            : "fixed top-0 right-0 z-50 lg:w-full bg-[#003032] dark:bg-[#081831] sm:-translate-x-0 transition-all duration-300 ease-out"}`}>
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <button
                    data-drawer-target="logo-sidebar"
                    data-drawer-toggle="logo-sidebar"
                    aria-controls="logo-sidebar"
                    type="button"
                    onClick={handleCollapse}
                    className={`block items-center p-2 text-[#003032] hover:text-[#2e393a] focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-300 dark:hover:text-gray-400 dark:focus:ring-gray-600 ${collapse
                      ? "hidden items-center p-2 text-[#003032] hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-300 dark:hover:text-gray-400 dark:focus:ring-gray-600"
                      : "block items-center p-2 text-[#003032] hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-300 dark:hover:text-gray-400 dark:focus:ring-gray-600"}`}
                  >
                    <span className="sr-only">Open sidebar</span>
                    <svg
                      className="w-6 h-6"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>

                </div>

                <Menu
                  onClick={onClick}
                  selectedKeys={[current]}
                  mode="horizontal"
                  items={items}
                  className="bg-[#003032] text-white"
                />
                {/* <Menu selectedKeys={[current]} mode="horizontal">
                  {items.map((item) => (
                    <Menu.Item key={item.key}>
                      <img src={item.imgSrc} alt={item.text} style={{ marginRight: '8px' }} />
                      {item.text}
                    </Menu.Item>
                  ))}
                </Menu> */}
              </div>
            </div>
          </nav>

          <aside
            id="logo-sidebar"
            className={`fixed top-0 z-40 transition-transform bg-[#003032] border-r  dark:bg-gray-800 dark:border-gray-700 ${collapse
              ? "lg:w-1/5 left-0 sm:translate-x-0 transition-all duration-300 ease-in z-50"
              : "w-0 -left-64 sm:-translate-x-64 transition-all duration-300 ease-out z-50"
              } h-screen pt-0 z-50`}
            aria-label="Sidebar"
          >
            <div className="h-full px-3 pb-4 overflow-y-auto bg-[#003032] dark:bg-[#003032]">
              <ul className="space-y-2 font-medium">
                {vendorLinks.map((item, index) => {
                  return (
                    <>
                      <div className="flex items-center justify-between py-3">


                        <div className="flex items-center ml-2 md:mr-24 lg:block lg:mr-0 lg:ml-0">
                          <Link to="/Vendors" className="flex items-center">
                            {/* <div class="h-16 w-16 rounded-full border-4 border-gradient-blue-orange flex items-center justify-center overflow-hidden">
                        <img
                          src="/logo.jpg"
                          className="h-24 object-contain  rounded-full"
                          alt="App Logo"
                        />
                      </div> */}
                            <div class="">
                              <img
                                src="/logo.png"
                                className=" w-40 rounded-full"
                                alt="App Logo"
                              />

                            </div>
                          </Link>
                        </div>
                        <button
                          data-drawer-target="logo-sidebar"
                          data-drawer-toggle="logo-sidebar"
                          aria-controls="logo-sidebar"
                          type="button"
                          onClick={handleCollapse}
                          className={`block items-center p-2 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-300 dark:hover:text-gray-400 dark:focus:ring-gray-600 ${collapse
                            ? "block items-center p-2 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-300 dark:hover:text-gray-400 dark:focus:ring-gray-600"
                            : "block items-center p-2 text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-300 dark:hover:text-gray-400 dark:focus:ring-gray-600"}`}
                        >
                          <span className="sr-only">Open sidebar</span>
                          <svg
                            className="w-6 h-6"
                            aria-hidden="true"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 6h16M4 12h16M4 18h16"
                            />
                          </svg>
                        </button>
                      </div>
                      {/* <h1 className="mt-5 text-gray-400">{item.title}</h1> */}
                      <h1 className="mt-5"></h1>
                      {item.links.map((link, index) => {
                        return (
                          <>
                            <li key={index}>
                              {link.dropdown ? (
                                <>
                                  <button
                                    type="button"
                                    className={`text-gray-400 hover:text-white flex items-center w-full p-2 transition duration-75 group dark:text-white dark:hover:bg-[#23527c] ${currentUrl.includes(link.start) && 'bg-[#23527c]'}`}
                                    onClick={() =>
                                      handleDropdown(`dropdown-example${index}`)
                                    }
                                    aria-controls={`dropdown-example${index}`}
                                    data-collapse-toggle={`dropdown-example${index}`}
                                  >
                                    {link.icon}
                                    <span
                                      className="flex-1 ml-3 text-left whitespace-nowrap line-clamp-1"
                                      sidebar-toggle-item
                                    >
                                      {link.name}
                                    </span>
                                    <svg
                                      sidebar-toggle-item
                                      className={`w-6 h-6`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </button>
                                  <ul
                                    id={`dropdown-example${index}`}
                                    className="hidden py-2 space-y-2"
                                  >
                                    {link.dropList.map((drplist, indList) => {
                                      return drplist.name != "" ? (
                                        <li key={indList}>
                                          <Link to={drplist.to}>
                                            <a
                                              className={`fashionfont text-gray-400 hover:text-white flex items-center w-full p-2 transition duration-75 pl-11 group  dark:text-white text-[14.4px] ${currentUrl === drplist.to
                                                ? `font-semibold text-[#EC642A]`
                                                : "font-normal text-gray-400"
                                                }`}
                                            >
                                              {drplist.name}
                                            </a>
                                          </Link>
                                        </li>
                                      ) : (
                                        ""
                                      );
                                    })}
                                  </ul>
                                </>
                              ) : (
                                <Link to={link.to}>
                                  <a
                                    className={`fashionfont text-gray-400 hover:text-white flex text-[14.4px] items-center p-2 dark:text-whit dark:hover:bg-[#23527c] ${currentUrl === link.to
                                      ? `bg-[#1a4547] text-[#EC642A]`
                                      : "text-gray-400"
                                      }`}
                                  >
                                    {link.icon}
                                    <span className="ml-3 fashionfont">{link.name}</span>
                                  </a>
                                </Link>
                              )}
                            </li>
                          </>
                        );
                      })}
                    </>
                  );
                })}
              </ul>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default VendorSidebar;
