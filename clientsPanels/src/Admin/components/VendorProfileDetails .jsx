import { Descriptions, Avatar, Table, Button } from 'antd';
import {
    AiOutlineUser,
} from 'react-icons/ai';
import { FiCheckCircle, FiClock, FiTrash2, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { AdminUrl } from '../constant';


const VendorProfileDetails = ({ vendor }) => {
    const vendorProductData = vendor.rejectedProducts.filter(rp => rp.vendor_id === vendor.id);
    const navigate = useNavigate()

    const statusMappings = {
        0: { icon: <FiClock />, color: 'orange', label: 'Pending' }, // Pending
        1: { icon: <FiCheckCircle />, color: 'green', label: 'Approved' }, // Approved
        2: { icon: <FiXCircle />, color: 'red', label: 'Rejected' }, // Rejected
        3: { icon: <FiCheckCircle />, color: 'blue', label: 'Active' }, // Active
        4: { icon: <FiTrash2 />, color: 'rose', label: 'Blocked' }, // Blocked
    };

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            width: 350,
            render: (_, record) => {
                let description = record.description;
                let words = description?.split(' ');

                if (description?.length <= 10) {
                    return (
                        <>
                            <p className='text-lg font-semibold text-justify'>{record.product_name}</p>
                            <p className='text-sm text-gray-400 text-justify'>{description}</p>
                        </>
                    );
                } else {
                    let shortDescription = words?.slice(0, 10)?.join(' ');
                    return (
                        <>
                            <p className='text-lg font-semibold text-justify'>{record.product_name}</p>
                            <p className='text-sm text-gray-400 text-justify'>{shortDescription}... <span className='text-[12px] cursor-pointer text-blue-500' type onClick={() => openModal(description)}>Read More</span></p>

                        </>
                    );
                }
            },
        },
        {
            title: 'Status',
            dataIndex: 'product_status',
            key: 'product_status',
            render: product_status => {
                const statusInfo = statusMappings[product_status] || {};
                const { icon, color } = statusInfo;
                console.log(statusInfo);
                return (
                    <span className={`flex justify-center items-center space-x-1 text-${color}-500`}>
                        {icon} <span>{statusInfo.label}</span>
                    </span>
                );
            },
            filters: [
                { text: 'Pending', value: 0 },
                { text: 'Approved', value: 1 },
                { text: 'Rejected', value: 2 },
                // { text: 'Active', value: 3 },
                // { text: 'Blocked', value: 4 },
                // ... Add more filter options if needed
            ],
            onFilter: (value, record) => record.product_status === value,
            sorter: (a, b) => a.product_status - b.product_status,
            width: 150,
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: created_at => {
                const formattedDate = new Date(created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true,
                });
                return formattedDate;
            },
        },
    ]

    const handleVendor = (vendor) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Open the link in a new tab using navigate
        navigate('/Admin/Vendors/viewDetails', { state: { ...vendor } });
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 ml-1 text-[#081831]">Vendor Profile </h2>
            <Descriptions layout="vertical" bordered className='font-semibold rounded-md'>
                <Descriptions.Item
                    label="Vendor Name"
                >
                    {vendor?.vendor_profile_picture_url ? (
                        <img
                            src={`${AdminUrl}/uploads/vendorProfile/${vendor?.vendor_profile_picture_url?.images?.[0]}`}
                            alt="Vendor Profile"
                            style={{ width: '64px', height: '64px', borderRadius: '50%' }}
                        />
                    ) : (
                        <Avatar size={64} icon={<AiOutlineUser />} className='flex justify-center items-center flex-row' />
                    )}
                    <p className='mt-2'>{vendor.vendorname} (VID: {vendor.id})</p>
                </Descriptions.Item>
                <Descriptions.Item
                    label="Created At"
                >
                    {vendor.registration_date}
                </Descriptions.Item>
                <Descriptions.Item
                    label="Email"
                >
                    {vendor.email || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item
                    label="Mobile Number"
                >
                    {vendor.mobile_number || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item
                    label="Business Model"
                >
                    {vendor.business_model || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item
                    label="Brand Name"
                >
                    {vendor.brand_name || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item
                    label="Company Name"
                >
                    {vendor.company_name || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item
                    label="Company Address"
                >
                    {vendor.company_address || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item
                    label="Bank Name"
                >
                    {vendor.bank_name || 'N/A'}
                </Descriptions.Item>
                {/* Add more items as needed */}
            </Descriptions>

            <h2 className="text-xl font-semibold mt-6 mb-4 ml-2 text-[#081831]">All Products ({vendorProductData[0]?.products?.length})</h2>
            <Table
                columns={columns}
                dataSource={vendorProductData[0]?.products || []}
                pagination={false}
                className='border-2 rounded-md'
            />

            <Button type="link" className='mt-4 flex justify-end self-end w-full hover:text-[#081831]' onClick={() => handleVendor(vendor)}>
                View Vendor Full Details
            </Button>
        </div>
    );
};

export default VendorProfileDetails;
