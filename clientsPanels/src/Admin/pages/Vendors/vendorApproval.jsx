import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AdminUrl } from '../../constant'
import { Input, Space, Table, Tabs } from 'antd';
import { FcSearch } from 'react-icons/fc';
import { RiEyeLine } from 'react-icons/ri';

const { TabPane } = Tabs
const VendorApproval = ({ adminLoginData }) => {
    const [vendors, setVendors] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [approveVendors, setapproveVendors] = useState([]);
    const [rejectedVendors, setrejectedVendors] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [approveTab, setapproveTab] = useState('1'); // Separate state for the second set of tabs

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

    const approveVendorFromDb = vendors.filter((vendor) => vendor.status === 3);
    const rejectedVendorFromDb = vendors.filter((vendor) => vendor.status === 4);

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
                // 0 - Account will be active by default 
                // 1 - Account has been Blocked by Admin
                // 2 - Account has been Archived by Admin for violating Terms & Condition
                let statusText = '';
                if (status === 0) {
                    statusText = <p className="text-blue-500">Active</p>;
                } else if (status === 1) {
                    statusText = <p className="text-rose-500">Blocked</p>;
                } else if (status === 2) {
                    statusText = <p className="text-orange-500">Archived</p>;
                }
                else if (status === 3) {
                    statusText = <p className="text-green-500">Application Approved</p>;
                }
                else if (status === 4) {
                    statusText = <p className="text-red-500">Application Rejected</p>;
                }
                return <span>{statusText}</span>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => (
                <Space size="middle" className='flex'>
                    <>
                        <RiEyeLine
                            onClick={() => handleVendor(record)}
                            className="text-white  w-8 h-8 p-2 rounded-full bg-[#081831] border-none hover:bg-[#337ab7] hover:text-white "
                        />
                    </>
                </Space>
            ),
        },
    ];

    const navigate = useNavigate();

    const handleVendor = (vendor) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate('/Admin/Vendors/viewDetails', { state: vendor })
    }

    const handleTab = (key) => {
        setapproveTab(key);
    };

    return (
        <>
            {
                adminLoginData == null || adminLoginData?.length == 0 ? '' :
                    <div className="mx-auto p-5 mt-10 sm:ml-72 sm:p-4">
                        <h1 className='text-4xl text-gray-700 font-bold mb-2'>Vendor's Approve & Reject Application</h1>
                        <nav aria-label="Breadcrumbs" className="order-first flex text-sm font-semibold sm:space-x-2">
                            <NavLink to={`${AdminUrl}`}>
                                <a href="" className="hover:text-slate-600 hidden text-slate-500 sm:block" >Home</a>
                            </NavLink>

                            <div aria-hidden="true" className="hidden select-none text-slate-400 sm:block">/</div>
                            <p className="text-slate-500 hover:text-slate-600">Vendors</p>

                            <div aria-hidden="true" className="hidden select-none text-slate-400 sm:block">/</div>
                            <p className="text-slate-500 hover:text-slate-600">Approve & Reject Application</p>
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
                            <TabPane tab="Approve Application" key="3">
                                <Table columns={columns}
                                    dataSource={searchText != '' ? approveVendors : approveVendorFromDb}
                                    pagination={false}
                                    className="w-full mt-10"
                                    rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300" />
                            </TabPane>
                            <TabPane tab="Reject Application" key="4">
                                <Table columns={columns}
                                    dataSource={searchText != '' ? rejectedVendors : rejectedVendorFromDb}
                                    pagination={false}
                                    className="w-full mt-10"
                                    rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300" />
                            </TabPane>

                        </Tabs>
                    </div>
            }
        </>
    )
}

export default VendorApproval