import React, { useState, useEffect } from 'react'
import { AdminUrl } from '../../constant'
import { NavLink, useNavigate } from 'react-router-dom'
import { Pagination, Space, Table, Tabs, Tooltip } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import { FiCheckCircle, FiClock } from 'react-icons/fi'
import moment from "moment";
import { RiEyeLine } from 'react-icons/ri'

const Support = ({ adminLoginData }) => {

    const [tickets, setTickets] = useState([])
    const [Loading, setLoading] = useState(false)
    const [imageUploadTab, setImageUploadTab] = useState("1")
    const [currentPage, setCurrentPage] = useState(1);
    const [customers, setCustomers] = useState([])

    const getTickets = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${AdminUrl}/api/getAllSupportTicketsAndMessages`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const { data } = await response.json()
                // Group the data by ticket_id
                const groupedTickets = data.reduce((result, item) => {
                    const ticketId = item.ticket_id;
                    if (!result[ticketId]) {
                        result[ticketId] = { ...item, messages: [] };
                    }
                    result[ticketId].messages.push({
                        message_id: item.message_id,
                        customer_id: item.customer_id,
                        message: item.message,
                        attachments: item.attachments,
                        timestamp: item.timestamp,
                    });
                    return result;
                }, {});

                // Sort the grouped tickets by timestamp in descending order
                const sortedTickets = Object.values(groupedTickets).sort((a, b) => {
                    return new Date(b.timestamp) - new Date(a.timestamp);
                });

                // Now, sortedTickets contains the data grouped by ticket_id and sorted by timestamp
                console.log(sortedTickets);
                setTickets(sortedTickets);
            } else {
                console.error("Error getting support ticket data:", response.statusText)
            }
        } catch (error) {
            console.error("Error getting support ticket data:", error)
        }
        setLoading(false)
    }

    useEffect(() => {
        getTickets()
    }, [])

    const callCustomers = async () => {
        try {
            const response = await fetch(`${AdminUrl}/api/allCustomers`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // Handle successful response
                const data = await response.json();
                setCustomers(data);
            } else {
                // Handle error response
                console.error("Error sending form data:", response.statusText);
            }
        } catch (error) {
            // Handle error
            console.error("Error sending form data:", error);
        }
    };

    useEffect(() => {
        callCustomers();
    }, []);

    const navigate = useNavigate();

    const handleTicket = (ticket) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        navigate('/Admin/Customers/viewTicket', { state: { ticket, customers } })
    }

    const columns = [
        {
            title: "Ticket ID",
            dataIndex: "ticket_id",
            key: "ticket_id",
            sorter: (a, b) => a.ticket_id - b.ticket_id
        },
        {
            title: "Subject",
            dataIndex: "subject",
            key: "subject",
            render: (subject) => (
                <Tooltip title={subject}>
                    <div
                        style={{
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontWeight: 500,
                        }}
                    >
                        {subject.length > 20 ? subject.substring(0, 20) + "..." : subject}
                    </div>
                </Tooltip>
            )
        },
        {
            title: "Customer",
            dataIndex: "customer_id",
            key: "customer_id",
            render: (customer_id) => {
                const customerdata = customers.find((customer) => customer.customer_id === customer_id)
                return `${customerdata?.given_name} ${customerdata?.family_name}`
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status - b.status,
            filters: [
                { text: "Open", value: "Open" },
                { text: "In Progress", value: "In Progress" },
                { text: "Closed", value: "Closed" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status, record) => {
                let icon, color;
                switch (status) {
                    case "Open":
                        icon = <FiClock className="text-red-500" />;
                        color = "text-red-500";
                        break;
                    case "In Progress":
                        icon = <FiCheckCircle className="text-blue-500" />;
                        color = "text-blue-500";
                        break;
                    case "Closed":
                        icon = <FiCheckCircle className="text-green-500" />;
                        color = "text-green-500";
                        break;
                    default:
                        icon = <FiClock className="text-gray-500" />;
                        color = "text-gray-500";
                }
                let content = (
                    <span className={`flex items-center ${color}`}>
                        {icon}
                        <span className="ml-1">{status}</span>
                    </span>
                );
                return content;
            },
            width: 150,
        },
        {
            title: "Created on",
            dataIndex: "timestamp",
            key: "timestamp",
            sorter: (a, b) =>
                moment(a.timestamp).unix() - moment(b.timestamp).unix(), // Custom sorting function
            render: (_, record) => (
                <p className="text-md font-semibold">
                    {moment(record.timestamp).format("MMMM D, YYYY hh:mm:ss A")}
                </p>
            ),
            sortDirections: ["descend", "ascend"],
            // defaultSortOrder: "ascend",
            // width: 150,
        },
        {
            title: "Last Updated on",
            dataIndex: "last_timestamp",
            key: "last_timestamp",
            sorter: (a, b) => {
                const lastMessageA = a.messages[a.messages.length - 1];
                const lastMessageB = b.messages[b.messages.length - 1];
                return moment(lastMessageA.timestamp).unix() - moment(lastMessageB.timestamp).unix();
            },
            render: (_, record) => {
                const lastMessage = record.messages[record.messages.length - 1];
                return (
                    <p className="text-md font-semibold">
                        {moment(lastMessage.timestamp).format("MMMM D, YYYY hh:mm:ss A")}
                    </p>
                );
            },
            sortDirections: ["descend", "ascend"],
            // defaultSortOrder: "ascend",
            // width: 150,
        },
        {
            title: "Actions",
            key: "actions",
            // width: 80,
            render: (record) => (
                <Space size="middle" className="flex">
                    <RiEyeLine
                        onClick={() => handleTicket(record)}
                        className="text-white  w-8 h-8 p-2 rounded-full bg-[#081831] border-none hover:bg-[#337ab7] hover:text-white "
                    />
                </Space>
            ),
        },
    ]

    const handleTabChangeforTable = (key) => {
        setImageUploadTab(key);
    };

    const pageSize = 10;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const allTickets = tickets.filter((ticket) => ticket);
    const openTickets = tickets.filter((ticket) => ticket.status === "Open");
    const inProgressTickets = tickets.filter((ticket) => ticket.status === "In Progress");
    const closedTickets = tickets.filter((ticket) => ticket.status === "Closed");

    return (
        <>
            {adminLoginData == null || adminLoginData?.length == 0 ? (
                ""
            ) : (
                <div className="mx-auto p-5 mt-10 sm:ml-72 sm:p-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="my-3">
                            <h1 className="text-4xl text-gray-700 font-bold mb-2">
                                Customer Support Tickets ({tickets?.length})
                            </h1>
                            <nav
                                aria-label="Breadcrumbs"
                                className="order-first flex text-sm font-semibold sm:space-x-2"
                            >
                                <NavLink to={`${AdminUrl}`}>
                                    <a
                                        href=""
                                        className="hover:text-slate-600 text-slate-500 sm:block"
                                    >
                                        Home
                                    </a>
                                </NavLink>

                                <div
                                    aria-hidden="true"
                                    className="select-none text-slate-400 sm:block"
                                >
                                    /
                                </div>
                                <p className="text-slate-500 hover:text-slate-600">
                                    Support Ticket
                                </p>
                            </nav>
                        </div>
                    </div>

                    {Loading ? (
                        "Table Loading"
                    ) : (
                        <>
                            <div className="table-responsive overflow-hidden overflow-x-auto mt-4 ">
                                <Tabs
                                    defaultActiveKey="1"
                                    activeKey={imageUploadTab}
                                    onChange={handleTabChangeforTable}
                                    centered
                                >
                                    <TabPane tab={`All (${allTickets?.length})`} key="1">
                                        <Table
                                            columns={columns}
                                            dataSource={allTickets?.slice(
                                                (currentPage - 1) * pageSize,
                                                currentPage * pageSize
                                            )}
                                            pagination={false}
                                            className="w-full mt-10"
                                            rowClassName="bg-white dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                                        />
                                        <div className="mt-4">
                                            <Pagination
                                                current={currentPage}
                                                onChange={handlePageChange}
                                                pageSize={pageSize}
                                                total={allTickets?.length}
                                            />
                                        </div>
                                    </TabPane>
                                    <TabPane tab={`Open (${openTickets?.length})`} key="2">
                                        <Table
                                            columns={columns}
                                            dataSource={openTickets?.slice(
                                                (currentPage - 1) * pageSize,
                                                currentPage * pageSize
                                            )}
                                            pagination={false}
                                            className="w-full mt-10"
                                            rowClassName="bg-white dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                                        />
                                        <div className="mt-4">
                                            <Pagination
                                                current={currentPage}
                                                onChange={handlePageChange}
                                                pageSize={pageSize}
                                                total={openTickets?.length}
                                            />
                                        </div>
                                    </TabPane>
                                    <TabPane tab={`In Progress (${inProgressTickets?.length})`} key="3">
                                        <Table
                                            columns={columns}
                                            dataSource={inProgressTickets?.slice(
                                                (currentPage - 1) * pageSize,
                                                currentPage * pageSize
                                            )}
                                            pagination={false}
                                            className="w-full mt-10"
                                            rowClassName="bg-white dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                                        />
                                        <div className="mt-4">
                                            <Pagination
                                                current={currentPage}
                                                onChange={handlePageChange}
                                                pageSize={pageSize}
                                                total={inProgressTickets?.length}
                                            />
                                        </div>
                                    </TabPane>
                                    <TabPane
                                        tab={`Closed (${closedTickets?.length})`}
                                        key="4"
                                    >
                                        <Table
                                            columns={columns}
                                            dataSource={closedTickets?.slice(
                                                (currentPage - 1) * pageSize,
                                                currentPage * pageSize
                                            )}
                                            pagination={false}
                                            className="w-full mt-10"
                                            rowClassName="bg-white dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                                        />
                                        <div className="mt-4">
                                            <Pagination
                                                current={currentPage}
                                                onChange={handlePageChange}
                                                pageSize={pageSize}
                                                total={closedTickets?.length}
                                            />
                                        </div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default Support