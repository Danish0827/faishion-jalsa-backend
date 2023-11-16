import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AdminUrl } from '../../constant'
import { Alert, Input, Modal, Radio, Space, Table, Tabs, message } from 'antd';
import { FcSearch } from 'react-icons/fc';
import { RiDeleteBin2Fill, RiEyeLine, RiPencilFill } from 'react-icons/ri';
import { FaArchive, FaBan, FaCheck, FaClock, FaTimes } from 'react-icons/fa';

const { TabPane } = Tabs
const VendorEnable = ({ adminLoginData }) => {
    const [vendors, setVendors] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [approveVendors, setapproveVendors] = useState([]);
    const [rejectedVendors, setrejectedVendors] = useState([]);
    const [archived, setarchived] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [approveTab, setapproveTab] = useState('1'); // Separate state for the second set of tabs
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedKey, setSelectedKey] = useState(null)
    const [status, setStatus] = useState('0');

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const getAlertType = (status) => {
        switch (status) {
            case '0':
                return 'info';
            case '3':
                return 'success';
            case '1':
            case '4':
                return 'error';
            case '2':
                return 'warning';
            default:
                return 'info';
        }
    };
    const callVendor = async () => {
        try {
            const response = await fetch(`${AdminUrl}/api/allVendors`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Handle successful response
                const data = await response.json();

                // Sort the filtered vendors by ID
                const sortedVendors = data.vendors.sort((a, b) => a.id - b.id);

                // Set the filtered and sorted vendors to the state
                setVendors(sortedVendors);

            } else {
                // Handle error response
                console.error('Error sending form data:', response.statusText);
            }
        } catch (error) {
            // Handle error
            console.error('Error sending form data:', error);
        }
    };

    useEffect(() => {
        callVendor()
    }, [])

    const approveVendorFromDb = vendors.filter((vendor) => vendor.status === 0);
    const rejectedVendorFromDb = vendors.filter((vendor) => vendor.status === 1);
    const archivedVendor = vendors.filter((vendor) => vendor.status === 2);

    const handleSearch = (selectedKeys, confirm, search) => {
        confirm();
        setSearchText(search)
        const filtered = vendors.filter((vendor) =>
            vendor?.brand_name?.toLowerCase()?.includes(selectedKeys[0]?.toLowerCase()) ||
            vendor?.company_name?.toLowerCase()?.includes(selectedKeys[0]?.toLowerCase())
        );
        setFilteredVendors(filtered);

        const approve = vendors.filter((vendor) =>
            vendor?.brand_name?.toLowerCase()?.includes(selectedKeys[0]?.toLowerCase()) && vendor.status == 3 ||
            vendor?.company_name?.toLowerCase()?.includes(selectedKeys[0]?.toLowerCase()) && vendor.status == 3
        );
        setapproveVendors(approve);

        const rejected = vendors.filter((vendor) =>
            vendor?.brand_name?.toLowerCase()?.includes(selectedKeys[0]?.toLowerCase()) && vendor.status == 4 ||
            vendor?.company_name?.toLowerCase()?.includes(selectedKeys[0]?.toLowerCase()) && vendor.status == 4
        );
        setrejectedVendors(rejected);

        const archived = vendors.filter((vendor) =>
            vendor?.brand_name?.toLowerCase()?.includes(selectedKeys[0]?.toLowerCase()) && vendor.status == 2 ||
            vendor?.company_name?.toLowerCase()?.includes(selectedKeys[0]?.toLowerCase()) && vendor.status == 2
        );
        setarchived(archived);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            width: 100
        },
        {
            title: 'Brand Name',
            dataIndex: 'brand_name',
            key: 'brand_name',
            width: 200
        },
        {
            title: 'Company Name',
            dataIndex: 'company_name',
            key: 'company_name',
            width: 200
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status - b.status,
            render: (status) => {
                let statusIcon, statusColor, statusName;

                if (status === 0) {
                    statusIcon = <FaClock />;
                    statusColor = "text-blue-500";
                    statusName = 'Pending'
                } else if (status === 1) {
                    statusIcon = <FaBan />;
                    statusColor = "text-rose-500";
                    statusName = 'Blocked'
                } else if (status === 2) {
                    statusIcon = <FaArchive />;
                    statusColor = "text-orange-500";
                    statusName = 'Archived'
                } else if (status === 3) {
                    statusIcon = <FaCheck />;
                    statusColor = "text-green-500";
                    statusName = 'Approved'
                } else if (status === 4) {
                    statusIcon = <FaTimes />;
                    statusColor = "text-red-500";
                    statusName = 'Rejected'
                }

                return (
                    <span className={`${statusColor} flex items-center`}>
                        {statusIcon} {statusIcon && ' '} {/* Add a space if an icon exists */}
                        <p className='ml-2'>{statusName}</p>
                    </span>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => (
                <Space size="middle" className='flex'>
                    <>
                        <RiDeleteBin2Fill
                            onClick={() => handleVendor(record.id)}
                            className="text-white  w-8 h-8 p-2 rounded-full bg-[#081831] border-none hover:bg-[#337ab7] hover:text-white "
                        />
                    </>
                </Space>
            ),
        },
    ];


    const handleVendor = (key) => {
        callVendor();
        const selectedRow = vendors.find(item => item.id === key);
        setModalVisible(true);
        setSelectedKey(key);
        setStatus(selectedRow?.status.toString())
    }

    const handleTab = (key) => {
        setapproveTab(key);
    };

    const cancelModal = () => {
        setModalVisible(false)
    }

    const handleEnable = () => {

        const updateVendorStatus = async () => {
            try {
                const res = await fetch(`${AdminUrl}/api/updateVendorApplicationStatus`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: selectedKey, approvalStatus: status
                    })
                })
                const data = await res.json();
                if (data.status === 200) {
                    message.success(data.message)
                    setModalVisible(false)
                } else {
                    message.error("Something Went Wrong")
                }
            } catch (error) {
                console.log(error)
            }
        }

        // Caling Del Category Function
        updateVendorStatus();
        callVendor()
    }

    const getStatusText = (status) => {
        switch (status) {
            case '0':
                return 'Pending';
            case '1':
                return 'Blocked';
            case '2':
                return 'Archived';
            case '3':
                return 'Approved';
            case '4':
                return 'Rejected';
            default:
                return '';
        }
    };
    return (
        <>
            {
                adminLoginData == null || adminLoginData?.length == 0 ? "" :
                    <div className="mx-auto p-5 mt-10 sm:ml-72 sm:p-4">
                        <h1 className='text-4xl text-gray-700 font-bold mb-2'>Vendor's Enable & Disable Application</h1>
                        <nav aria-label="Breadcrumbs" className="order-first flex text-sm font-semibold sm:space-x-2">
                            <NavLink to={`${AdminUrl}`}>
                                <a href="" className="hover:text-slate-600 hidden text-slate-500 sm:block" >Home</a>
                            </NavLink>

                            <div aria-hidden="true" className="hidden select-none text-slate-400 sm:block">/</div>
                            <p className="text-slate-500 hover:text-slate-600">Vendors</p>

                            <div aria-hidden="true" className="hidden select-none text-slate-400 sm:block">/</div>
                            <p className="text-slate-500 hover:text-slate-600">Enable & Disable Application</p>
                        </nav>

                        <div className="mb-4 mt-4 flex justify-end">
                            <Input
                                placeholder="Search Brand or Company Name"
                                value={searchText}
                                onChange={(e) => handleSearch([searchText], () => { }, e.target.value)}
                                // onPressEnter={() => handleSearch([searchText], () => { })}
                                style={{ width: 200 }}
                                prefix={<FcSearch />}
                                className='border border-gray-400'
                            />
                        </div>
                        <Tabs defaultActiveKey="1" activeKey={approveTab} onChange={handleTab} centered>
                            <TabPane tab="All" key="1">
                                <Table columns={columns}
                                    dataSource={searchText != '' ? filteredVendors : vendors}
                                    pagination={false}
                                    className="w-full mt-10"
                                    rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300" />
                            </TabPane>
                            <TabPane tab="Enabled Accounts" key="2">
                                <Table columns={columns}
                                    dataSource={searchText != '' ? approveVendors : approveVendorFromDb}
                                    pagination={false}
                                    className="w-full mt-10"
                                    rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300" />
                            </TabPane>
                            <TabPane tab="Blocked Accounts" key="3">
                                <Table columns={columns}
                                    dataSource={searchText != '' ? rejectedVendors : rejectedVendorFromDb}
                                    pagination={false}
                                    className="w-full mt-10"
                                    rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300" />
                            </TabPane>
                            <TabPane tab="Archived Accounts" key="4">
                                <Table columns={columns}
                                    dataSource={searchText != '' ? archived : archivedVendor}
                                    pagination={false}
                                    className="w-full mt-10"
                                    rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300" />
                            </TabPane>

                        </Tabs>

                        <Modal
                            title=""
                            visible={modalVisible}
                            onOk={handleEnable}
                            onCancel={cancelModal}
                            okText={'Confirm'}
                            okButtonProps={{ style: { background: '#081831' } }}
                        >
                            <div className="mt-4">
                                <Radio.Group onChange={handleStatusChange} value={status}>
                                    <Radio value="0" className="mb-2 font-semibold text-blue-600">
                                        Pending<br />
                                        <span className="text-xs text-gray-500 font-medium">Account is currently Pending and in use.</span>
                                    </Radio>
                                    <Radio value="1" className="mb-2 font-semibold text-rose-600">
                                        Blocked<br />
                                        <span className="text-xs text-gray-500 font-medium">Account has been blocked and cannot be accessed.</span>
                                    </Radio>
                                    <Radio value="2" className="mb-2 font-semibold text-orange-600">
                                        Archived<br />
                                        <span className="text-xs text-gray-500 font-medium">Account data is stored for historical purposes.</span>
                                    </Radio>
                                    <Radio value="3" className="mb-2 font-semibold text-green-600">
                                        Approved<br />
                                        <span className="text-xs text-gray-500 font-medium">Account has been approved and is ready to use.</span>
                                    </Radio>
                                    <Radio value="4" className="mb-2 font-semibold text-red-600">
                                        Rejected<br />
                                        <span className="text-xs text-gray-500 font-medium">Account request has been rejected and not allowed.</span>
                                    </Radio>
                                </Radio.Group>

                                <div className='mt-4 mb-10'>
                                    <Alert type={getAlertType(status)} message={`Are you sure you want to set the status to ${getStatusText(status)} `} banner />
                                </div>
                            </div>
                        </Modal>
                    </div>
            }
        </>
    )
}

export default VendorEnable