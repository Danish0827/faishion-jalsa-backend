import React, { useState, useEffect } from 'react'
import { FcCancel } from 'react-icons/fc';
import { FiArrowLeft, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AdminUrl } from '../../constant';
import { Image, Modal } from 'antd';
import { Button, Text } from '@tremor/react';
import Swal from 'sweetalert2';

const ViewDetails = ({ adminLoginData }) => {
    // State to control the modal visibility
    const [isModalVisible, setIsModalVisible] = useState(false);
    // State to store the image source for the modal
    const [modalImageSrc, setModalImageSrc] = useState('');
    const location = useLocation()
    const navigate = useNavigate()
    const vendorData = location.state;
    const [isModalVisibleNew, setisModalVisibleNew] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState('');
    const id = vendorData.id;
    const handleApprove = () => {
        setisModalVisibleNew(true);
        setApprovalStatus(3);
    };

    const handleReject = () => {
        setisModalVisibleNew(true);
        setApprovalStatus(4);
    };

    const handleModalCancel = () => {
        setisModalVisibleNew(false);
    };

    const handleModalOk = async () => {
        try {
            // Call your backend API to send the approvalStatus
            // Replace 'your-backend-endpoint' with the actual URL of your backend API
            const response = await fetch(`${AdminUrl}/api/updateVendorApplicationStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, approvalStatus }),
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Vendor Application Status Changed Sucessfully',
                });
            } else {
                console.error('Failed to send approval status to the backend.');
            }

            // Close the modal
            setisModalVisibleNew(false);
        } catch (error) {
            console.error('An error occurred while sending the approval status:', error);
        }
    };


    // console.log(vendordata);
    const displayValueOrDash = (value) => (value !== null ? value : '-');

    // Click handler to open the modal and set the image source
    const handleImageClick = (imageSrc) => {
        setModalImageSrc(imageSrc);
        setIsModalVisible(true);
    };

    // Function to close the modal
    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const handleGoBack = () => {
        navigate(-1);
    }
    return (
        <>
            {
                adminLoginData == null || adminLoginData?.length == 0 ? '' :
                    <div className="mx-auto p-5 mt-10 sm:ml-72 sm:p-4">
                        <div className="min-h-screen py-8 px-4 sm:px-8 lg:px-16">
                            <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
                                <h1 className="text-3xl font-bold mb-8 text-center uppercase">Vendor Details</h1>
                                <div className="flex items-center justify-center space-x-5">
                                    {/* Adjust the size of the profile picture */}
                                    {vendorData?.vendor_profile_picture_url?.images?.[0] ? (
                                        <div className='text-center w-24 h-24 md:w-44 md:h-44 overflow-hidden rounded-full flex items-center justify-center hover:bg-[#00000080] shadow-xl'>
                                            <Image
                                                src={`${AdminUrl}/uploads/vendorProfile/${vendorData?.vendor_profile_picture_url?.images[0]}`}
                                                className="object-cover border-white"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            {/* Placeholder image or alternative text */}
                                            {/* <img src="placeholder-image-url.jpg" alt="Placeholder" className="w-24 h-24 m-3 md:w-44 md:h-44 rounded-full object-cover border-4 border-white shadow-xl" /> */}
                                            <h2>Vendor Profile (No Image)</h2>
                                        </div>
                                    )}

                                    {vendorData?.brand_logo?.images?.[0] ? (
                                        <div className='text-center w-24 h-24 md:w-44 md:h-44 overflow-hidden rounded-full flex items-center justify-center hover:bg-[#00000080] shadow-xl'>
                                            <Image
                                                src={`${AdminUrl}/uploads/vendorBrandLogo/${vendorData?.brand_logo?.images[0]}`}
                                                className="object-cover border-white"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            {/* Placeholder image or alternative text */}
                                            {/* <img src="placeholder-image-url.jpg" alt="Placeholder" className="w-24 h-24 m-3 md:w-44 md:h-44 rounded-full object-cover border-4 border-white shadow-xl" /> */}
                                            <h2>Brand Logo (No Image)</h2>
                                        </div>
                                    )}

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold uppercase text-[#081831]">Basic Information</h3>
                                        <table class="w-full table-auto border-collapse border border-slate-400">
                                            <tbody>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Vendor ID</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.id)}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Mobile Number</span></td>
                                                    <td class="border border-slate-300 p-2">
                                                        {displayValueOrDash(vendorData.country_code)} {displayValueOrDash(vendorData.mobile_number)}<span className="ml-1">{vendorData.mobile_verification_status ? <FiCheckCircle className="text-green-500 inline-block" /> : <FiXCircle className="text-red-500 inline-block" />}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Email</span></td>
                                                    <td class="border border-slate-300 p-2"><a href={`mailto:${displayValueOrDash(vendorData.email)}`} target='_blank'>{displayValueOrDash(vendorData.email)}</a>
                                                        <span className="ml-1">
                                                            {vendorData.email_verification_status ? <FiCheckCircle className="text-green-500 inline-block" /> : <FiXCircle className="text-red-500 inline-block" />}
                                                        </span></td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Brand Name</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.brand_name)}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Business Model</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.business_model)}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Registration Date</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.registration_date)}</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                        {/* <p>
                                            <span className="font-semibold">Vendor ID:</span> {displayValueOrDash(vendorData.id)}
                                        </p>
                                        <p className="flex items-center">
                                            <span className="font-semibold">Mobile Number:</span>{' '}
                                            {displayValueOrDash(vendorData.country_code)} {displayValueOrDash(vendorData.mobile_number)}
                                            <span className="ml-2">
                                                {vendorData.mobile_verification_status ? <FiCheckCircle className="text-green-500" /> : <FiXCircle className="text-red-500" />}
                                            </span>
                                        </p>
                                        <p className="flex items-center">
                                            <span className="font-semibold mr-2">Email:</span> <a href={`mailto:${displayValueOrDash(vendorData.email)}`} target='_blank'>{displayValueOrDash(vendorData.email)}</a>
                                            <span className="ml-2">
                                                {vendorData.email_verification_status ? <FiCheckCircle className="text-green-500" /> : <FiXCircle className="text-red-500" />}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="font-semibold">Brand Name:</span> {displayValueOrDash(vendorData.brand_name)}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Business Model:</span> {displayValueOrDash(vendorData.business_model)}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Registration Date:</span> {displayValueOrDash(vendorData.registration_date)}
                                        </p> */}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold uppercase text-[#081831]">Company Details</h3>
                                        <table class="w-full table-auto border-collapse border border-slate-400">
                                            <tbody>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Company Name</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.company_name)}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Shipping Address</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.shipping_address)}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Country</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.company_country)}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">State</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.company_state)}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">City</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.company_city)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        {/* <p>
                                            <span className="font-semibold">Company Name:</span> {displayValueOrDash(vendorData.company_name)}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Shipping Address:</span> {displayValueOrDash(vendorData.shipping_address)}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Country:</span> {displayValueOrDash(vendorData.company_country)}
                                        </p>
                                        <p>
                                            <span className="font-semibold">State:</span> {displayValueOrDash(vendorData.company_state)}
                                        </p>
                                        <p>
                                            <span className="font-semibold">City:</span> {displayValueOrDash(vendorData.company_city)}
                                        </p> */}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold uppercase text-[#081831]">Bank Details</h3>
                                        <table class="w-full table-auto border-collapse border border-slate-400">
                                            <tbody>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Bank Name</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.bank_name)}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Bank Account Number</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.bank_account_number)}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Bank Routing Number</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.bank_routing_number)}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Bank Account Name</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.bank_account_name)}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Bank Branch</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.bank_branch)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        {/* <p>
                                            <span className="font-semibold">Bank Name:</span> {displayValueOrDash(vendorData.bank_name)}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Bank Account Number:</span> {displayValueOrDash(vendorData.bank_account_number)}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Bank Routing Number:</span> {displayValueOrDash(vendorData.bank_routing_number)}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Bank Account Name:</span> {displayValueOrDash(vendorData.bank_account_name)}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Bank Branch:</span> {displayValueOrDash(vendorData.bank_branch)}
                                        </p> */}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold uppercase text-[#081831]">Social Links</h3>
                                        <table class="w-full table-auto border-collapse border border-slate-400">
                                            <tbody>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Facebook</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.facebook_url)}</td>
                                                </tr>
                                                <tr>
                                                    <td class="border border-slate-300 p-2"><span className="font-semibold">Instagram</span></td>
                                                    <td class="border border-slate-300 p-2">{displayValueOrDash(vendorData.instagram_url)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        {/* <p>
                                            <span className="font-semibold">Facebook:</span> {displayValueOrDash(vendorData.facebook_url)}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Instagram:</span> {displayValueOrDash(vendorData.instagram_url)}
                                        </p> */}
                                    </div>
                                </div>

                                <div className="bg-white">
                                    <div className="">
                                        <h3 className="text-xl font-bold uppercase text-[#081831] mb-4">Products</h3>
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                            {
                                                vendorData.products?.images?.length == 0 || vendorData.products?.length == 0 ?
                                                    'No Products Found....' :
                                                    vendorData.products?.images?.map((product, index) => (
                                                        <a key={index} className="group"
                                                            onClick={() => handleImageClick(`${AdminUrl}/uploads/vendorsProductImages/${product}`)} >
                                                            <div className="p-2 w-full overflow-hidden rounded-lg bg-gray-50 xl:aspect-h-8 xl:aspect-w-7">
                                                                <img
                                                                    src={`${AdminUrl}/uploads/vendorsProductImages/${product}`}
                                                                    alt={product}
                                                                    className="h-full w-full aspect-[4/3] object-contain object-center group-hover:opacity-75"
                                                                />
                                                            </div>
                                                            <h3 className="ml-2 text-sm text-gray-700">{product}</h3>
                                                        </a>
                                                    ))}

                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white">
                                    <div className="">
                                        <h3 className="text-xl font-bold uppercase text-[#081831] mb-4">Trademark Certificate</h3>
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                            {
                                                vendorData.trademark_certificate?.images && vendorData.trademark_certificate != '' && vendorData.trademark_certificate?.images != '' &&
                                                <a className="group" onClick={() => handleImageClick(`${AdminUrl}/uploads/vendorsTrademarkCertificates/${vendorData.trademark_certificate.images}`)}>
                                                    <div className="p-2 w-full overflow-hidden rounded-lg bg-gray-50 xl:aspect-h-8 xl:aspect-w-7">
                                                        <img
                                                            src={`${AdminUrl}/uploads/vendorsTrademarkCertificates/${vendorData.trademark_certificate?.images}`}
                                                            alt={vendorData.trademark_certificate?.images}
                                                            className="h-full w-full aspect-[4/3] object-contain object-center group-hover:opacity-75"
                                                        />
                                                    </div>
                                                    <h3 className="ml-2 text-sm text-gray-700">{vendorData.trademark_certificate?.images}</h3>
                                                </a>
                                            }

                                        </div>
                                    </div>

                                    <div className='flex justify-center space-x-4 mt-5'>
                                        <Button size='xl' className='mt-4 bg-[#081831]' onClick={handleApprove}>Approve Application</Button>
                                        <Button size='xl' className='mt-4' onClick={handleReject} color='red'>Reject Application</Button>
                                        <Button size='xl' onClick={handleGoBack} variant='secondary' icon={FiArrowLeft} className='mt-4 border-[#081831] text-[#081831] hover:text-[#081831]'>Go Back</Button>
                                    </div>
                                </div>

                                <Modal
                                    title="Confirmation"
                                    visible={isModalVisibleNew}
                                    onOk={handleModalOk}
                                    onCancel={handleModalCancel}
                                    okText={`${approvalStatus == 3 ? 'Approve' : 'Reject'}`}
                                    okButtonProps={{ style: { background: approvalStatus == 3 ? 'green' : 'red' } }}
                                >
                                    {approvalStatus === 3 && <p>Are you sure you want to approve the application?</p>}
                                    {approvalStatus === 4 && <p>Are you sure you want to reject the application?</p>}
                                </Modal>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default ViewDetails