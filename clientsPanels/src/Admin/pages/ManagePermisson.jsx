import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Checkbox, message, Pagination, Select, Space } from 'antd';
import { NavLink } from 'react-router-dom';
import { AdminUrl, links } from '../constant';
import { FiCheckSquare, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ManagePermission = ({ adminLoginData }) => {
    const [form] = Form.useForm();
    const { Option } = Select;

    const [selectedKey, setSelectedKey] = useState(null);
    const [Loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [staff, setStaff] = useState([]);

    // State to handle the visibility of the modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleRole, setModalVisibleRole] = useState(false);
    const [DeletemodalVisibleRole, setDeleteModalVisibleRole] = useState(false);
    const [DeleteRow, setDeleteRow] = useState([]);
    // State to store the roles to be displayed in the modal
    const [selectedLinkIds, setSelectedLinkIds] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedRoles, setselectedRoles] = useState([]);
    const [prevSelectedLinkIds, setPrevSelectedLinkIds] = useState([]);



    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 },
        },
    };

    const callAdminsForStaff = async () => {
        try {
            const response = await fetch(`${AdminUrl}/api/allStaff`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Handle successful response
                const data = await response.json();
                const exceptAdmin = data.filter((item) => item.email != 'admin@gmail.com')
                const sortedStaff = exceptAdmin.sort((a, b) => a.id - b.id);
                setStaff(data);
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
        callAdminsForStaff();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Roles',
            dataIndex: 'id',
            key: 'id',
            render: (record) => (
                <Button onClick={() => handleViewRoles(record)}>View Roles </Button>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => (
                <Space size="middle" className="flex">
                    {/* Edit Icon */}
                    <FiEdit2
                        onClick={() => handleUpdate(record.id)}
                        className="text-white w-8 h-8 p-2 rounded-full bg-green-600 border-none hover:bg-green-600 hover:text-white"
                    />

                    {/* Delete Icon */}
                    <FiTrash2
                        onClick={() => handleDelete(record.id)}
                        className="text-white w-8 h-8 p-2 rounded-full bg-red-600 border-none hover:bg-red-600 hover:text-white"
                    />
                </Space>
            ),
        },
    ];

    // Function to handle opening the modal and setting the roles for the modal
    function handleViewRoles(key) {
        callAdminsForStaff();
        const selectedRow = staff.find((item) => item.id === key);
        form.setFieldsValue(selectedRow);
        setselectedRoles(selectedRow?.role_id);
        setModalVisibleRole(true);
    }

    const pageSize = 10;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    function handleCreate() {
        form.resetFields();
        setSelectedKey(null);
        setSelectedPosition('');
        // Set selectedRoles and selectedLinkIds to empty arrays if they are empty
        setselectedRoles((prev) => []);
        setSelectedLinkIds((prev) => []);
        setModalVisible(true);
    }

    function handleDelete(key) {
        console.log(key);
        setSelectedKey(key)
        const selectedRow = staff.find((item) => item.id === key);
        setDeleteRow(selectedRow)
        setDeleteModalVisibleRole(true)
    }

    function onCancel() {
        setSelectedKey(null)
        setDeleteModalVisibleRole(false)
    }

    const onDelete = async (selectedKey, name, email, position) => {
        try {
            // Send the request to the backend using fetch
            const response = await fetch(`${AdminUrl}/api/deleteSellerAdmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedKey, name, email, position }),
            });

            if (!response.ok) {
                // Handle error response from the server if needed
                const errorText = await response.text();
                throw new Error(`Failed to update roles. Server responded with status ${response.status}: ${errorText}`);
            } else {
                if (response.ok) {
                    // Show a success Swal popup
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'The item has been deleted.',
                    });
                    setDeleteModalVisibleRole(false)
                    setStaff(staff.filter(item => item.id != selectedKey))
                } else {
                    // Show an error Swal popup if the response status is not ok
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || 'Failed to delete the item.',
                    });
                }
            }
        } catch (error) {
            // Show an error Swal popup if there's an error making the request
            console.error('Error during onDelete:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete the item.',
            });
        }
    };



    function handleUpdate(key) {
        callAdminsForStaff();
        const selectedRow = staff.find((item) => item.id === key);
        form.setFieldsValue(selectedRow);
        setSelectedKey(key);
        setSelectedPosition(selectedRow?.position);
        setselectedRoles(selectedRow?.role_id);
        setSelectedLinkIds(selectedRow?.role_id);
        setModalVisible(true);
    }

    const handleLinkChange = (e, droplist) => {
        const linkId = e.target.value;
        const isChecked = e.target.checked;

        setPrevSelectedLinkIds((prev) => [...prev]);

        setSelectedLinkIds((prev) => {
            if (isChecked) {
                return [...prev, linkId];
            } else {
                return prev.filter((id) => id !== linkId);
            }
        });
    };

    const handleSaveRoles = async (values) => {
        if (selectedKey == null) {
            // Add Staff Details to Superadmin Table and set Positon as Staff 
            try {
                const response = await fetch(`${AdminUrl}/api/addStaffDetailstoAdmin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ selectedLinkIds, selectedPosition, values }),
                });

                if (!response.ok) {
                    // Handle error response from the server if needed
                    throw new Error('Failed to update roles');
                } else {
                    const data = await response.json();
                    if (data?.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Admin Added Successfully',
                        });
                        setModalVisible(false);
                    } else if (data?.status === 409) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Admin Already Exists',
                        });
                        setModalVisible(false);
                    }
                }
            } catch (error) {
                // Handle any other errors
                console.error(error);
            }
        } else {
            try {
                const response = await fetch(`${AdminUrl}/api/updateSuperAdminRoles`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ selectedKey, selectedLinkIds, selectedPosition, values }),
                });

                if (!response.ok) {
                    // Handle error response from the server if needed
                    throw new Error('Failed to update roles');
                } else {
                    const data = await response.json();
                    if (data?.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Roles Assigned Successfully',
                        });
                        setModalVisible(false);
                    }
                }
            } catch (error) {
                // Handle any other errors
                console.error(error);
            }
        }
        callAdminsForStaff();
    };

    const handlePositionChange = (value) => {
        setSelectedPosition(value);
    };

    return (
        <>
            {
                adminLoginData == null || adminLoginData?.length == 0 ? "" :
                    <div className="mx-auto p-5 mt-10 sm:ml-72 sm:p-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="my-5">
                                <h1 className='text-4xl text-gray-700 font-bold mb-2'>Manage Role's and Permissons</h1>
                                <nav aria-label="Breadcrumbs" className="order-first flex text-sm font-semibold sm:space-x-2">
                                    <NavLink to={`${AdminUrl}`}>
                                        <a href="" className="hover:text-slate-600 hidden text-slate-500 sm:block" >Home</a>
                                    </NavLink>

                                    <div aria-hidden="true" className="hidden select-none text-slate-400 sm:block">/</div>
                                    <p className="text-slate-500 hover:text-slate-600">Manage Role's and Permissons</p>
                                </nav>
                            </div>
                            <div className="my-5">
                                <button onClick={handleCreate} className="bg-[#0391d1] hover:bg-[#0391d1]/80 text-white rounded-full p-3 px-5">
                                    {/* <svg
                                            className="w-10 h-10 "
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg> */}
                                    Add New Role
                                </button>
                            </div>
                        </div>

                        {
                            Loading ? "Table Loading" :
                                <>
                                    <Table columns={columns}
                                        dataSource={staff?.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                                        pagination={false}
                                        className="w-full mt-10"
                                        rowClassName="dark:bg-secondary-dark-bg no-hover text-gray-600 dark:text-gray-200 hover:text-slate-800 dark:hover:text-slate-800 rounded-none border-b-2 border-zinc-300" />
                                    <div className="mt-4">
                                        <Pagination
                                            current={currentPage}
                                            onChange={handlePageChange}
                                            pageSize={pageSize}
                                            total={staff?.length}
                                        />
                                    </div>
                                    <Modal
                                        title={selectedKey === null ? "Create Staff" : "Update Staff"}
                                        visible={modalVisible}
                                        onCancel={() => {
                                            setselectedRoles([])
                                            setSelectedLinkIds([])
                                            setModalVisible(false)
                                        }}
                                        okText={selectedKey === null ? "Create" : "Update"}
                                        width={800}
                                        footer={null}
                                    >
                                        <Form {...formItemLayout} form={form} onFinish={handleSaveRoles}>
                                            {/* Email Input */}
                                            <Form.Item label="Name" name="name">
                                                <Input placeholder="Enter Name" />
                                            </Form.Item>

                                            <Form.Item label="Email" name="email">
                                                <Input placeholder="Enter Email" />
                                            </Form.Item>

                                            {selectedKey === null ? (
                                                <Form.Item label="Password" name="password"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please enter a password!',
                                                        },
                                                        {
                                                            type: 'password',
                                                            message: 'Please enter a valid password!',
                                                        },
                                                        {
                                                            min: 8, // Minimum password length
                                                            message: "Password must be at least 8 characters long",
                                                        },
                                                        {
                                                            pattern:
                                                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                                                            message:
                                                                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                                                        },
                                                    ]}>
                                                    <Input.Password placeholder="Enter Password" />
                                                </Form.Item>) : (<></>)
                                            }

                                            {/* Roles Checkbox */}
                                            <Form.Item label="Roles" name="roles">

                                                <div className='grid grid-cols-2'>
                                                    {links?.flatMap((item, i) =>
                                                        item.links.map((link, index) => (
                                                            <Checkbox key={link.id} value={link.id} className='mb-4' onChange={(e) => handleLinkChange(e, link.dropList)}
                                                                checked={selectedLinkIds.length === 0 ? false : selectedLinkIds?.includes(link.id)}
                                                            >
                                                                {link.name}
                                                            </Checkbox>
                                                        ))
                                                    )}
                                                </div>

                                            </Form.Item>

                                            <Form.Item label="Position" name="position">
                                                <Select onChange={handlePositionChange} value={selectedPosition} style={{ width: '100%' }}>
                                                    <Option value="Admin">Admin</Option>
                                                    <Option value="Staff">Staff</Option>
                                                    {/* Add more positions as needed */}
                                                </Select>
                                            </Form.Item>
                                            <div className="flex justify-end">
                                                <Button type="button" htmlType="submit" className='bg-[#081831] text-white'>{selectedKey === null ? "Create" : "Update"} Role</Button>
                                            </div>
                                        </Form>
                                    </Modal>

                                    <Modal
                                        title="Roles"
                                        visible={modalVisibleRole}
                                        onCancel={() => {
                                            setModalVisibleRole(false)

                                        }}
                                        footer={null}
                                    >
                                        {selectedRoles?.map((item) => (
                                            links[0].links[item - 1]?.name && (
                                                <div
                                                    key={item}
                                                    className="flex items-center py-2 p-2 group hover:bg-gray-100 transition-colors duration-200 rounded-md cursor-pointer"
                                                >
                                                    <FiCheckSquare className='text-green-600' />
                                                    <span className="ml-2 text-gray-800 group-hover:text-green-600">
                                                        {links[0].links[item - 1]?.name}
                                                    </span>
                                                </div>
                                            )
                                        ))}
                                    </Modal>

                                    <Modal
                                        title="Confirm Delete"
                                        visible={DeletemodalVisibleRole}
                                        onCancel={onCancel}
                                        footer={[
                                            <Button key="cancel" onClick={onCancel}>
                                                Cancel
                                            </Button>,
                                            <Button key="delete" type="primary" danger onClick={() => onDelete(selectedKey, DeleteRow?.name, DeleteRow?.email, DeleteRow?.position)}>
                                                Delete
                                            </Button>,
                                        ]}
                                    >
                                        <p>Are you sure you want to delete this <b>{`${DeleteRow?.email} (${DeleteRow?.position})`} </b>?</p>
                                    </Modal>

                                </>
                        }
                    </div>
            }
        </>
    );
};

export default ManagePermission;
