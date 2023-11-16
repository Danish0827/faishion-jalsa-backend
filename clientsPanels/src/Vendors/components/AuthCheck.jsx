import React, { useState, useRef } from 'react';
import { Modal } from 'antd';
import { AdminUrl } from '../../Admin/constant';
import Swal from 'sweetalert2';

const AuthCheck = ({ vendorDatastate }) => {
    const id = vendorDatastate?.[0]?.id;
    const [emailOtpFields, setEmailOtpFields] = useState(['', '', '', '']);
    const [mobileOtpFields, setMobileOtpFields] = useState(['', '', '', '']);
    const emailOtpInputRefs = useRef([]);
    const mobileOtpInputRefs = useRef([]);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [verificationType, setVerificationType] = useState(null);

    const openOtpModal = (type) => {
        setVerificationType(type);
        sendOtpVerification(type);
    };

    const closeOtpModal = () => {
        setOtpModalOpen(false);
        setEmailOtpFields(['', '', '', '']);
        setMobileOtpFields(['', '', '', '']);
        setVerificationType(null);
    };

    const handleOtpChange = (type, index, value) => {
        const otpFields = type === 'email' ? emailOtpFields : mobileOtpFields;
        const setOtpFields = type === 'email' ? setEmailOtpFields : setMobileOtpFields;
        const otpInputRefs = type === 'email' ? emailOtpInputRefs : mobileOtpInputRefs;

        if (/^\d*$/.test(value) && value.length <= 1) {
            const updatedOtpFields = [...otpFields];
            updatedOtpFields[index] = value;
            setOtpFields(updatedOtpFields);

            if (index < otpFields.length - 1) {
                otpInputRefs.current[index + 1].disabled = false;
            }

            if (value.length === 1 && otpInputRefs.current[index + 1]) {
                otpInputRefs.current[index + 1].focus();
            }
        }
    };

    const sendOtpVerification = async (type) => {
        try {
            const response = await fetch(`${AdminUrl}/api/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, type })
            });

            if (response.ok) {
                const data = await response.json()
                // Show a success notification using SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: 'OTP Sent',
                    text: `Your OTP has been sent to your ${type === 'email' ? "email" : "mobile"}.`,
                    confirmButtonText: 'OK',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Open the otp verification modal
                        setOtpModalOpen(true);
                    }
                });
            } else {
                // Handle non-200 response status
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `An error occurred while sending verification OTP on your ${type === 'email' ? "email" : "mobile"}. Please try again later.`,
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            // Handle error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while sending verification OTP. Please try again later.',
                confirmButtonText: 'OK',
            });
        }
    }

    const handleVerification = async () => {
        const otpValue = verificationType === 'email' ? emailOtpFields.join('') : mobileOtpFields.join('');

        try {
            const response = await fetch(`${AdminUrl}/api/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ otp: otpValue, id, verificationType }),
            });

            if (response.ok) {
                const data = await response.json();
                const { isValid } = data;

                if (isValid) {
                    // Close the modal
                    closeOtpModal();

                    // Update the verification status based on the verification type
                    if (verificationType === 'email') {
                        vendorDatastate[0].email_verification_status = true;
                    } else if (verificationType === 'mobile') {
                        vendorDatastate[0].mobile_verification_status = true;
                    }

                    // Check if both email and mobile verification are successful
                    if (vendorDatastate[0].email_verification_status && vendorDatastate[0].mobile_verification_status) {
                        // Redirect to the "Vendors" page
                        window.location.href = ('/Vendors');
                    }

                    // Show a success notification using SweetAlert
                    Swal.fire({
                        icon: 'success',
                        title: 'OTP Verified',
                        text: 'Your OTP has been successfully verified.',
                        confirmButtonText: 'OK',
                    });
                } else {
                    // Handle invalid OTP
                    Swal.fire({
                        icon: 'error',
                        title: 'Invalid OTP',
                        text: 'The entered OTP is invalid. Please try again.',
                        confirmButtonText: 'OK',
                    });
                }
            } else {
                // Handle non-200 response status
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while verifying OTP. Please try again later.',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            // Handle error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while verifying OTP. Please try again later.',
                confirmButtonText: 'OK',
            });
        }
    };

    const renderVerificationButton = (type, label, verifiedStatus, oppositeLabel, oppositeVerifiedStatus) => (
        <div className="flex flex-col justify-center px-6 py-4 bg-blue-100 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-500">{`Verify Your ${label}`}</h2>
            {verifiedStatus ? (
                <p className="text-green-600 mb-6">
                    {`Your ${label.toLowerCase()} is verified. Thank you!`}
                </p>
            ) : (
                <>
                    <p className="text-gray-600 mb-6">
                        {`For enhanced account security and seamless communication, verify your ${label.toLowerCase()}.`}
                    </p>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full w-full"
                        onClick={() => openOtpModal(type)}
                    >
                        Verify {label}
                    </button>
                </>
            )}

            {!verifiedStatus && oppositeVerifiedStatus && (
                <p className="text-gray-600 mt-2">
                    {`Your ${oppositeLabel} is verified. Verify your ${label.toLowerCase()} to complete the process.`}
                </p>
            )}
        </div>
    );

    const isEmailVerified = vendorDatastate?.[0]?.email_verification_status;
    const isMobileVerified = vendorDatastate?.[0]?.mobile_verification_status;
    const accountStatus = vendorDatastate?.[0]?.status;

    return (
        accountStatus === 1 || accountStatus === 4 ?
            <div className="flex justify-center items-center h-[80vh] bg-gray-50">
                <div className="bg-white border border-red-300 shadow-lg rounded-lg overflow-hidden w-full md:w-1/2">
                    <div className="p-8">
                        {accountStatus === 1 && (
                            <>
                                <h2 className="text-2xl font-semibold mb-4 text-red-700">Account Blocked by Admin</h2>
                                <p className="text-gray-600 mb-6">
                                    We regret to inform you that your account has been blocked by the administrator due to violation of our terms of service. This action has been taken to maintain the security and integrity of our platform.
                                </p>
                                <p className="text-gray-600 mb-4">
                                    Explanation: Your account was blocked due to repeated violations of our posting guidelines that ensure a safe and reliable experience for all users.
                                </p>
                                <p className="text-gray-600 mb-6">
                                    Steps for Resolution: If you believe this was a mistake or would like to resolve the issue, please contact our support team during our available hours.
                                </p>
                            </>
                        )}
                        {accountStatus === 4 && (
                            <>
                                <h2 className="text-2xl font-semibold mb-4 text-red-700">Account Rejected</h2>
                                <p className="text-gray-600 mb-6">
                                    We regret to inform you that your account has been rejected by the administrator. This decision has been made based on a review of your account information and activities.
                                </p>
                                {/* Add content specific to account rejection */}
                            </>
                        )}
                        <div className="flex md:flex-row flex-col items-center justify-between border-t border-gray-200 pt-6 mt-6">
                            <a href="mailto:support@example.com" className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 mb-2 rounded-full">
                                Contact Support
                            </a>
                            <div className="text-gray-500">
                                <p>Alternatively, you can reach us at:</p>
                                <p className="mt-1">
                                    Email: <a href="mailto:support@example.com" className="text-blue-500">support@example.com</a>
                                </p>
                                <p>
                                    Phone: <a href="tel:+1234567890" className="text-blue-500">+123-456-7890</a>
                                </p>
                                <p className="mt-2 text-sm">
                                    Our support team is available Monday to Friday, 9:00 AM - 5:00 PM.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            :
            <div className="flex justify-center items-center h-[80vh] bg-gray-100">
                <div className="w-4/5 md:w-2/3 bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-4xl font-bold mb-8 text-center">Account Verification</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {renderVerificationButton('email', 'Email', isEmailVerified, 'Mobile Number', isMobileVerified)}
                        {renderVerificationButton('mobile', 'Mobile Number', isMobileVerified, 'Email', isEmailVerified)}
                    </div>
                </div>
                <Modal
                    visible={otpModalOpen}
                    onCancel={closeOtpModal}
                    onOk={handleVerification}
                    okText="Verify"
                    okButtonProps={{
                        style: {
                            backgroundColor: '#2196F3',
                            borderColor: '#2196F3',
                            pointerEvents: verificationType === 'email'
                                ? emailOtpFields.every(field => field.length > 0) ? 'auto' : 'none'
                                : mobileOtpFields.every(field => field.length > 0) ? 'auto' : 'none',
                        },
                    }}
                    closable={!verificationType ? true : (verificationType === 'email'
                        ? !emailOtpFields.every(field => field.length > 0)
                        : !mobileOtpFields.every(field => field.length > 0))}
                    maskClosable={!verificationType ? true : (verificationType === 'email'
                        ? !emailOtpFields.every(field => field.length > 0)
                        : !mobileOtpFields.every(field => field.length > 0))}
                >
                    <h2 className="text-xl font-semibold mb-4">{`${verificationType === 'email' ? 'Email' : 'Mobile'} Verification`}</h2>
                    <p className="text-gray-600 mb-6">
                        {`Please enter the 4-digit OTP sent to your ${verificationType === 'email' ? 'email' : 'mobile'} address.`}
                    </p>
                    <div className="flex justify-center">
                        {verificationType === 'email' ? (
                            emailOtpFields.map((otp, index) => (
                                <input
                                    key={index}
                                    ref={(ref) => (emailOtpInputRefs.current[index] = ref)}
                                    type="text"
                                    value={otp}
                                    onChange={(e) => handleOtpChange('email', index, e.target.value)}
                                    className="border rounded-md px-3 py-2 w-12 text-center mx-1"
                                    maxLength={1}
                                    disabled={index !== 0}
                                />
                            ))
                        ) : (
                            mobileOtpFields.map((otp, index) => (
                                <input
                                    key={index}
                                    ref={(ref) => (mobileOtpInputRefs.current[index] = ref)}
                                    type="text"
                                    value={otp}
                                    onChange={(e) => handleOtpChange('mobile', index, e.target.value)}
                                    className="border rounded-md px-3 py-2 w-12 text-center mx-1"
                                    maxLength={1}
                                    disabled={index !== 0}
                                />
                            ))
                        )}
                    </div>
                </Modal>
            </div>
    );
};

export default AuthCheck;
