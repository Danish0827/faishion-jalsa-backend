import React, { useEffect, useState } from 'react'
import { AdminUrl } from '../constant'
import { Button, Modal, Table, Tooltip } from 'antd'
import moment from 'moment'
import { NavLink } from 'react-router-dom'

const EnquiryForms = ({ adminLoginData }) => {
    const [contacts, setContacts] = useState([])
    const [Loading, setLoading] = useState(false)
    const [showFullMessage, setShowFullMessage] = useState(false);
    const [Message, setMessage] = useState('');

    const handleModal = (message) => {
        setShowFullMessage(true)
        setMessage(message)
    }
    const closeModal = () => {
        setShowFullMessage(false)
        setMessage('')
    }

    const getContacts = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${AdminUrl}/api/getAllContacts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const data = await response.json()
                setContacts(data)
            } else {
                console.error("Error getting support ticket data:", response.statusText)
            }
        } catch (error) {
            console.error("Error getting support ticket data:", error)
        }
        setLoading(false)
    }

    useEffect(() => {
        getContacts()
    }, [])


    const columns = [
        {
            title: "ID",
            dataIndex: "contact_id",
            key: "contact_id",
            sorter: (a, b) => a.contact_id - b.contact_id
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email"
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
            title: "Message",
            dataIndex: "message",
            key: "message",
            render: (message) => {

                if (!message) {
                    return <span style={{ color: 'red' }}>No Message</span>;
                }

                return (
                    <div>
                        {message.slice(0, 20)}...
                        <Button
                            type="link"
                            size="small"
                            onClick={() => handleModal(message)}
                        >
                            Read More
                        </Button>
                    </div>
                );
            },
        },
        {
            title: "Date",
            dataIndex: "timestamp",
            key: "timestamp",
            sorter: (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix(),
            render: (timestamp) => (
                <p className="text-md">
                    {moment(timestamp).format("MMMM D, YYYY hh:mm:ss A")}
                </p>
            ),
            sortDirections: ["descend", "ascend"],
            defaultSortOrder: "descend"
        }
    ]

    return (
        <>
            {adminLoginData == null || adminLoginData?.length == 0 ? (
                ""
            ) : (
                <div className="mx-auto p-5 mt-10 sm:ml-72 sm:p-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="my-3">
                            <h1 className="text-4xl text-gray-700 font-bold mb-2">
                                Enquiry Forms ({contacts?.length})
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
                                    Enquiry Forms
                                </p>
                            </nav>
                        </div>
                    </div>

                    {Loading ? (
                        "Table Loading"
                    ) : (
                        <>
                            <div className="table-responsive overflow-hidden overflow-x-auto mt-4 ">
                                <Table
                                    columns={columns}
                                    dataSource={contacts}
                                    pagination={false}
                                    className="w-full mt-10"
                                    rowClassName="bg-white dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300"
                                />
                            </div>

                            <Modal
                                title={`Message`}
                                visible={showFullMessage}
                                onCancel={closeModal}
                                onOk={'handleModalOk'}
                                cancelText="Cancel"
                                okButtonProps={{
                                    className: 'hidden',
                                }}
                            >
                                {Message}
                            </Modal>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default EnquiryForms