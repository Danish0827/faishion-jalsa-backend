import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { links } from '../constant/index';
import Swal from 'sweetalert2';

import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon, PhoneIcon } from '@heroicons/react/20/solid'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';

const AdminSidebar = ({ adminLoginData }) => {
    const [logoutmodal, setlogoutModal] = useState(false)
    const location = useLocation()
    const currentUrl = location.pathname
    const navigate = useNavigate()


    if (adminLoginData?.error) {
        let timerInterval
        Swal.fire({
            icon: 'error',
            title: 'Internal Server Error',
            html: 'Something went wrong on the server side.<br /> <p> Redirecting to Login in  <b></b></p>',
            timer: 5000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const b = Swal.getHtmlContainer().querySelector('b');
                timerInterval = setInterval(() => {
                    const timerLeftInSeconds = Math.ceil(Swal.getTimerLeft() / 1000);
                    b.textContent = timerLeftInSeconds;
                    window.location.href = "/Admin/Login"
                }, 1000);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer');
            }
        });

    }
    const [dropdown, setDropdown] = useState(false);

    const handleDropdown = (drpIndex) => {
        setDropdown(!dropdown)
        if (dropdown) {
            document.getElementById(drpIndex).classList.remove('hidden')
        } else {
            document.getElementById(drpIndex).classList.add('hidden')
        }
    }

    const solutions = [
        { name: 'Profile', description: 'Manage your superadmin profile', href: '/Admin/Profile', icon: UserCircleIcon },
        // { name: 'Settings', description: "Manage your default Settings", href: '#', icon: FiSettings },
        { name: 'Logout', description: "Logout from your account", href: '/Admin/Logout', icon: FiLogOut },
        // { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
    ]
    // const callsToAction = [
    //     { name: 'Logout', href: '/Admin/Logout', icon: FiLogOut },
    //     { name: 'Contact', href: 'tel:9167263576', icon: PhoneIcon },
    // ]

    const handleLogout = () => {
        setlogoutModal(true)
    }

    const onCancel = () => {
        setlogoutModal(false)
    }

    const onOk = () => {
        // Remove the "adminData" cookie
        const cookieRemoved = Cookies.remove('adminData');

        if (cookieRemoved === undefined) {
            // Cookie was successfully removed
            let timerInterval
            Swal.fire({
                icon: 'success',
                title: 'Logged Out Successfully!',
                showConfirmButton: false,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()
                    timerInterval = setInterval(() => {
                        window.location.href = '/Admin/Login'
                    }, 1500)
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            });
            // Perform any additional logout logic here if needed
            // Redirect to the login page or perform any other actions after logout
            // For example, if you are using React Router for navigation:
            // history.push('/login');
        } else {
            // Error in removing the cookie
            Swal.fire({
                icon: 'error',
                title: 'Failed to Log Out',
                text: 'An error occurred while logging out. Please try again later.',
            });
        }
    };


    useEffect(() => {
        const adminLinks = adminLoginData?.length > 0
            ? links.flatMap((item) =>
                item.links
                    .filter((link) => adminLoginData[0].role_id.includes(link.id))
                    .flatMap((filteredLink) => {
                        if (filteredLink.to) {
                            // If 'filteredLink' has a 'to' property, return the 'to' value directly
                            return [filteredLink.to];
                        } else if (filteredLink.dropList) {
                            // If 'filteredLink' has a 'dropList' property, map it to get the 'to' values and return as a single array
                            return filteredLink.dropList.map((drplist) => drplist.to);
                        }
                        return []; // Return an empty array for cases where 'filteredLink' has neither 'to' nor 'dropList'
                    })
                    .filter((toValue) => toValue !== null && toValue !== "" && toValue !== undefined)
            )
            : []; // If adminLoginData is not available, keep the original links array


        const isProfileUrl = currentUrl === "/Admin/Profile";
        if (adminLinks.length > 0 && !adminLinks.includes(currentUrl) && !isProfileUrl) {
            navigate('/Admin/404');
        }

    }, [adminLoginData, currentUrl]);

    return (
        <>
            {
                adminLoginData == null || adminLoginData?.length == 0 ?
                    <aside id="sidebar-multi-level-sidebar" className="fixed top-0 left-0 z-[999] h-screen transition-transform w-72 -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                        <div className="h-full px-3 py-4 overflow-y-auto bg-[#081831] dark:bg-[#081831]">
                            <div className="flex mb-3 justify-center">
                                <div className="h-32 w-32 bg-[#081831] animate-pulse" />
                            </div>
                            <hr />
                            <ul className="space-y-2 font-medium">
                                <li className="animate-pulse">
                                    <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white bg-[#081831] dark:bg-[#081831]" style={{ height: '2rem' }} />
                                </li>
                                <li className="animate-pulse">
                                    <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white bg-[#081831] dark:bg-[#081831]" style={{ height: '2rem' }} />
                                </li>
                                <li className="animate-pulse">
                                    <div className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-[#081831] dark:text-white dark:hover:bg-[#081831]" style={{ height: '2rem' }}>
                                        <div className="mr-3 bg-[#081831] dark:bg-[#081831] rounded-full" style={{ width: '1.5rem', height: '1.5rem' }} />
                                        <div className="flex-1 text-left whitespace-nowrap line-clamp-1 bg-[#081831] dark:bg-[#081831] rounded-full" style={{ height: '1rem' }} />
                                        <div className="w-6 h-6 bg-[#081831] dark:bg-[#081831] rounded-full" />
                                    </div>
                                </li>
                                <li className="animate-pulse">
                                    <div className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-[#081831] dark:text-white dark:hover:bg-[#081831]" style={{ height: '2rem' }}>
                                        <div className="mr-3 bg-[#081831] dark:bg-[#081831] rounded-full" style={{ width: '1.5rem', height: '1.5rem' }} />
                                        <div className="flex-1 text-left whitespace-nowrap line-clamp-1 bg-[#081831] dark:bg-[#081831] rounded-full" style={{ height: '1rem' }} />
                                        <div className="w-6 h-6 bg-[#081831] dark:bg-[#081831] rounded-full" />
                                    </div>
                                </li>
                                <li className="animate-pulse">
                                    <div className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-[#081831] dark:text-white dark:hover:bg-[#081831]" style={{ height: '2rem' }}>
                                        <div className="mr-3 bg-[#081831] dark:bg-[#081831] rounded-full" style={{ width: '1.5rem', height: '1.5rem' }} />
                                        <div className="flex-1 text-left whitespace-nowrap line-clamp-1 bg-[#081831] dark:bg-[#081831] rounded-full" style={{ height: '1rem' }} />
                                        <div className="w-6 h-6 bg-[#081831] dark:bg-[#081831] rounded-full" />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </aside> :
                    <>
                        <div className='flex bg-white'>
                            <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-[#081831] focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-[#081831] dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>

                            <header className='md:ml-72 flex justify-between items-center w-full p-4 z-[999]'>
                                <div className="py-1 ">
                                    <h2 className="text-xl font-semibold mb-1">Welcome, {adminLoginData[0].name}!</h2>
                                    <p className="text-sm">You are logged in as an {adminLoginData[0]?.position} user.</p>
                                </div>
                                <Popover className="relative">
                                    <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                                        <Avatar shape="square" size={32} className='flex justify-center items-center mr-2 bg-[#081831]' icon={<UserOutlined />} />
                                        <span>{adminLoginData[0]?.email}</span>
                                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                    </Popover.Button>

                                    <Transition
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute right-0 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ">
                                            <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                <div className="p-4">
                                                    {solutions.map((item) => (
                                                        <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-100">
                                                            <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                                <item.icon className="h-6 w-6 text-gray-600 group-hover:text-[#081831]" aria-hidden="true" />
                                                            </div>
                                                            <div>
                                                                {item.name == 'Logout' ? (
                                                                    <a
                                                                        key={item.name}
                                                                        href={item.name == 'Logout' ? 'javascript:void(0)' : item.href}
                                                                        onClick={item.name == 'Logout' ? () => handleLogout() : () => ''}
                                                                        className="font-semibold text-gray-900"
                                                                    >
                                                                        {item.name}
                                                                        <p className="mt-1 text-gray-600">{item.description}</p>
                                                                    </a>
                                                                ) : (
                                                                    <>
                                                                        <Link to={item.href} >
                                                                            <a className="font-semibold text-gray-900">
                                                                                {item.name}
                                                                                <span className="absolute inset-0" />
                                                                            </a>
                                                                        </Link>
                                                                        <p className="mt-1 text-gray-600">{item.description}</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                                                    {callsToAction.map((item) => (
                                                        <a
                                                            key={item.name}
                                                            href={item.name == 'Logout' ? 'javascript:void(0)' : item.href}
                                                            onClick={item.name == 'Logout' ? () => handleLogout() : () => ''}
                                                            className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                                        >
                                                            <item.icon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                                                            {item.name}
                                                        </a>
                                                    ))}
                                                </div> */}
                                            </div>
                                        </Popover.Panel>
                                    </Transition>
                                </Popover>
                            </header>
                        </div>

                        <aside id="sidebar-multi-level-sidebar" className="fixed top-0 left-0 z-[999] w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                            <div className="h-full px-3 py-4 overflow-y-auto bg-[#081831] dark:bg-[#081831]">
                                <div className='flex mt-5 mb-8 justify-center items-center gap-2'>
                                    <img className='h-14' src="/logo.png" alt="" />
                                    {/* <h1 className='text-white text-2xl font-bold'>Jalsa</h1> */}
                                </div>
                                {/* <hr /> */}

                                <ul className="space-y-2 font-medium">
                                    {links.map((item, index) => {
                                        return (
                                            <>
                                                {/* <h1 key={index} className="mt-5 text-white">{item.title}</h1> */}
                                                <h1 key={index}></h1>
                                                {item.links.map((link, index) => {
                                                    const showLink = adminLoginData[0].role_id?.includes(link.id);
                                                    return (
                                                        <>
                                                            {showLink && (
                                                                <li key={index}>
                                                                    {link.dropdown ? (
                                                                        <>
                                                                            <button
                                                                                type="button"
                                                                                className={`flex items-center w-full p-2 text-white transition duration-75 rounded-lg group dark:text-white dark:hover:bg-[#23527c] ${currentUrl.includes(link.start) && 'bg-[#23527c]'} `}
                                                                                onClick={() => handleDropdown(`dropdown-example${index}`)}
                                                                                aria-controls={`dropdown-example${index}`}
                                                                                data-collapse-toggle={`dropdown-example${index}`}
                                                                            >
                                                                                {link.icon}
                                                                                <span className="flex-1 ml-3 text-left whitespace-nowrap line-clamp-1" sidebar-toggle-item>
                                                                                    {link.name}
                                                                                </span>
                                                                                <svg sidebar-toggle-item className={`w-6 h-6`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                                                </svg>
                                                                            </button>
                                                                            <ul id={`dropdown-example${index}`} className={`${currentUrl === link.to ? '' : 'hidden'} py-2 space-y-2`}>
                                                                                {link.dropList.map((drplist, indList) => {
                                                                                    return drplist.name != '' ? (
                                                                                        <li key={indList}>
                                                                                            <Link to={drplist.to}>
                                                                                                <a className={`flex items-center w-full p-2 transition duration-75 rounded-lg pl-9 group dark:text-white dark:hover:bg-[#23527c] text-sm ${currentUrl === drplist.to ? `font-semibold text-white` : 'font-normal text-gray-100'}`}>{drplist.name}</a>
                                                                                            </Link>
                                                                                        </li>
                                                                                    ) : '';
                                                                                })}
                                                                            </ul>
                                                                        </>
                                                                    ) : (


                                                                        <Link to={link.to}>
                                                                            <a className={`flex items-center p-2 text-white dark:hover:text-gray-300 font-semibold  ${currentUrl === link.to ? `bg-[#23527c] text-white` : 'font-normal text-gray-700'}`}>
                                                                                {link.icon}
                                                                                <span className="ml-3">{link.name}</span>
                                                                            </a>
                                                                        </Link>
                                                                    )}
                                                                </li>
                                                            )}
                                                        </>
                                                    );
                                                })}

                                            </>
                                        );
                                    })}
                                </ul>


                            </div>
                        </aside>

                        <Modal
                            visible={logoutmodal}
                            title="Logout Confirmation"
                            icon={<ExclamationCircleOutlined />}
                            onCancel={onCancel}
                            footer={[
                                <Button key="cancel" onClick={onCancel}>
                                    Cancel
                                </Button>,
                                <Button key="logout" type="primary" danger onClick={onOk}>
                                    Logout
                                </Button>,
                            ]}
                        >
                            <p>Are you sure you want to logout?</p>
                        </Modal>
                    </>
            }
        </>
    )
}

export default AdminSidebar